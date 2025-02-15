import React from "react";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white py-4 mt-10 transition-colors">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        {/* Left Side - Copyright */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} Ali Abdullah. All rights reserved.
        </p>

        {/* Right Side - GitHub Link */}
        <a
          href="https://github.com/AliAbdullah0"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
        >
          <FaGithub className="text-xl" />
          <span>GitHub</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
