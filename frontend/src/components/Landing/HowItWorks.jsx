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
  Share2,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Create Your Learning Profile',
      desc: 'Sign up and set your educational goals, interests, and current knowledge level.',
      icon: <UserPlus size={28} />,
      color: 'from-[#5A7FF1] to-[#0A1428]'
    },
    {
      step: '02',
      title: 'Browse & Enroll in Courses',
      desc: 'Explore our extensive course catalog and enroll in programs that match your interests.',
      icon: <BookOpen size={28} />,
      color: 'from-[#C6A96C] to-[#8B6122]'
    },
    {
      step: '03',
      title: 'Track Your Progress',
      desc: 'Monitor your learning journey with detailed analytics and performance metrics.',
      icon: <BarChart3 size={28} />,
      color: 'from-[#0A1428] to-[#4660d9]'
    },
    {
      step: '04',
      title: 'Earn Certificates & Share',
      desc: 'Complete courses to earn certificates and share your achievements with others.',
      icon: <Award size={28} />,
      color: 'from-[#5A7FF1] to-[#C6A96C]'
    }
  ];

  const stats = [
    { value: '1000+', label: 'Courses' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '50K+', label: 'Active Learners' },
    { value: '24/7', label: 'Support' }
  ];

  return (
    <div className="relative py-20 overflow-hidden bg-gradient-to-br from-[#f5f7ff] to-[#e8eeff]">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#5A7FF1]/10 to-[#C6A96C]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#0A1428]/10 to-[#4660d9]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
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
            Simple Process
          </motion.p>
          
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            How It <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5A7FF1] to-[#0A1428]">Works</span>
          </motion.h2>
          
          <motion.p 
            className="text-lg text-gray-700 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Start your learning journey in just a few simple steps and unlock your potential with our intuitive platform
          </motion.p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10 items-stretch">
          {/* Steps Section */}
          <div className="w-full lg:w-2/3 relative">
            {/* Decorative connecting line */}
            <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-gradient-to-b from-[#5A7FF1]/20 via-[#C6A96C]/20 to-[#0A1428]/20 hidden lg:block"></div>
            
            <div className="space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-6 group"
                >
                  {/* Step number and icon */}
                  <div className="flex flex-col items-center">
                    <motion.div 
                      className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white relative z-10 shadow-lg`}
                      whileHover={{ 
                        scale: 1.05,
                        rotate: 5,
                        transition: { duration: 0.3 } 
                      }}
                    >
                      <div className="text-xs font-bold absolute -top-2 -right-2 bg-white text-gray-900 rounded-full h-6 w-6 flex items-center justify-center shadow-sm">
                        {step.step}
                      </div>
                      {step.icon}
                    </motion.div>
                    
                    {/* Connector arrow */}
                    {index < steps.length - 1 && (
                      <motion.div 
                        className="h-10 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: (index * 0.1) + 0.3 }}
                      >
                        <ArrowRight size={20} className="text-gray-400 rotate-90 lg:rotate-0" />
                      </motion.div>
                    )}
                  </div>

                  {/* Content */}
                  <motion.div 
                    className="flex-1 p-6 rounded-2xl"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05), inset 0 -1px 0 rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-700">{step.desc}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats Banner */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="w-full lg:w-1/3 p-8 rounded-2xl flex flex-col justify-center"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05), inset 0 -1px 0 rgba(255, 255, 255, 0.5)',
            }}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-[#5A7FF1] to-[#0A1428] mb-4">
                <GraduationCap size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Start Learning Today</h3>
              <p className="text-gray-700">
                Join thousands of students who are advancing their skills with our platform
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + (index * 0.1) }}
                >
                  <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#5A7FF1] to-[#0A1428]">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              {[
                "Personalized learning paths",
                "Expert instructor support",
                "Career advancement resources"
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle size={18} className="text-[#5A7FF1] mr-2" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </motion.div>
            
            <motion.button
              className="mt-8 w-full py-3 rounded-xl font-medium bg-gradient-to-r from-[#5A7FF1] to-[#4660d9] text-white shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started Now
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;