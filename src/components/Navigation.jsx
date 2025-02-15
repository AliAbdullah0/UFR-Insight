import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa"; 

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700 shadow-md">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          {/* Logo */}
          <a href="#" className="text-2xl font-bold text-blue-600 dark:text-white tracking-wide">
            UFR Insight
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center p-2 w-10 h-10 justify-center rounded-lg md:hidden 
            hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition"
          >
            <span className="sr-only">Open menu</span>
            <FaBars className="text-2xl text-gray-900 dark:text-white" />
          </button>

          {/* Desktop Navbar */}
          <div className="hidden md:block">
            <ul className="font-medium flex space-x-8">
              <li><a href="#" className="block py-2 px-3 text-gray-900 dark:text-white hover:text-blue-600 transition">Home</a></li>
              <li><a href="#ufr-calculator" className="block py-2 px-3 text-gray-900 dark:text-white hover:text-blue-600 transition">Calculator</a></li>
              <li><a href="#about" className="block py-2 px-3 text-gray-900 dark:text-white hover:text-blue-600 transition">About</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Side Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Mobile Side Drawer */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? "0%" : "-100%" }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 shadow-xl z-50 flex flex-col"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        {/* Drawer Links */}
        <div className="flex-1 px-6 py-4">
          <ul className="space-y-4">
            <li><a href="#" className="block py-3 px-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition"> Home</a></li>
            <li><a href="#ufr-calculator" className="block py-3 px-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition"> Calculator</a></li>
            <li><a href="#about" className="block py-3 px-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition"> About</a></li>
          </ul>
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-gray-300 dark:border-gray-700 p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} UFR Insight. All Rights Reserved.
          </p>
        </div>
      </motion.div>
    </>
  );
}

export default Navigation;
