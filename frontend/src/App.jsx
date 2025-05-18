import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import JobPostingForm from './pages/Create_offer.jsx';
import MatchedCVsPage from  './pages/matchedCvs.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AuthPage from './pages/AuthPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
export default function App() {
  return (
    
    <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-job" element={<JobPostingForm />} />
         
          <Route path="/" element={<AuthPage />} />
         
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/matched-cv" element={<MatchedCVsPage />} />

        </Routes>
     
      
      </Router>
   
  );
}