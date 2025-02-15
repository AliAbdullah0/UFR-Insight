import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../supabase/SupabaseClient";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const UfrCalculator = () => {
  const [fluidRemoved, setFluidRemoved] = useState("");
  const [patientWeight, setPatientWeight] = useState("");
  const [treatmentTime, setTreatmentTime] = useState("");
  const [ufr, setUfr] = useState(null);
  const [remark, setRemark] = useState("");
  const [ufrHistory, setUfrHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(true);

  useEffect(() => {
    const fetchUfrData = async () => {
      setChartLoading(true);
      const { data, error } = await supabase
        .from("ufr_data")
        .select("ufr, remark, created_at")
        .order("created_at", { ascending: true });

      if (!error) {
        setUfrHistory(data);
      }
      setChartLoading(false);
    };

    fetchUfrData();
  }, []);

  const saveToSupabase = async (data) => {
    const { error } = await supabase.from("ufr_data").insert([data]);
    if (error) {
      console.error("Error saving data:", error);
      setError("❌ Failed to save data. Please try again.");
    }
  };

  const calculateUFR = async () => {
    setError("");
    setLoading(true);

    const fluidRemovedLiters = parseFloat(fluidRemoved) / 1000;
    const weight = parseFloat(patientWeight);
    const time = parseFloat(treatmentTime);

    if (
      isNaN(fluidRemovedLiters) ||
      isNaN(weight) ||
      isNaN(time) ||
      fluidRemovedLiters <= 0 ||
      weight <= 0 ||
      time <= 0
    ) {
      setUfr(null);
      setRemark("❌ Please enter valid positive numbers for all fields.");
      setLoading(false);
      return;
    }

    if (time > 24) {
      setUfr(null);
      setRemark("❌ Treatment time cannot exceed 24 hours.");
      setLoading(false);
      return;
    }

    const calculatedUFR = (fluidRemovedLiters * 1000) / (weight * time);
    const formattedUFR = calculatedUFR.toFixed(2);
    setUfr(formattedUFR);

    const newRemark =
      calculatedUFR <= 13
        ? "✅ Safe: The UFR is below 13 ml/kg/hr, which is considered safe."
        : "⚠️ At Risk: The UFR is above 13 ml/kg/hr, which is considered at risk.";

    setRemark(newRemark);

    await saveToSupabase({
      fluid_removed: fluidRemoved,
      patient_weight: patientWeight,
      treatment_time: treatmentTime,
      ufr: formattedUFR,
      remark: newRemark, // ✅ Fix: Ensure "remark" is not NULL
      created_at: new Date().toISOString(),
    });

    const { data, error } = await supabase
      .from("ufr_data")
      .select("ufr, remark, created_at")
      .order("created_at", { ascending: true });

    if (!error) setUfrHistory(data);
    setLoading(false);
  };

  const chartData = {
    labels: ufrHistory.map((d) => new Date(d.created_at).toLocaleDateString()),
    datasets: [
      {
        label: "UFR Rate (ml/kg/hr)",
        data: ufrHistory.map((d) => parseFloat(d.ufr)),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  return (
    <motion.section
      className="w-full min-h-screen dark:bg-gray-900 flex flex-col items-center justify-center p-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">
        Ultrafiltration Rate (UFR) Calculator
      </motion.h2>

      <motion.div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 w-full max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Fluid Removed (ml)</label>
          <input
            type="number"
            value={fluidRemoved}
            onChange={(e) => setFluidRemoved(e.target.value)}
            placeholder="e.g. 2500"
            className="w-full px-3 py-2 outline-none rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Patient Dry Weight (kg)</label>
          <input
            type="number"
            value={patientWeight}
            onChange={(e) => setPatientWeight(e.target.value)}
            placeholder="e.g. 70"
            className="w-full px-3 py-2 outline-none rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Treatment Duration (hrs)</label>
          <input
            type="number"
            value={treatmentTime}
            onChange={(e) => setTreatmentTime(e.target.value)}
            placeholder="e.g. 4"
            className="w-full px-3 py-2 outline-none rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>

        <motion.button
          onClick={calculateUFR}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg flex justify-center items-center hover:bg-blue-700"
          whileTap={{ scale: 0.95 }}
          disabled={loading}
        >
          {loading ? (
            <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
          ) : (
            "Calculate UFR"
          )}
        </motion.button>

        {/* 📌 Result Display (Shows calculated UFR and remark) */}
        {ufr !== null && (
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Result:</h3>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>UFR:</strong> {ufr} ml/kg/hr
            </p>
            <p className={`mt-2 font-medium ${ufr <= 13 ? "text-green-500" : "text-yellow-500"}`}>
              {remark}
            </p>
          </div>
        )}

      </motion.div>

      {/* Chart Section with Skeleton Loader */}
      <div className="mt-10 w-full flex flex-col md:flex-row gap-6">
        {/* 📊 UFR Graph Section */}
        <div className="md:w-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-4">
            UFR Trend Over Time
          </h3>

          {/* 📌 Skeleton Loader for Chart */}
          {chartLoading ? (
            <div className="h-[400px] flex justify-center items-center">
              <div className="animate-pulse w-full h-full bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            </div>
          ) : (
            <div className="h-[400px]">
              <Line data={chartData} />
            </div>
          )}
        </div>

        {/* ℹ️ Understanding the Graph Section */}
        <div className="md:w-1/2 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Understanding the Graph
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            The <span className="text-blue-500">blue line</span> represents the historical UFR values
            recorded by all users of this calculator.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            The <span className="text-red-400">red dashed line</span> indicates the <span className="font-semibold"> safe threshold </span>(13 ml/kg/hr).
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <em>
              This graph does not display individual user data, but rather a cumulative trend
              of all UFR calculations made through this calculator.
            </em>
          </p>
        </div>
      </div>

    </motion.section>
  );
};

export default UfrCalculator;
