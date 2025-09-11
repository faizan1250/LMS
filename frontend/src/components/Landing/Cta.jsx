import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight } from 'lucide-react';

const Cta = () => {
  return (
    <motion.div
      className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-6 text-center mt-24"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-white/20 p-4 rounded-full">
            <GraduationCap size={40} className="text-white" />
          </div>
        </motion.div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Start Your Learning Journey?
        </h2>
        <p className="mb-8 text-lg max-w-2xl mx-auto opacity-90">
          Join thousands of students who are already advancing their skills with our comprehensive courses and expert instructors.
        </p>
        
        <motion.button 
          className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center mx-auto shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Learning Now
          <ArrowRight size={20} className="ml-2" />
        </motion.button>
        
        <p className="mt-6 text-sm opacity-80">
          No credit card required. Free trial includes access to 50+ courses.
        </p>
      </div>
    </motion.div>
  );
};

export default Cta;