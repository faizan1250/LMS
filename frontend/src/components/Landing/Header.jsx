import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()

  return (
    <motion.header
      className='flex justify-between items-center p-5 bg-white shadow-sm'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
        delay: 0.1
      }}
    >
      <div className='flex items-center space-x-2'>
        <div className='bg-[#5A7FF1] w-8 h-8 rounded-md flex items-center justify-center'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h1 className='text-2xl font-semibold text-gray-800'>LearnHub</h1>
      </div>

      <div className='flex space-x-4'>
        <motion.button
          className='w-28 border border-[#5A7FF1] rounded-md p-2 text-[#5A7FF1] font-medium'
          whileHover={{ scale: 1.05, backgroundColor: '#f5f7ff' }}
          transition={{ type: 'spring', stiffness: 300 }}
          onClick={() => navigate('/login')}
        >
          Login
        </motion.button>
        
        <motion.button
          className='bg-[#5A7FF1] p-2 rounded-md text-white w-28 font-medium'
          whileHover={{ scale: 1.05, backgroundColor: '#4660d9' }}
          transition={{ type: 'spring', stiffness: 300 }}
          onClick={() => navigate('/register')}
        >
          Get Started
        </motion.button>
      </div>
    </motion.header>
  )
}

export default Header