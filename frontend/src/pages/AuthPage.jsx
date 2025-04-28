import React, { useState } from "react";
import { Link } from "react-router-dom";

function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Form submitted:", e.target.id);
    // Handle form submission logic here
  }

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Container for all components */}
      <div className="w-full h-full relative">
        {/* Sign Up Form - Now on the left when visible */}
        <div
          className={`absolute inset-0 transition-all duration-700 ease-in-out w-1/2 ${
            isSignIn ? "opacity-0 -z-10" : "opacity-100 z-20"
          }`}
        >
          <div className="h-full flex flex-col justify-center items-center p-8">
            <div className="w-full max-w-md">
              <h1 className="text-2xl font-bold mb-6">Perfect Match</h1>
              <h2 className="text-xl p-4  mb-4">Create an Account</h2>

              <form
                id="signup-form"
                onSubmit={handleSubmit}
                className="space-y-5 space-x-1"
              >
                {/* Form Fields */}
                {/* Full Name */}
                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full name"
                    className="w-full p-1.5 mb-2  pl-10 border rounded-xl border-green-500 bg-green-50 focus:outline-none focus:ring-1 focus:ring-green-500"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    {/* Icon */}
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <img
                        src="src/assets/iconamoon_profile-circle-light.svg"
                        alt="icon"
                        className="h-4 w-4 mr-8 mb-2.5 text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full p-1.5 pl-10 mb-2 border rounded-xl border-green-500 bg-green-50 focus:outline-none focus:ring-1 focus:ring-green-500"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    {/* Icon */}
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <img
                        src="src/assets/clarity_email-line.svg"
                        alt="icon"
                        className="h-4 w-4 mr-8 mb-2.5 text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full p-1.5 mb-2   pl-10 border rounded-xl border-green-500 bg-green-50 focus:outline-none focus:ring-1 focus:ring-green-500"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    {/* Icon */}
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <img
                        src="src/assets/circum_lock.svg"
                        alt="icon"
                        className="h-4 w-4 mr-8 mb-2.5 text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="w-full p-1.5 mb-2  pl-10 border rounded-xl border-green-500 bg-green-50 focus:outline-none focus:ring-1 focus:ring-green-500"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    {/* Icon */}
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <img
                        src="src/assets/circum_lock.svg"
                        alt="icon"
                        className="h-4 w-4 mr-8 mb-2.5 text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Agree Terms */}
                <div className="flex items-center ml-2 mb-12">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    id="agreeTerms"
                    className="h-4 w-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                    required
                  />
                  <label
                    htmlFor="agreeTerms"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    I agree with Terms and Privacy
                  </label>
                </div>

                {/* Sign Up Button */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-70 bg-green-600 text-white p-2 mb-8 rounded-xl hover:bg-green-500 transition duration-300"
                  >
                    Sign Up
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-700">
                  Already have an account?{" "}
                  <button
                    onClick={toggleForm}
                    className="text-green-600 font-medium hover:text-green-700"
                  >
                    Login
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sign In Form - Now on the right when visible */}
        <div
          className={`absolute inset-0 transition-all duration-700 ease-in-out w-1/2 translate-x-full ${
            isSignIn ? "opacity-100 z-20" : "opacity-0 -z-10"
          }`}
        >
          <div className="h-full flex flex-col justify-center items-center p-8">
            <div className="w-full max-w-md">
              <h1 className="text-3xl font-bold mb-8">Perfect Match</h1>
              <h2 className="text-xl p-4  mb-8">
                Log into your Account
              </h2>

              <form
                id="signin-form"
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* Email */}
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full p-1.5 mb-2  pl-10 border rounded-xl border-green-500 bg-green-50 focus:outline-none focus:ring-1 focus:ring-green-500"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    {/* Icon */}
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <img
                        src="src/assets/clarity_email-line.svg"
                        alt="icon"
                        className="h-4 w-4 mr-8 mb-2.5 text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="relative mb-8">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full p-1.5 mb-2  pl-10 border rounded-xl border-green-500 bg-green-50 focus:outline-none focus:ring-1 focus:ring-green-500"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    {/* Icon */}
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <img
                        src="src/assets/circum_lock.svg"
                        alt="icon"
                        className="h-4 w-4 mr-8 mb-2.5 text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Forgot Password
                <div className="flex justify-end mb-4">
                  <a
                    href="#"
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    Forgot your password?
                  </a>
                </div> */}

                {/* Login Button */}
                <div className="flex justify-center mt-10">
                  <button
                    type="submit"
                    className="w-70 bg-green-600 text-white p-2 mb-8 rounded-2xl hover:bg-green-500 transition duration-300"
                  >
                    Login
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-700">
                  Don't have an account?{" "}
                  <button
                    onClick={toggleForm}
                    className="text-green-600 font-medium hover:text-green-700"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay Container with Logo - Now slides from right to left */}
        <div
          className={`absolute top-0 w-1/2 h-full transition-all duration-700 ease-in-out ${
            isSignIn ? "left-0" : "left-1/2"
          }`}
        >
          <div className="w-full h-full bg-green-50 flex items-center justify-center">
            <img
              src="src/assets/mobilis_logo.svg"
              alt="Mobilis Logo"
              className="w-3/4 transition-all duration-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
