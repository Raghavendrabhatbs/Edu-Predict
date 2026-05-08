import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import ProfessorDashboard from './pages/ProfessorDashboard';
import CounselorDashboard from './pages/CounselorDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/student/*" element={
          <ProtectedRoute requiredRole="student">
            <div>
              <Navbar />
              <StudentDashboard />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/professor/*" element={
          <ProtectedRoute requiredRole="professor">
            <div>
              <Navbar />
              <ProfessorDashboard />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/counselor/*" element={
          <ProtectedRoute requiredRole="counselor">
            <div>
              <Navbar />
              <CounselorDashboard />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
