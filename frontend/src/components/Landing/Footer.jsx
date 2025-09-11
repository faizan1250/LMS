import React from 'react'
import { BookOpen, GraduationCap, Users, Mail, Heart } from 'lucide-react'
import { Instagram, Twitter, Linkedin, MessageCircle } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6 md:px-20 mt-24">
      <div className="flex flex-col md:flex-row justify-between gap-10 mb-8">
        
        {/* Brand / About */}
        <div className="md:w-1/3">
          <div className="flex items-center mb-4">
            <BookOpen size={28} className="text-blue-400 mr-2" />
            <h3 className="text-2xl font-bold">LearnHub</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Empowering learners worldwide with accessible, high-quality education and the tools to succeed.
          </p>
          <div className="flex items-center text-gray-400">
            <Heart size={16} className="text-red-400 mr-1" />
            <span>Made for students, by educators</span>
          </div>
        </div>

        {/* Links */}
        <div className="md:w-1/3 flex justify-between">
          <div>
            <h4 className="font-semibold mb-4 text-lg">Platform</h4>
            <ul className="text-gray-400 space-y-2">
              <li><a href="#" className="hover:text-blue-400 transition">Courses</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Instructors</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Success Stories</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-lg">Support</h4>
            <ul className="text-gray-400 space-y-2">
              <li><a href="#" className="hover:text-blue-400 transition">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">FAQ</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Resources</a></li>
            </ul>
          </div>
        </div>

        {/* Social & Contact */}
        <div className="md:w-1/3">
          <h4 className="font-semibold mb-4 text-lg">Connect With Us</h4>
          <div className="flex space-x-4 mb-6">
            <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-blue-500 transition">
              <Instagram size={20} />
            </a>
            <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-blue-500 transition">
              <Twitter size={20} />
            </a>
            <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-blue-500 transition">
              <Linkedin size={20} />
            </a>
            <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-blue-500 transition">
              <MessageCircle size={20} />
            </a>
          </div>
          
          <div className="flex items-center text-gray-400 mt-4">
            <Mail size={18} className="mr-2" />
            <span>support@learnhub.com</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
        <div className="text-gray-500 text-sm mb-4 md:mb-0">
          © {new Date().getFullYear()} LearnHub. All rights reserved.
        </div>
        <div className="flex space-x-6 text-gray-500 text-sm">
          <a href="#" className="hover:text-blue-400 transition">Privacy Policy</a>
          <a href="#" className="hover:text-blue-400 transition">Terms of Service</a>
          <a href="#" className="hover:text-blue-400 transition">Cookie Policy</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer