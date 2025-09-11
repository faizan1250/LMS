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
      desc: 'Access thousands of courses across diverse subjects, curated by industry experts and educators.'
    },
    {
      logo: progressTracking,
      name: 'Personalized Progress Tracking',
      desc: 'Monitor your learning journey with detailed analytics and customized recommendations.'
    },
    {
      logo: assignments,
      name: 'Interactive Assignments',
      desc: 'Reinforce learning with hands-on projects, quizzes, and practical exercises.'
    },
    {
      logo: certifications,
      name: 'Recognized Certifications',
      desc: 'Earn valuable credentials that demonstrate your skills to employers and peers.'
    },
    {
      logo: discussions,
      name: 'Collaborative Learning',
      desc: 'Engage with peers and instructors through forums, group projects, and live sessions.'
    },
    {
      logo: mobileLearning,
      name: 'Mobile Learning',
      desc: 'Learn anytime, anywhere with our fully responsive platform optimized for all devices.'
    },
    {
      logo: instructor,
      name: 'Expert Instructors',
      desc: 'Learn from industry professionals and academic experts with real-world experience.'
    },
    {
      logo: analytics,
      name: 'Performance Analytics',
      desc: 'Get detailed insights into your learning patterns and receive personalized improvement suggestions.'
    },
  ]

  return (
    <div className='p-5 max-w-7xl mx-auto mt-16 mb-16'>
      <motion.h1 
        className='text-3xl md:text-4xl font-bold text-center mt-10 mb-12 text-gray-800'
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Everything You Need for <span className='text-[#5A7FF1]'>Effective Learning</span>
      </motion.h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className='p-6 border rounded-xl border-blue-50 hover:shadow-md transition-all bg-white flex flex-col items-center text-center'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className='bg-blue-50 p-3 rounded-full mb-4'>
              <img
                src={feature.logo}
                alt={feature.name}
                className='h-10 w-10 object-contain'
              />
            </div>
            <h2 className='text-lg font-semibold mb-2 text-gray-800'>{feature.name}</h2>
            <p className='text-gray-600 text-sm'>{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className='text-center mt-12'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <button className='bg-[#5A7FF1] text-white px-6 py-3 rounded-md font-medium hover:bg-[#4660d9] transition-colors'>
          Explore All Features
        </button>
      </motion.div>
    </div>
  )
}

export default Feature