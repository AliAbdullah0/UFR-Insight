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
        hidden: true, // ✅ This hides the red line by default
      },
    ],
  };
  const chartOptions = {
    responsive: true, // Makes the chart responsive
    maintainAspectRatio: false, // Allows custom height adjustments
    plugins: {
      legend: {
        labels: {
          color: "#D1D5DB", // Tailwind text-gray-300 for dark mode
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#6B7280", // Tailwind text-gray-500
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

      <motion.div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 w-full max-w-md ">
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
          <label className="block text-gray-700 dark:text-gray-300 mb-2"> Patient Dry Weight (kg)</label>
          <input
            type="number"
            value={patientWeight}
            onChange={(e) => setPatientWeight(e.target.value)}
            placeholder="e.g. 70"
            className="w-full px-3 py-2 outline-none rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2"> Treatment Duration (hrs)</label>
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
      </motion.div>

      <div className="mt-20 w-full flex flex-col md:flex-row gap-6">
      <div className="md:w-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
  <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-4">
    UFR Trend Over Time
  </h3>
  <div className="h-[300px] sm:h-[400px] md:h-[450px]"> {/* Chart Box Adjusted */}
    <Line data={chartData} options={chartOptions} /> {/* Pass new options */}
  </div>
</div>



        <div className="md:w-1/2 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Understanding the Graph
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            The <span className="text-blue-500">blue line</span> represents the historical UFR values recorded by all users of this calculator.
            The <span className="text-red-400">red dashed line</span> indicates the safe threshold (13 ml/kg/hr).
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            _This graph does not display individual user data but shows a cumulative trend of all UFR calculations
            made through this calculator._
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default UfrCalculator;
