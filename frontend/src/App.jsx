import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import JobPostingForm from './pages/Create_offer.jsx';

import AuthPage from './pages/AuthPage.jsx';
export default function App() {
  return (
    <Router>
      <div className="app">
        <nav className="bg-green-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-xl font-bold">Job Portal</div>
            <ul className="flex space-x-4">
              <li>
                <Link to="/" className="hover:underline">Home</Link>
              </li>
              <li>
                <Link to="/create-job" className="hover:underline">Create Job</Link>
              </li>
              {/* <li>
                <Link to="/Signup" className="hover:underline">Signup</Link>
              </li>
              <li>
                <Link to="/Login" className="hover:underline">Login</Link>
              </li> */}
              <li>
                <Link to="/AuhAuthPaget" className="hover:underline">Auth Page</Link>
              </li>
              
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-job" element={<JobPostingForm />} />
          {/* <Route path="/Signup" element={<SignupPage />} />
          <Route path="/Login" element={<LoginPage />} /> */}
          <Route path="AuhAuthPaget" element={<AuthPage />} />
          {/* Add more routes as needed */}

        </Routes>
      </div>
    </Router>
  );
}

// Simple Home component
function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Job Portal</h1>
      <p className="mb-4">Use this platform to create and manage job postings.</p>
      <Link 
        to="/create-job" 
        className="inline-block px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
      >
        Create New Job Posting
      </Link>
    </div>
  );
}



