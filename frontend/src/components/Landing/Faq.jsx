import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, BookOpen, Users, CreditCard, Clock, Award } from 'lucide-react';

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const questions = [
    {
      question: "How do I enroll in a course?",
      ans: "Simply browse our course catalog, select a course that interests you, and click the 'Enroll' button. You'll gain immediate access to all course materials.",
      icon: <BookOpen size={20} className="text-blue-500" />
    },
    {
      question: "Are there any free courses available?",
      ans: "Yes! We offer a selection of free courses to help you get started. You can upgrade to access premium content and features at any time.",
      icon: <CreditCard size={20} className="text-blue-500" />
    },
    {
      question: "Can I learn at my own pace?",
      ans: "Absolutely. All our courses are self-paced, allowing you to learn whenever it's convenient for you. You'll have lifetime access to course materials once enrolled.",
      icon: <Clock size={20} className="text-blue-500" />
    },
    {
      question: "Do you offer certificates upon completion?",
      ans: "Yes, we provide certificates of completion for all premium courses. These can be shared on LinkedIn and added to your resume to showcase your skills.",
      icon: <Award size={20} className="text-blue-500" />
    },
    {
      question: "How do I interact with instructors and other students?",
      ans: "Our platform includes discussion forums, live Q&A sessions, and direct messaging features to help you connect with both instructors and fellow learners.",
      icon: <Users size={20} className="text-blue-500" />
    },
  ];

  return (
    <div className="mt-24 px-6 md:px-20 lg:px-32 py-16 bg-gray-50 rounded-xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-800">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find answers to common questions about our learning platform and how to get started.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-10">
        {/* Left Section */}
        <div className="lg:w-[35%] mb-8 lg:mb-0 flex flex-col justify-between">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
              <Mail size={24} className="mr-2 text-blue-500" /> Still have questions?
            </h2>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Our support team is here to help you with any questions about our platform.
            </p>
            <button className="bg-[#5A7FF1] text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center">
              <Mail size={18} className="mr-2" /> Contact Support
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:w-[60%] space-y-4">
          {questions.map((item, index) => (
            <motion.div
              key={index}
              onClick={() => toggleAnswer(index)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`cursor-pointer p-6 rounded-xl transition-all duration-300 shadow-sm border hover:shadow-md ${
                activeIndex === index ? "bg-blue-50 border-blue-200" : "bg-white border-gray-100"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="mr-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{item.question}</h3>
                </div>
                <motion.span
                  initial={false}
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-xl font-bold text-blue-500"
                >
                  {activeIndex === index ? "−" : "+"}
                </motion.span>
              </div>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.p
                    key="answer"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-600 mt-4 pl-9"
                  >
                    {item.ans}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;