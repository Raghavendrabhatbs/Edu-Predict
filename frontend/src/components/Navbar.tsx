import React from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../services/api';
import toast from 'react-hot-toast';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">Edu-Predict</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">{user.firstName} {user.lastName}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
