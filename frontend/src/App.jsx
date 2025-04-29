import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import JobPostingForm from './pages/Create_offer.jsx';
import MatchedCVsPage from  './pages/matchedCvs.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  return (
    <Router>
   

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-job" element={<JobPostingForm />} />
          <Route path="/matched-cv" element={<MatchedCVsPage />} />
        </Routes>
     
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
