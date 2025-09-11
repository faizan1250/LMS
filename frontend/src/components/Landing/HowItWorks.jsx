import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  BookOpen, 
  BarChart3, 
  Award,
  GraduationCap,
  BookMarked,
  Target,
  Share2
} from 'lucide-react';

const steps = [
  {
    step: 'Step 1',
    title: 'Create Your Learning Profile',
    desc: 'Sign up and set your educational goals, interests, and current knowledge level.',
    icon: <UserPlus size={24} className="text-blue-500" />
  },
  {
    step: 'Step 2',
    title: 'Browse & Enroll in Courses',
    desc: 'Explore our extensive course catalog and enroll in programs that match your interests.',
    icon: <BookOpen size={24} className="text-blue-500" />
  },
  {
    step: 'Step 3',
    title: 'Track Your Progress',
    desc: 'Monitor your learning journey with detailed analytics and performance metrics.',
    icon: <BarChart3 size={24} className="text-blue-500" />
  },
  {
    step: 'Step 4',
    title: 'Earn Certificates & Share',
    desc: 'Complete courses to earn certificates and share your achievements with others.',
    icon: <Award size={24} className="text-blue-500" />
  }
];

const HowItWorks = () => {
  return (
    <div className="py-16 px-4 mx-auto bg-[#f8f9fb] mt-10 max-w-7xl">
      <motion.h2 
        className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        How It Works
      </motion.h2>
      
      <motion.p 
        className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Start your learning journey in just a few simple steps and unlock your potential
      </motion.p>

      <div className="flex flex-col md:flex-row justify-center items-start gap-10">
        {/* Icon Banner */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="w-full md:w-2/5 flex flex-col items-center justify-center bg-white p-8 rounded-xl shadow-sm"
        >
          <div className="relative mb-6">
            <div className="absolute -inset-4 bg-blue-100 rounded-full opacity-50"></div>
            <GraduationCap size={80} className="text-blue-600 relative z-10" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-3 text-center">Start Learning Today</h3>
          <p className="text-gray-600 text-center">
            Join thousands of students who are advancing their skills with our platform
          </p>
          
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center">
              <BookMarked size={32} className="text-blue-500 mb-2" />
              <span className="text-sm text-gray-600 text-center">1000+ Courses</span>
            </div>
            <div className="flex flex-col items-center">
              <Target size={32} className="text-blue-500 mb-2" />
              <span className="text-sm text-gray-600 text-center">Personalized Paths</span>
            </div>
          </div>
        </motion.div>

        {/* Steps */}
        <div className="flex flex-col space-y-8 relative w-full md:w-1/2">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-start space-x-6 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Step Number and Icon */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                  {step.icon}
                </div>
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="h-16 w-px bg-blue-100 mx-auto mt-2"></div>
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1">
                <span className="text-sm font-medium text-blue-600">{step.step}</span>
                <h3 className="text-xl font-semibold text-gray-800 mt-1">{step.title}</h3>
                <p className="text-gray-600 mt-2">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;