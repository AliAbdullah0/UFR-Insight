import React, { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../supabase/SupabaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const About = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("feedback").insert([formData]);

    if (error) {
      console.error("Error submitting feedback:", error);
      toast.error("❌ Failed to submit feedback. Please try again.");
    } else {
      toast.success("✅ Thank you for your feedback!");
      setFormData({ name: "", email: "", message: "" });
    }

    setLoading(false);
  };

  return (
    <motion.section
      className="w-full min-h-screen flex flex-col items-center justify-center p-8 bg-gray-100 dark:bg-gray-900"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 1 }}
    >
      <motion.h2 id="about" className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">
        About UFR Insight
      </motion.h2>

      <motion.p className="text-gray-600 dark:text-gray-300 text-center max-w-2xl mb-8">
        This platform provides a <span className="font-semibold">Ultrafiltration Rate (UFR) Calculator</span> for dialysis patients and healthcare 
        providers to track UFR trends. Users can calculate their <span className="font-semibold">UFR values</span> and analyze data collected 
        from all users for better health insights.
      </motion.p>

      {/* Feedback Form Section */}
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-4">
          Send Us Your Feedback
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="w-full px-3 py-2 outline-none rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Your Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-3 py-2 outline-none rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Message Field */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Your Feedback</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Share your thoughts..."
              required
              rows="4"
              className="w-full px-3 py-2 outline-none rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg flex items-center justify-center gap-2
            hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              "Submit Feedback"
            )}
          </button>
        </form>
      </div>

      {/* Toast Notification */}
      <ToastContainer position="top-center" autoClose={3000} />
    </motion.section>
  );
};

export default About;
