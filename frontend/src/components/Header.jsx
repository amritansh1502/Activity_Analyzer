import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/aiease_1749573410644.jpg';

const Header = () => {
  const location = useLocation();
  const hideAuthLinks = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/profile');

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link to="/">
          <img src={logo} alt="ActivityAnalyzer Logo" className="h-10 w-auto" />
        </Link>
        <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
        {!hideAuthLinks && (
          <Link to="#features" className="text-gray-700 hover:text-blue-600">Features</Link>
        )}
      </div>
      {!hideAuthLinks && (
        <div className="space-x-4">
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
          <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Signup</Link>
        </div>
      )}
    </header>
  );
};

export default Header;
