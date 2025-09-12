// DashboardComponents.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { PlayIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export function ProgressRing({ value = 0, size = 96 }) {
  const radius = 36;
  const stroke = 8;
  const normalized = Math.min(100, Math.max(0, value));
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalized / 100) * circumference;
  
  return (
    <div className="relative">
      <svg width={size} height={size} viewBox="0 0 96 96" className="mx-auto">
        <g transform="translate(48,48)">
          <circle r={radius} strokeWidth={stroke} className="text-gray-200" stroke="currentColor" fill="none" />
          <circle
            r={radius}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="text-[#5A7FF1]"
            stroke="currentColor"
            fill="none"
            transform="rotate(-90)"
          />
        </g>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-gray-900">{`${normalized}%`}</span>
      </div>
    </div>
  );
}

export function EnrolledCard({ course }) {
  return (
    <motion.div 
      className="flex items-center justify-between p-4 rounded-xl bg-white/50 border border-white/20 hover:shadow-md transition-all"
      whileHover={{ y: -2 }}
    >
      <div className="flex-1">
        <div className="font-medium text-gray-900">{course.title}</div>
        <div className="text-xs text-gray-600 mt-1">Progress: {Math.round((course.progress || 0) * 100)}%</div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-[#5A7FF1] to-[#4660d9] h-2 rounded-full" 
            style={{ width: `${Math.round((course.progress || 0) * 100)}%` }}
          ></div>
        </div>
      </div>
      <div className="ml-4">
        <motion.button 
          className="px-4 py-2 rounded-xl text-sm font-medium flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'linear-gradient(135deg, #5A7FF1 0%, #4660d9 100%)',
            boxShadow: '0 4px 15px rgba(90, 127, 241, 0.3)',
          }}
        >
          <PlayIcon className="h-4 w-4 text-white mr-1" />
          <span className="text-white">Continue</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

export function RecommendedCard({ course }) {
  return (
    <motion.div 
      className="p-4 rounded-xl border border-white/20 hover:shadow-md transition-all"
      style={{
        background: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
      whileHover={{ y: -2 }}
    >
      <div className="h-32 rounded-lg bg-gradient-to-br from-[#5A7FF1]/10 to-[#0A1428]/10 mb-3 flex items-center justify-center">
        <div className="bg-[#5A7FF1] p-3 rounded-full text-white">
          <BookOpenIcon className="h-6 w-6" />
        </div>
      </div>
      <div className="text-sm font-medium text-gray-900 line-clamp-2">{course.title}</div>
      <div className="text-xs text-gray-600 mt-1 line-clamp-2">{course.description || 'Short description not provided.'}</div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-gray-500 flex items-center">
          <ClockIcon className="h-3 w-3 mr-1" />
          {course.duration || 'self-paced'}
        </div>
        <motion.button 
          className="px-3 py-1 rounded-lg text-xs font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'linear-gradient(135deg, #5A7FF1 0%, #4660d9 100%)',
            boxShadow: '0 2px 10px rgba(90, 127, 241, 0.3)',
          }}
        >
          <span className="text-white">Enroll</span>
        </motion.button>
      </div>
    </motion.div>
  );
}