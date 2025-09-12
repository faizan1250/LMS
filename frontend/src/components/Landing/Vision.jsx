import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Target, Users, GraduationCap, Sparkles, Quote, ArrowRight, BookOpen, Globe, Heart } from 'lucide-react';

const Vision = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <div className="relative py-20 overflow-hidden bg-gradient-to-br from-[#f5f7ff] to-[#e8eeff]">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#5A7FF1]/10 to-[#C6A96C]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#0A1428]/10 to-[#4660d9]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col lg:flex-row gap-12 items-center"
        >
          {/* Icon Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            className="w-full lg:w-2/5 flex justify-center"
          >
            <div className="relative w-full max-w-md">
              {/* Floating background elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-[#5A7FF1]/20 to-[#0A1428]/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-gradient-to-br from-[#C6A96C]/20 to-[#8B6122]/20 rounded-full blur-xl"></div>
              
              <motion.div 
                className="p-8 rounded-2xl flex flex-col items-center h-full"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05), inset 0 -1px 0 rgba(255, 255, 255, 0.5)',
                }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <motion.div 
                  className="bg-gradient-to-br from-[#5A7FF1] to-[#0A1428] p-5 rounded-2xl mb-6 text-white"
                  whileHover={{ 
                    rotate: 5,
                    transition: { duration: 0.3 } 
                  }}
                >
                  <Target size={60} />
                </motion.div>
                <h3 className="text-2xl font-semibold text-gray-900 text-center mb-4">Our Mission</h3>
                <p className="text-gray-700 text-center mb-6">
                  To provide accessible, high-quality education that empowers individuals and transforms communities through innovative learning solutions.
                </p>
                <div className="flex space-x-4 mt-4">
                  <motion.div 
                    className="bg-white/80 p-3 rounded-xl shadow-sm"
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  >
                    <BookOpen size={24} className="text-[#5A7FF1]" />
                  </motion.div>
                  <motion.div 
                    className="bg-white/80 p-3 rounded-xl shadow-sm"
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  >
                    <Globe size={24} className="text-[#C6A96C]" />
                  </motion.div>
                  <motion.div 
                    className="bg-white/80 p-3 rounded-xl shadow-sm"
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  >
                    <Heart size={24} className="text-[#4660d9]" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Text Section */}
          <div className="w-full lg:w-3/5">
            <motion.p 
              className="text-base font-medium mb-4 inline-flex items-center px-4 py-1 rounded-full bg-[#5A7FF1]/10 text-[#5A7FF1]"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Target size={18} className="mr-2" /> Our Vision
            </motion.p>
            
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              Empowering Learners Through <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5A7FF1] to-[#0A1428]">Accessible Education</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-700 mb-8 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              We're dedicated to making quality education accessible to everyone, regardless of their background or location. At <span className="font-semibold text-[#5A7FF1]">LearnHub</span>, we believe that learning should have no boundaries and that everyone deserves the opportunity to grow and develop their skills.
            </motion.p>

            <motion.p 
              className="text-lg text-gray-700 mb-8 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              Our platform breaks down traditional barriers by offering <span className="font-semibold text-[#5A7FF1]">comprehensive, engaging learning experiences</span>, helping students acquire <span className="font-semibold text-[#5A7FF1]">valuable knowledge</span>, build <span className="font-semibold text-[#5A7FF1]">practical skills</span>, and achieve their educational goals.
            </motion.p>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.7 }}
            >
              {[
                { icon: <Users size={20} />, value: "100,000+", label: "Learners", color: "from-[#5A7FF1] to-[#0A1428]" },
                { icon: <GraduationCap size={20} />, value: "500+", label: "Expert Instructors", color: "from-[#C6A96C] to-[#8B6122]" },
                { icon: <Sparkles size={20} />, value: "95%", label: "Completion Rate", color: "from-[#0A1428] to-[#4660d9]" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="p-4 rounded-xl flex flex-col items-center text-center"
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className={`bg-gradient-to-br ${stat.color} p-2 rounded-lg text-white mb-2`}>
                    {stat.icon}
                  </div>
                  <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br ${stat.color}">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              className="p-6 rounded-2xl mb-8 flex"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7, duration: 0.7 }}
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05), inset 0 -1px 0 rgba(255, 255, 255, 0.5)',
              }}
            >
              <Quote size={28} className="text-[#5A7FF1] mr-4 flex-shrink-0 mt-1" />
              <p className="text-lg italic text-gray-800">
                "Education is the most powerful weapon which you can use to change the world. We're here to make that weapon accessible to everyone." — Our Team
              </p>
            </motion.div>

            <motion.button
              className="relative px-8 py-4 rounded-xl font-medium overflow-hidden group"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.7 }}
              whileHover="hover"
              style={{
                background: `linear-gradient(135deg, #5A7FF1 0%, #4660d9 100%)`,
                boxShadow: `0 10px 30px rgba(90, 127, 241, 0.4)`,
              }}
            >
              <motion.span
                className="absolute inset-0 z-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full"
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              />
              <span className="relative z-1 text-white flex items-center justify-center">
                <Sparkles size={20} className="mr-2" />
                Start Learning Now
                <ArrowRight size={20} className="ml-2" />
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Vision;