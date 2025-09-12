import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <motion.header
      className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 md:px-8 md:py-5"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: [0.6, 0.05, 0.01, 0.9], // Fixed: All values now between 0-1
      }}
      style={{
        background: `rgba(255, 255, 255, 0.72)`,
        backdropFilter: `blur(12px) saturate(180%) contrast(125%)`,
        WebkitBackdropFilter: `blur(12px) saturate(180%) contrast(125%)`,
        boxShadow: `inset 0 -1px 0 0 rgba(0, 0, 0, 0.05)`,
      }}
    >
      {/* Background Canvas for Depth */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
        <div className="absolute -inset-24 bg-gradient-to-r from-[#5A7FF1] to-[#C6A96C] transform-gpu scale-90"></div>
      </div>

      {/* Logo Group */}
      <motion.div
        className="flex items-center space-x-3 cursor-pointer z-10"
        onClick={() => navigate('/')}
        whileHover="hover"
        initial="initial"
        animate="animate"
      >
        <motion.div
          className="flex items-center justify-center rounded-xl w-10 h-10 bg-gradient-to-br from-[#0A1428] to-[#1E2A48] shadow-lg"
          variants={{
            initial: { rotate: 0, scale: 1 },
            hover: { rotate: 5, scale: 1.05 },
          }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-[#C6A96C]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </motion.div>
        <motion.h1 
          className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#0A1428] to-[#4660d9]"
          variants={{
            initial: { letterSpacing: '0px' },
            hover: { letterSpacing: '0.5px' },
          }}
          transition={{ duration: 0.2 }}
        >
          LearnHub
        </motion.h1>
      </motion.div>

      {/* CTA Buttons */}
      <div className="flex space-x-4 z-10">
        <motion.button
          className="relative w-28 rounded-lg p-2 font-medium group overflow-hidden"
          onClick={() => navigate('/login')}
          whileHover="hover"
          initial="initial"
          style={{
            color: '#0A1428',
            border: `1.5px solid rgba(90, 127, 241, 0.3)`,
            background: `rgba(255, 255, 255, 0.4)`,
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.span
            className="absolute inset-0 z-0 w-0 bg-gradient-to-r from-[#f5f7ff] to-[#e8eeff]"
            variants={{ hover: { width: '100%' } }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
          <span className="relative z-1">Login</span>
        </motion.button>

        <motion.button
          className="relative w-28 rounded-lg p-2 font-medium overflow-hidden group"
          onClick={() => navigate('/register')}
          whileHover="hover"
          initial="initial"
          style={{
            background: `linear-gradient(135deg, #5A7FF1 0%, #4660d9 100%)`,
            boxShadow: `0 4px 14px 0 rgba(90, 127, 241, 0.35)`,
          }}
        >
          <motion.span
            className="absolute inset-0 z-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full"
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          />
          <span className="relative z-1 text-white">Get Started</span>
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;