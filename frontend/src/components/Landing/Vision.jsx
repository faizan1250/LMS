import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Target, Users, GraduationCap, Sparkles, Quote } from 'lucide-react';

const Vision = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col-reverse md:flex-row p-6 md:p-16 bg-gradient-to-r from-[#F9FAFB] to-[#F0F4FF]"
    >
      {/* Text Section */}
      <div className="w-full md:w-3/5 md:pr-10 mt-8 md:mt-0">
        <p className="text-indigo-600 font-medium uppercase tracking-wider mb-3 flex items-center">
          <Target size={18} className="mr-2" /> Our Vision
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight text-gray-800">
          Empowering Learners Through Accessible Education
        </h1>
        <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-700 font-normal leading-relaxed">
          We're dedicated to making quality education accessible to everyone, regardless of their background or location. At <span className="font-semibold text-[#5A7FF1]">LearnHub</span>, we believe that learning should have no boundaries and that everyone deserves the opportunity to grow and develop their skills.

          Our platform breaks down traditional barriers by offering <span className="font-semibold text-[#5A7FF1]">comprehensive, engaging learning experiences</span>, helping students acquire <span className="font-semibold text-[#5A7FF1]">valuable knowledge</span>, build <span className="font-semibold text-[#5A7FF1]">practical skills</span>, and achieve their educational goals.

          We're not just another learning platform—we're a <span className="font-semibold text-[#5A7FF1]">community committed to democratizing education</span> and empowering learners to reach their full potential.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
            <Users size={20} className="text-blue-500 mr-2" />
            <span>100,000+ Learners</span>
          </div>
          <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
            <GraduationCap size={20} className="text-blue-500 mr-2" />
            <span>500+ Expert Instructors</span>
          </div>
          <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
            <Sparkles size={20} className="text-blue-500 mr-2" />
            <span>95% Completion Rate</span>
          </div>
        </div>

        <div className="mt-6 p-4 border-l-4 border-indigo-500 bg-indigo-50 text-indigo-900 rounded-md flex">
          <Quote size={24} className="text-indigo-400 mr-3 flex-shrink-0" />
          <p className="italic text-lg">
            "Education is the most powerful weapon which you can use to change the world. We're here to make that weapon accessible to everyone." — Our Team
          </p>
        </div>

        {/* CTA Button */}
        <button className="mt-8 bg-[#5A7FF1] text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 flex items-center">
          <Sparkles size={20} className="mr-2" />
          Start Learning Now
        </button>
      </div>

      {/* Icon Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        className="w-full md:w-2/5 mb-6 md:mb-0 flex justify-center items-center"
      >
        <div className="relative w-full max-w-md">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl transform rotate-3"></div>
          <div className="relative bg-white p-10 rounded-2xl shadow-lg flex flex-col items-center">
            <div className="bg-blue-50 p-6 rounded-full mb-6">
              <Target size={60} className="text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 text-center mb-4">Our Mission</h3>
            <p className="text-gray-600 text-center">
              To provide accessible, high-quality education that empowers individuals and transforms communities through innovative learning solutions.
            </p>
            <div className="mt-6 flex space-x-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <GraduationCap size={24} className="text-blue-600" />
              </div>
              <div className="bg-purple-100 p-2 rounded-lg">
                <Users size={24} className="text-purple-600" />
              </div>
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Sparkles size={24} className="text-indigo-600" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Vision;