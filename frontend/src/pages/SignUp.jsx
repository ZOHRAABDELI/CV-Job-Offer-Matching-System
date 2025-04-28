import React, { useState } from "react";


function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission logic here
  }

  return (
    <div className="flex h-screen">
      {/* Left Side - Signup Form */}
      <div className="w-1/2 flex flex-col justify-center items-center p-14">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-12">Perfect Match</h1>

          <h2 className="text-2xl font-semibold m-5">Create an Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full p-2 m-2 pl-10 border rounded-2xl border-green-400 bg-green-50 focus:outline-none focus:ring-1 focus:ring-green-500"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <img
                  src="src/assets/iconamoon_profile-circle-light.svg"
                  alt="icon"
                  className="h-5 w-5 m-2 text-gray-400"
                />
              </div>
            </div>

            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-2 m-2 pl-10 border rounded-2xl border-green-400  bg-green-50 focus:outline-none focus:ring-1 focus:ring-green-500"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <img
                  src="src/assets/clarity_email-line.svg"
                  alt="icon"
                  className="h-5 w-5 m-2 text-gray-400"
                />
              </div>
            </div>

            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full p-2 m-2 pl-10 border rounded-2xl border-green-400 bg-green-50 focus:outline-none focus:ring-1 focus:ring-green-500"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <img
                  src="src/assets/circum_lock.svg"
                  alt="icon"
                  className="h-5 w-5 m-2 text-gray-400"
                />
              </div>
            </div>

            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full p-2 m-2 pl-10 border rounded-2xl border-green-400 bg-green-50  focus:outline-none focus:ring-1 focus:ring-green-500"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <img
                  src="src/assets/circum_lock.svg"
                  alt="icon"
                  className="h-5 w-5 m-2 text-gray-400"
                />
              </div>
            </div>

            <div className="flex items-center ml-8 mb-10    ">
              <input
                type="checkbox"
                name="agreeTerms"
                id="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
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

            <div className="flex justify-center">
              <button
                type="submit"
                className="w-70 bg-green-600 text-white p-2 mb-8 rounded-2xl hover:bg-green-500 transition duration-300"
              >
                Sign Up
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-700">
              Already have an account?
              <a
                href="/login"
                className="text-green-600 font-medium ml-1 hover:text-green-700"
              >
                Login
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Mobilis Logo */}
      <div className="w-1/2 bg-green-50 flex justify-center items-center">
        <div className="w-full max-w-lg">
          <img
            src="src/assets/mobilis_logo.svg"
            alt="Mobilis Logo"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
