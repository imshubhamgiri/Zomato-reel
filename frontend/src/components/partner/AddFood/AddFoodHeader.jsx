import React from 'react';
import { Link } from 'react-router-dom';

const AddFoodHeader = () => {
  return (
    <div className="bg-white/80 dark:bg-[#222831]/90 backdrop-blur-xl shadow-xs border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/partner/profile" 
            className="group flex items-center text-gray-800 dark:text-gray-300 hover:text-sky-500 dark:hover:text-sky-400 font-semibold text-sm transition-all"
          >
            <div className="p-2 rounded-full group-hover:bg-sky-50 dark:group-hover:bg-sky-500/10 mr-2 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            Back to Dashboard
          </Link>
          <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
            Add New Dish
          </h1>
        </div>
      </div>
    </div>
  );
};

export default AddFoodHeader;
