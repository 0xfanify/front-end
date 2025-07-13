'use client';

import React from 'react';
import { Instagram, Twitter, Youtube, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-black text-white">⚽ Fanify</span>
            <div className="text-sm text-gray-400 font-medium ml-2">Football + Blockchain</div>
          </div>

          {/* Social Links */}
          <div className="flex space-x-4">
            <a 
              href="#" 
              className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-brand-600 hover:text-white transition-all duration-300"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-brand-600 hover:text-white transition-all duration-300"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-brand-600 hover:text-white transition-all duration-300"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-brand-600 hover:text-white transition-all duration-300"
            >
              <Globe className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2025 ⚽ Fanify. All rights reserved.
            </div>
            
            {/* Legal Links */}
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-brand-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-brand-400 transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-brand-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;