import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Users, Mail, Heart, Instagram, Twitter, Linkedin, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-[#0A1428] to-[#1E2A48] text-white pt-20 pb-10 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#5A7FF1]/10 to-[#C6A96C]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#4660d9]/10 to-[#0A1428]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Newsletter Section */}
        <motion.div 
          className="p-8 rounded-2xl mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          }}
        >
          <h3 className="text-2xl font-bold mb-4">Stay Updated with LearnHub</h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest course updates, learning tips, and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#5A7FF1] text-white placeholder-gray-400"
            />
            <motion.button
              className="px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: `linear-gradient(135deg, #5A7FF1 0%, #4660d9 100%)`,
                boxShadow: `0 4px 15px rgba(90, 127, 241, 0.3)`,
              }}
            >
              Subscribe
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand / About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-br from-[#5A7FF1] to-[#0A1428] p-2 rounded-xl mr-3">
                <BookOpen size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#5A7FF1] to-[#C6A96C]">LearnHub</h3>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Empowering learners worldwide with accessible, high-quality education and the tools to succeed.
            </p>
            <div className="flex items-center text-gray-400">
              <div className="bg-gradient-to-br from-[#5A7FF1] to-[#C6A96C] p-1 rounded-full mr-2">
                <Heart size={14} className="text-white" />
              </div>
              <span className="text-sm">Made for students, by educators</span>
            </div>
          </motion.div>

          {/* Platform Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="font-semibold text-lg mb-6 flex items-center">
              <span className="bg-gradient-to-r from-[#5A7FF1] to-[#C6A96C] w-2 h-2 rounded-full mr-2"></span>
              Platform
            </h4>
            <ul className="space-y-3">
              {['Courses', 'Pricing', 'Instructors', 'Success Stories'].map((item, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-[#5A7FF1] transition-colors flex items-center group"
                  >
                    <Sparkles size={12} className="mr-2 text-[#C6A96C] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="font-semibold text-lg mb-6 flex items-center">
              <span className="bg-gradient-to-r from-[#5A7FF1] to-[#C6A96C] w-2 h-2 rounded-full mr-2"></span>
              Support
            </h4>
            <ul className="space-y-3">
              {['Help Center', 'Contact Us', 'FAQ', 'Resources'].map((item, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-[#5A7FF1] transition-colors flex items-center group"
                  >
                    <Sparkles size={12} className="mr-2 text-[#C6A96C] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social & Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="font-semibold text-lg mb-6 flex items-center">
              <span className="bg-gradient-to-r from-[#5A7FF1] to-[#C6A96C] w-2 h-2 rounded-full mr-2"></span>
              Connect With Us
            </h4>
            <div className="flex space-x-3 mb-6">
              {[
                { icon: <Instagram size={18} />, color: 'from-[#fdf497] to-[#d6249f]' },
                { icon: <Twitter size={18} />, color: 'from-[#1DA1F2] to-[#1DA1F2]' },
                { icon: <Linkedin size={18} />, color: 'from-[#0077B5] to-[#0077B5]' },
                { icon: <MessageCircle size={18} />, color: 'from-[#5A7FF1] to-[#4660d9]' },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className={`p-3 rounded-xl bg-gradient-to-br ${social.color} text-white shadow-lg`}
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
            
            <div className="flex items-center text-gray-400 mt-4 p-3 rounded-xl bg-white/5">
              <div className="bg-gradient-to-br from-[#5A7FF1] to-[#4660d9] p-2 rounded-lg mr-3">
                <Mail size={18} className="text-white" />
              </div>
              <span>support@learnhub.com</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div 
          className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} LearnHub. All rights reserved.
          </div>
          <div className="flex space-x-6 text-gray-500 text-sm">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item, index) => (
              <a 
                key={index} 
                href="#" 
                className="hover:text-[#5A7FF1] transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;