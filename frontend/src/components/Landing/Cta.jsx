import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, Sparkles, Users, Award, Clock } from 'lucide-react';

const Cta = () => {
  return (
    <div className="relative py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#5A7FF1]/20 to-[#C6A96C]/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#0A1428]/20 to-[#4660d9]/20 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        className="max-w-6xl mx-auto px-4 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <div className="p-10 rounded-3xl text-center"
          style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1), inset 0 -1px 0 rgba(255, 255, 255, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-gradient-to-br from-[#5A7FF1] to-[#0A1428] p-5 rounded-2xl text-white shadow-lg">
              <GraduationCap size={40} />
            </div>
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            Ready to Start Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5A7FF1] to-[#0A1428]">Learning Journey</span>?
          </motion.h2>
          
          <motion.p 
            className="mb-10 text-xl text-gray-700 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Join thousands of students who are already advancing their skills with our comprehensive courses and expert instructors.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            {[
              { icon: <Users size={18} />, text: "100,000+ Learners" },
              { icon: <Award size={18} />, text: "Expert Instructors" },
              { icon: <Clock size={18} />, text: "Self-Paced Learning" },
            ].map((item, index) => (
              <div key={index} className="flex items-center bg-white/80 px-4 py-2 rounded-full shadow-sm">
                <div className="bg-[#5A7FF1]/10 p-1 rounded-full mr-2">
                  {item.icon}
                </div>
                <span className="text-sm text-gray-700">{item.text}</span>
              </div>
            ))}
          </motion.div>
          
          <motion.button 
            className="relative px-8 py-4 rounded-xl font-medium overflow-hidden group mx-auto"
            whileHover="hover"
            initial="initial"
            style={{
              background: `linear-gradient(135deg, #5A7FF1 0%, #4660d9 100%)`,
              boxShadow: `0 15px 35px rgba(90, 127, 241, 0.4)`,
            }}
          >
            <motion.span
              className="absolute inset-0 z-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full"
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            />
            <span className="relative z-1 text-white flex items-center justify-center text-lg font-semibold">
              <Sparkles size={20} className="mr-2" />
              Start Learning Now
              <ArrowRight size={20} className="ml-2" />
            </span>
          </motion.button>
          
          <motion.p 
            className="mt-6 text-gray-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.7 }}
          >
            No credit card required. Free trial includes access to 50+ courses.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Cta;