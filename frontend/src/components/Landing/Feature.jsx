import React from 'react'
import { motion } from 'framer-motion'

import courseLibrary from '../../assets/course-library.png'
import progressTracking from '../../assets/progress-tracking.png'
import assignments from '../../assets/assignments.png'
import certifications from '../../assets/certifications.png'
import discussions from '../../assets/discussions.png'
import mobileLearning from '../../assets/mobile-learning.png'
import instructor from '../../assets/instructor.png'
import analytics from '../../assets/analytics.png'

const Feature = () => {
  const features = [
    {
      logo: courseLibrary,
      name: 'Comprehensive Course Library',
      desc: 'Access thousands of courses across diverse subjects, curated by industry experts and educators.',
      color: 'from-[#5A7FF1] to-[#0A1428]'
    },
    {
      logo: progressTracking,
      name: 'Personalized Progress Tracking',
      desc: 'Monitor your learning journey with detailed analytics and customized recommendations.',
      color: 'from-[#C6A96C] to-[#8B6122]'
    },
    {
      logo: assignments,
      name: 'Interactive Assignments',
      desc: 'Reinforce learning with hands-on projects, quizzes, and practical exercises.',
      color: 'from-[#0A1428] to-[#4660d9]'
    },
    {
      logo: certifications,
      name: 'Recognized Certifications',
      desc: 'Earn valuable credentials that demonstrate your skills to employers and peers.',
      color: 'from-[#5A7FF1] to-[#C6A96C]'
    },
    {
      logo: discussions,
      name: 'Collaborative Learning',
      desc: 'Engage with peers and instructors through forums, group projects, and live sessions.',
      color: 'from-[#4660d9] to-[#0A1428]'
    },
    {
      logo: mobileLearning,
      name: 'Mobile Learning',
      desc: 'Learn anytime, anywhere with our fully responsive platform optimized for all devices.',
      color: 'from-[#8B6122] to-[#C6A96C]'
    },
    {
      logo: instructor,
      name: 'Expert Instructors',
      desc: 'Learn from industry professionals and academic experts with real-world experience.',
      color: 'from-[#0A1428] to-[#5A7FF1]'
    },
    {
      logo: analytics,
      name: 'Performance Analytics',
      desc: 'Get detailed insights into your learning patterns and receive personalized improvement suggestions.',
      color: 'from-[#C6A96C] to-[#5A7FF1]'
    },
  ]

  return (
    <div className='relative py-20 overflow-hidden'>
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#5A7FF1]/10 to-[#C6A96C]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#0A1428]/10 to-[#4660d9]/10 rounded-full blur-3xl"></div>
      </div>

      <div className='max-w-7xl mx-auto px-4 relative z-10'>
        <motion.div 
          className='text-center mb-16'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.p 
            className="text-base font-medium mb-4 inline-block px-4 py-1 rounded-full bg-[#5A7FF1]/10 text-[#5A7FF1]"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Powerful Features
          </motion.p>
          
          <motion.h1 
            className='text-4xl md:text-5xl font-bold mb-6 text-gray-900'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            Everything You Need for <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5A7FF1] to-[#0A1428]">Effective Learning</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg text-gray-700 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Our platform combines cutting-edge technology with proven pedagogical approaches to deliver an unparalleled learning experience.
          </motion.p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className='group relative p-6 rounded-2xl flex flex-col items-center text-center h-full'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05), inset 0 -1px 0 rgba(255, 255, 255, 0.5)',
              }}
            >
              {/* Hover effect background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
              
              {/* Icon container with gradient border */}
              <div className='relative mb-6 p-1 rounded-2xl bg-gradient-to-br from-[#f5f7ff] to-[#e8eeff] shadow-sm'>
                <div className='bg-white p-3 rounded-xl shadow-inner'>
                  <motion.div
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 5,
                      transition: { duration: 0.3 } 
                    }}
                  >
                    <img
                      src={feature.logo}
                      alt={feature.name}
                      className='h-12 w-12 object-contain'
                    />
                  </motion.div>
                </div>
                
                {/* Decorative element */}
                <div className={`absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-gradient-to-br ${feature.color} opacity-70`}></div>
              </div>
              
              <h2 className='text-lg font-semibold mb-3 text-gray-900 group-hover:text-[#0A1428] transition-colors'>{feature.name}</h2>
              <p className='text-gray-600 text-sm flex-grow'>{feature.desc}</p>
              
              {/* Animated underline effect */}
              <div className="mt-4 w-12 h-0.5 bg-gradient-to-r from-[#5A7FF1] to-[#C6A96C] rounded-full transform group-hover:w-16 transition-all duration-300"></div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className='text-center mt-16'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <motion.button
            className="relative px-8 py-4 rounded-xl font-medium overflow-hidden group"
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
              Explore All Features
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default Feature