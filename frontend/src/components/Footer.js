import React from 'react';
import { MessageSquare } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-6 h-6 bg-primary-600 rounded-lg flex items-center justify-center mr-2">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">
              Feedback System
            </span>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-600">
              © 2024 Customer Feedback System. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Built with React, Node.js, and MongoDB
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
