import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a12] via-[#140e1a] to-[#1a1225] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 Text */}
        <div className="relative mb-8">
          <h1 className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 animate-pulse">
            404
          </h1>
          
          {/* Decorative elements */}
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl animate-pulse delay-300"></div>
        </div>

        {/* Main content */}
        <div className="bg-[#1a1625]/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 sm:p-12 shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl rotate-45 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="-rotate-45 text-4xl font-black text-white">!</span>
            </div>
          </div>

          {/* Error message */}
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Page Not Found
          </h2>
          
          <p className="text-gray-400 text-base sm:text-lg mb-8 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Divider */}
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-transparent mx-auto mb-8"></div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg shadow-purple-500/30 group"
            >
              <HomeIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span>Go to Home</span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1a1625] border border-purple-500/20 text-purple-400 font-semibold rounded-xl hover:bg-purple-600/10 transition-all duration-300 group"
            >
              <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Go Back</span>
            </button>
          </div>

          {/* Additional links */}
          <div className="mt-8 text-sm text-gray-500">
            <p>Here are some helpful links:</p>
            <div className="flex flex-wrap justify-center gap-4 mt-3">
              <Link to="/search" className="text-purple-400 hover:text-purple-300 transition-colors duration-300">
                Search Users
              </Link>
              <Link to="/suggestedusers" className="text-purple-400 hover:text-purple-300 transition-colors duration-300">
                Suggestions
              </Link>
              <Link to="/create" className="text-purple-400 hover:text-purple-300 transition-colors duration-300">
                Create Post
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-sm text-gray-600">
          © {new Date().getFullYear()} Nexus. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default NotFound;