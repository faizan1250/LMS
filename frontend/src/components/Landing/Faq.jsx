import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  BookOpen, 
  Users, 
  CreditCard, 
  Clock, 
  Award, 
  ChevronDown,
  MessageCircle,
  HeadphonesIcon,
  Zap,
  ArrowRight
} from 'lucide-react';

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const questions = [
    {
      question: "How do I enroll in a course?",
      ans: "Simply browse our course catalog, select a course that interests you, and click the 'Enroll' button. You'll gain immediate access to all course materials.",
      icon: <BookOpen size={20} />
    },
    {
      question: "Are there any free courses available?",
      ans: "Yes! We offer a selection of free courses to help you get started. You can upgrade to access premium content and features at any time.",
      icon: <CreditCard size={20} />
    },
    {
      question: "Can I learn at my own pace?",
      ans: "Absolutely. All our courses are self-paced, allowing you to learn whenever it's convenient for you. You'll have lifetime access to course materials once enrolled.",
      icon: <Clock size={20} />
    },
    {
      question: "Do you offer certificates upon completion?",
      ans: "Yes, we provide certificates of completion for all premium courses. These can be shared on LinkedIn and added to your resume to showcase your skills.",
      icon: <Award size={20} />
    },
    {
      question: "How do I interact with instructors and other students?",
      ans: "Our platform includes discussion forums, live Q&A sessions, and direct messaging features to help you connect with both instructors and fellow learners.",
      icon: <Users size={20} />
    },
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
          className="text-center mb-16"
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
            Need Help?
          </motion.p>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            Frequently Asked <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5A7FF1] to-[#0A1428]">Questions</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg text-gray-700 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Find answers to common questions about our learning platform and how to get started on your educational journey.
          </motion.p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* FAQ Items */}
          <div className="w-full lg:w-7/12 space-y-4">
            {questions.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05), inset 0 -1px 0 rgba(255, 255, 255, 0.5)',
                }}
              >
                <motion.button
                  onClick={() => toggleAnswer(index)}
                  className={`w-full p-6 text-left flex items-center justify-between transition-all duration-300 ${
                    activeIndex === index ? 'bg-white/50' : ''
                  }`}
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-4 ${
                      activeIndex === index 
                        ? 'bg-gradient-to-br from-[#5A7FF1] to-[#0A1428] text-white' 
                        : 'bg-[#5A7FF1]/10 text-[#5A7FF1]'
                    }`}>
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.question}</h3>
                  </div>
                  <motion.div
                    initial={false}
                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-1 rounded-full ${
                      activeIndex === index 
                        ? 'bg-gradient-to-br from-[#5A7FF1] to-[#0A1428] text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      key="answer"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 ml-12 border-t border-gray-100/50">
                        <p className="text-gray-700">{item.ans}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Contact Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="w-full lg:w-5/12"
          >
            <div className="p-8 rounded-2xl h-full"
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05), inset 0 -1px 0 rgba(255, 255, 255, 0.5)',
              }}
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-[#5A7FF1] to-[#0A1428] mb-4">
                  <MessageCircle size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Still have questions?</h2>
                <p className="text-gray-700">
                  Our support team is here to help you with any questions about our platform.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  { icon: <HeadphonesIcon size={20} />, text: "24/7 Customer Support" },
                  { icon: <Zap size={20} />, text: "Average response time: 2 hours" },
                  { icon: <Mail size={20} />, text: "Email, chat, and phone support" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center p-3 rounded-xl bg-white/50">
                    <div className="p-2 rounded-lg bg-[#5A7FF1]/10 text-[#5A7FF1] mr-3">
                      {item.icon}
                    </div>
                    <span className="text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>

              <motion.button
                className="relative w-full py-4 rounded-xl font-medium overflow-hidden group"
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
                  <Mail size={20} className="mr-2" />
                  Contact Support
                  <ArrowRight size={20} className="ml-2" />
                </span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Faq;