import React from 'react'
import { motion } from 'framer-motion'
import heroImg from '../../assets/lms-hero-image.jpg'

const Hero = () => {
  return (
    <div className='flex flex-col-reverse md:flex-row justify-around items-center p-5 bg-gray-50 py-12'>
      {/* Text */}
      <motion.div
        className='w-full md:w-[45%] text-center md:text-left'
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <p className='text-base text-[#5A7FF1] font-medium mt-10'>Transform Your Learning Experience</p>
        <h1 className='text-4xl md:text-5xl font-bold mt-3 text-gray-800'>
          Learn Without <span className='text-[#5A7FF1]'>Limits</span>
        </h1>
        <p className='mt-5 text-lg text-gray-600 leading-relaxed'>
          Access thousands of courses, track your progress, and achieve your learning goals with our comprehensive learning platform.
        </p>

        <div className='flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4 mt-8'>
          <motion.button
            className='bg-[#5A7FF1] p-3 rounded-md text-white w-44 font-medium shadow-md'
            whileHover={{ scale: 1.05, backgroundColor: '#4660d9' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Explore Courses
          </motion.button>
          <motion.button
            className='w-44 border border-[#5A7FF1] p-3 rounded-md text-[#5A7FF1] font-medium'
            whileHover={{ scale: 1.05, backgroundColor: '#f5f7ff' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            How It Works
          </motion.button>
        </div>

        <div className='mt-8 flex items-center justify-center md:justify-start space-x-2 text-gray-500'>
          <div className='flex items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>10,000+ Courses</span>
          </div>
          <div className='flex items-center ml-4'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Expert Instructors</span>
          </div>
        </div>
      </motion.div>

      {/* Image */}
      <motion.div
        className='w-full md:w-[50%] mt-8 md:mt-0 flex justify-center'
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <img 
          src={heroImg} 
          className='w-[80%] md:w-[90%] rounded-lg shadow-xl' 
          alt="Students learning online with laptops and books" 
        />
      </motion.div>
    </div>
  )
}

export default Hero