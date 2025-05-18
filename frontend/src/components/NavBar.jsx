import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import mobilisLogo from "../assets/miniMobilisLogo.svg";

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };


    const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");
    // Redirect to login page
    navigate("/");
  };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 w-full py-3  px-4 sm:px-6 lg:px-16 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img
              src={mobilisLogo}
              alt="Mobilis Logo"
              className="h-8 sm:h-9 md:h-14 ml-7"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-20">
          <a
            href="#home"
            className="text-gray-500 hover:text-green-600 font-bold text-sm lg:text-xl transition duration-200"
          >
            Home
          </a>
          <a
            href="#starter-guide"
            className="text-gray-500 hover:text-green-600 font-bold text-sm lg:text-xl transition duration-200"
          >
            Starter Guide
          </a>
          <Link
            to="/about-us"
            className="text-gray-500 hover:text-green-600 font-bold text-sm lg:text-xl transition duration-200"
          >
            About us
          </Link>
          <a
            href="#support"
            className="text-gray-500 hover:text-green-600 font-bold text-sm lg:text-xl transition duration-200"
          >
            Support
          </a>
          <Link to="/logout">
            <button className="px-4 py-2 text-red-600 border border-red-600 bg-[#FFF3F3] text-base font-semibold rounded-lg transition hover:bg-red-600 hover:text-white hover:cursor-pointer">
              Logout
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-600 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden absolute left-0 right-0 bg-white shadow-lg transition-all duration-300 overflow-hidden ${
          isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-2 space-y-3">
          <Link
            to="/"
            className="block text-gray-600 hover:text-green-600 font-medium py-2 transition duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/starter-guide"
            className="block text-gray-600 hover:text-green-600 font-medium py-2 transition duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Starter Guide
          </Link>
          <a
            href="#home"
            className="block text-gray-600 hover:text-green-600 font-medium py-2 transition duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </a>
          <a
            href="#starter-guide"
            className="block text-gray-600 hover:text-green-600 font-medium py-2 transition duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Starter Guide
          </a>
          <Link
            to="/about-us"
            className="block text-gray-600 hover:text-green-600 font-medium py-2 transition duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            About us
          </Link>
          <a
            href="#support"
            className="block text-gray-600 hover:text-green-600 font-medium py-2 transition duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Support
          </a>
          <div className="py-2">
            <Link
              to="/logout"
              className="inline-block"
              onClick={() => setIsMenuOpen(false)}
            >
              <button className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-full px-5 py-1.5 font-medium transition duration-300 w-full">
                Logout
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;