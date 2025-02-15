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

  useEffect(() => {
    const fetchUfrData = async () => {
      const { data, error } = await supabase
        .from("ufr_data")
        .select("ufr, created_at")
        .order("created_at", { ascending: true });

      if (!error) setUfrHistory(data);
    };

    fetchUfrData();
  }, []);

  const saveToSupabase = async (data) => {
    const { error } = await supabase.from("ufr_data").insert([data]);
    if (error) console.error("Error saving data:", error);
  };

  const calculateUFR = async () => {
    const fluidRemovedLiters = parseFloat(fluidRemoved) / 1000;
    const weight = parseFloat(patientWeight);
    const time = parseFloat(treatmentTime);

    if (isNaN(fluidRemovedLiters) || isNaN(weight) || isNaN(time) || time <= 0 || weight <= 0) {
      setUfr(null);
      setRemark("❌ Please enter valid numbers for all fields.");
      return;
    }

    const calculatedUFR = (fluidRemovedLiters * 1000) / (weight * time);
    setUfr(calculatedUFR.toFixed(2));

    const newRemark =
      calculatedUFR <= 13
        ? "✅ Safe: The UFR is below 13 ml/kg/hr, which is considered safe."
        : "⚠️ At Risk: The UFR is above 13 ml/kg/hr, which is considered at risk.";

    setRemark(newRemark);

    await saveToSupabase({
      fluid_removed: fluidRemoved,
      patient_weight: patientWeight,
      treatment_time: treatmentTime,
      ufr: calculatedUFR.toFixed(2),
      created_at: new Date().toISOString(),
    });

    const { data, error } = await supabase
      .from("ufr_data")
      .select("ufr, created_at")
      .order("created_at", { ascending: true });

    if (!error) setUfrHistory(data);
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
      {
        label: "Safe UFR Threshold (13 ml/kg/hr)",
        data: Array(ufrHistory.length).fill(13),
        borderColor: "#EF4444",
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        hidden: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#D1D5DB",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#6B7280",
        },
      },
      y: {
        ticks: {
          color: "#6B7280",
        },
      },
    },
  };

  return (
    <motion.section
      className="w-full min-h-screen dark:bg-gray-900 flex flex-col items-center justify-center p-8"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 1 }}
    >
      <motion.h2 id="ufr-calculator" className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">
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

        <button
          onClick={calculateUFR}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Calculate UFR
        </button>

        {ufr !== null && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
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
    </motion.section>
  );
};

export default UfrCalculator;
