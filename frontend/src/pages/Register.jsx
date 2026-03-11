import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [_, setIsHovered] = useState(false);
  const [inputData, setInputData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const inputDataHandler = async (e) => {
    e.preventDefault();
    try {
      console.log(inputData)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="h-screen w-full flex justify-center items-center bg-[#0a0a12] relative overflow-y-auto py-8">
      {/* Animated background elements - adjusted for mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main container with glass morphism - better mobile spacing */}
      <div className="relative w-full max-w-5xl mx-4 flex flex-col lg:flex-row items-center gap-6 lg:gap-12">
        {/* Left side - Brand section - hidden on mobile, visible only on desktop */}
        <div className="hidden lg:block flex-1 text-center lg:text-left space-y-4 lg:space-y-6 px-2 sm:px-0">
          <h1
            className="
            text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight inline-block
            bg-gradient-to-br from-purple-300 via-purple-400 to-purple-600
            bg-clip-text text-transparent
            relative
            after:content-[''] after:absolute after:-bottom-4 after:left-1/2 lg:after:left-0 after:-translate-x-1/2 lg:after:translate-x-0 after:w-24 after:h-1 after:bg-gradient-to-r after:from-purple-500 after:to-transparent
          "
          >
            Nexus
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto lg:mx-0 px-4 sm:px-0">
            Connect with friends and the world around you through moments that
            matter.
          </p>

          {/* Feature list - centered on mobile, left on desktop */}
          <div className="flex flex-col gap-3 lg:gap-4 max-w-sm mx-auto lg:mx-0 px-4 sm:px-0">
            {["Share your posts", "Like, Share, Comment", "Privacy first"].map(
              (feature, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-300 justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm sm:text-base">{feature}</span>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Right side - Registration form - full width on mobile, centered on desktop */}
        <div className="flex-1 w-full max-w-md px-2 sm:px-0 mx-auto">
          <form className="bg-[#1a1625]/80 backdrop-blur-xl px-2 py-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-purple-500/20 shadow-2xl space-y-5 sm:space-y-6" onSubmit={inputDataHandler}>
            {/* Logo mark - small */}
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl rotate-45 flex items-center justify-center">
                <span className="-rotate-45 text-2xl sm:text-3xl font-black text-white">
                  N
                </span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white text-center">
              Create account
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {/* Username field with icon */}
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl">
                  👤
                </span>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl bg-[#0a0a12] border border-purple-500/20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all duration-300 text-sm sm:text-base"
                  value={inputData.username}
                  onChange={(e) => setInputData({...inputData, username: e.target.value})}
                />
              </div>

              {/* Email field with icon */}
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl">
                  📧
                </span>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl bg-[#0a0a12] border border-purple-500/20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all duration-300 text-sm sm:text-base"
                  value={inputData.email}
                  onChange={(e) => setInputData({...inputData, email: e.target.value})}
                />
              </div>

              {/* Password field with icon */}
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl">
                  🔒
                </span>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full pl-12 pr-12 py-3 sm:py-4 rounded-xl bg-[#0a0a12] border border-purple-500/20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all duration-300 text-sm sm:text-base"
                   value={inputData.password}
                  onChange={(e) => setInputData({...inputData, password: e.target.value})}
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg shadow-purple-500/30 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-sm sm:text-base"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Get Started
              </button>
            </div>

            {/* Login link */}
            <p className="text-center text-gray-400 text-xs sm:text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-400 font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;