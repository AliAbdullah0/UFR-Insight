import React from 'react';
import { motion } from "framer-motion";

function Hero() {
  return (
    <section className="relative flex items-center justify-center min-h-[80vh] bg-gray-100 dark:bg-gray-900 px-4 overflow-hidden">
      
      {/* Wavy Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <svg className="absolute bottom-0 w-full h-40 md:h-64" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#3B82F6" fillOpacity="0.3" d="M0,192L48,165.3C96,139,192,85,288,69.3C384,53,480,75,576,112C672,149,768,203,864,197.3C960,192,1056,128,1152,128C1248,128,1344,192,1392,224L1440,256V320H0Z"></path>
          <path fill="#1E40AF" fillOpacity="0.5" d="M0,320L48,277.3C96,235,192,149,288,128C384,107,480,149,576,186.7C672,224,768,256,864,245.3C960,235,1056,181,1152,149.3C1248,117,1344,107,1392,101.3L1440,96V320H0Z"></path>
        </svg>
      </div>

      {/* Hero Content */}
      <div className="max-w-screen-xl text-center">
        <motion.h1 
          className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl lg:text-6xl opacity-0"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Calculate Your Ultrafiltration Rate (UFR)
        </motion.h1>

        <motion.p 
          className="mt-6 text-lg text-gray-600 dark:text-gray-300 sm:text-xl opacity-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Easily determine your ultrafiltration rate to ensure safe and effective dialysis.
        </motion.p>

        <motion.div 
          className="flex flex-col items-center gap-4 mt-8 sm:flex-row sm:justify-center opacity-0"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <a href="#ufr-calculator" className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Calculate UFR
          </a>
          <a href="#about" className="px-6 py-3 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-800">
            Learn More
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
