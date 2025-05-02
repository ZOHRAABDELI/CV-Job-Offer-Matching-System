import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import JobPostingForm from './pages/Create_offer.jsx';
import MatchedCVsPage from  './pages/matchedCvs.jsx';
import Dashboard from './pages/Dashboard.jsx';

import AuthPage from './pages/AuthPage.jsx';
export default function App() {
  return (
    <Router>

   


        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-job" element={<JobPostingForm />} />

          {/* <Route path="/Signup" element={<SignupPage />} />
          <Route path="/Login" element={<LoginPage />} /> */}
          <Route path="/" element={<AuthPage />} />
          {/* Add more routes as needed */}


          <Route path="/matched-cv" element={<MatchedCVsPage />} />

        </Routes>
     
      
      </Router>
   
  );
}
