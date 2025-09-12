import React from 'react';
import { motion } from 'framer-motion';
import heroImg from '../../assets/lms-hero-image.jpg';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#f5f7ff] to-[#e8eeff] py-16 md:py-24">
      {/* Background elements for depth */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-r from-[#5A7FF1]/5 to-[#C6A96C]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gradient-to-r from-[#0A1428]/5 to-[#4660d9]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row justify-between items-center gap-12 relative z-10">
        {/* Text Content */}
        <motion.div
          className="w-full md:w-1/2 text-center md:text-left"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.6, 0.05, 0.01, 0.9],
            delay: 0.2
          }}
        >
          <motion.p 
            className="text-base font-medium mb-4 inline-block px-4 py-1 rounded-full bg-[#5A7FF1]/10 text-[#5A7FF1]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Transform Your Learning Experience
          </motion.p>
          
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Learn Without <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5A7FF1] to-[#0A1428]">Limits</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg text-gray-700 mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            Access thousands of courses, track your progress, and achieve your learning goals with our comprehensive learning platform.
          </motion.p>

          <motion.div 
            className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <motion.button
              className="relative w-full md:w-auto px-8 py-4 rounded-xl font-medium overflow-hidden group"
              whileHover="hover"
              initial="initial"
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
                Explore Courses
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </motion.button>

            <motion.button
              className="relative w-full md:w-auto px-8 py-4 rounded-xl font-medium group overflow-hidden border"
              whileHover="hover"
              initial="initial"
              style={{
                color: '#0A1428',
                border: `1.5px solid rgba(90, 127, 241, 0.3)`,
                background: `rgba(255, 255, 255, 0.6)`,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
            >
              <motion.span
                className="absolute inset-0 z-0 w-0 bg-gradient-to-r from-[#f5f7ff] to-[#e8eeff]"
                variants={{ hover: { width: '100%' } }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
              <span className="relative z-1 flex items-center justify-center">
                How It Works
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </motion.button>
          </motion.div>

          <motion.div 
            className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.7 }}
          >
            {[
              { text: "10,000+ Courses", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
              { text: "Expert Instructors", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
              { text: "Lifetime Access", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="flex items-center bg-white/50 rounded-lg px-4 py-2 backdrop-blur-sm"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#5A7FF1] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Image */}
        <motion.div
          className="w-full md:w-1/2 flex justify-center"
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.6, 0.05, 0.01, 0.9],
            delay: 0.4
          }}
        >
          <div className="relative">
            <motion.div 
              className="absolute -inset-6 bg-gradient-to-r from-[#5A7FF1] to-[#C6A96C] rounded-2xl opacity-20 blur-xl"
              animate={{ 
                rotate: [0, 3, 0, -3, 0],
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            ></motion.div>
            
            <motion.img 
              src={heroImg} 
              className="relative w-full max-w-md rounded-2xl shadow-2xl z-10"
              alt="Students learning online with laptops and books"
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
            />
            
            <motion.div 
              className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/80 rounded-2xl shadow-lg backdrop-blur-sm p-4 z-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              whileHover={{ rotate: 5, transition: { duration: 0.3 } }}
            >
              <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#5A7FF1] to-[#0A1428] rounded-xl text-white text-xs font-bold text-center p-2">
                Interactive Learning
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute -top-6 -right-6 w-20 h-20 bg-white/80 rounded-2xl shadow-lg backdrop-blur-sm p-3 z-20"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              whileHover={{ rotate: -5, transition: { duration: 0.3 } }}
            >
              <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#C6A96C] to-[#8B6122] rounded-xl text-white text-xs font-bold text-center p-2">
                Certified Courses
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Hero;