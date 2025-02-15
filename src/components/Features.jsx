import React from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";

// Register Chart.js components
Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Features = () => {
  const countries = ["USA", "UK", "India", "Germany", "Brazil", "Japan", "Canada", "Pakistan"];
  const ufrRates = [8.5, 6.9, 10.2, 7.8, 9.1, 6.5, 7.4, 9.8];

  // Donut Chart Data
  const donutData = {
    labels: countries,
    datasets: [
      {
        label: "UFR Levels (ml/kg/hr)",
        data: ufrRates,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9966FF", "#FFA500", "#8A2BE2", "#FF4500"],
        hoverOffset: 4,
      },
    ],
  };

  // Bar Chart Data
  const barData = {
    labels: countries,
    datasets: [
      {
        label: "UFR (ml/kg/hr)",
        data: ufrRates,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9966FF", "#FFA500", "#8A2BE2", "#FF4500"],
        borderColor: "#ddd",
        borderWidth: 1,
      },
    ],
  };

  // Chart options for dark mode text color
  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: "#60A5FA", // Default text-gray-900 for light mode
          font: { size: 14 },
        },
      },
    },
  };

  const darkModeChartOptions = {
    plugins: {
      legend: {
        labels: {
          color: "#60A5FA", // text-gray-300 for dark mode
          font: { size: 14 },
        },
      },
    },
  };

  return (
    <motion.section
      className="w-full bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-8"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} // ✅ Triggers animation only the first time
      transition={{ duration: 1 }}
    >
      <motion.h2
        className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} // ✅ Ensures title animates only once
        transition={{ duration: 1, delay: 0.2 }}
      >
        Ultrafiltration Rate (UFR) Across Countries
      </motion.h2>

      <motion.p
        className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-3xl"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} // ✅ Paragraph animation happens only once
        transition={{ duration: 1, delay: 0.4 }}
      >
        UFR is a critical dialysis parameter measuring fluid removal per unit of body weight.  
        Values above <strong>10 ml/kg/hr</strong> may increase cardiovascular risks.
      </motion.p>

      {/* Graphs Section */}
      <motion.div
        className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }} // ✅ Ensures graphs animate only once
        transition={{ duration: 1, delay: 0.6 }}
      >
        <div className="flex justify-center">
          <Doughnut data={donutData} options={darkModeChartOptions} />
        </div>
        <div className="flex justify-center">
          <Bar data={barData} options={darkModeChartOptions} />
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Features;
