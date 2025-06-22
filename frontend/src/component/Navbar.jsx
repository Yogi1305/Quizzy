import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Baseurl } from '../main';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const response = await axios.get(`${Baseurl}/checklogged`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      
      setIsLoggedIn(response.data?.success || false);
      
      // If user info is available in the response
      if (response.data?.user?.fullName) {
        setUserName(response.data.user.fullName);
      }
    } catch (error) {
      console.log("Error checking login status:", error);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${Baseurl}/logout`, {
        withCredentials: true
      });
      setIsLoggedIn(false);
      setUserName('');
      setShowDropdown(false);
      navigate('/');
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="h-fit bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 flex flex-col">
      {/* Navbar */}
      <div className="w-full backdrop-blur-sm bg-white/10 border-b border-white/20 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo Section */}
            <div className="flex items-center">
              <img src="/126.jpg" alt="Logo" className="h-10 w-20 mix-blend-screen bg-transparent" />
              <span className="text-white font-bold text-xl ml-2">KnitQuiz</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-white hover:text-indigo-200 transition px-3 py-2 rounded-md text-sm font-medium">Home</Link>
              <Link to="/contest" className="text-white hover:text-indigo-200 transition px-3 py-2 rounded-md text-sm font-medium">Contests</Link>
              <Link to="/about" className="text-white hover:text-indigo-200 transition px-3 py-2 rounded-md text-sm font-medium">About</Link>
              
              {loading ? (
                <div className="w-24 h-8 bg-white/20 rounded-md animate-pulse"></div>
              ) : isLoggedIn ? (
                <div className="relative">
                  <button 
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-200 border border-white/30"
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 font-bold text-xs">
                      {userName.charAt(0)}
                    </div>
                    <span className="max-w-[100px] truncate">{userName}</span>
                    <svg className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">
                        My Profile
                      </Link>
                      <Link to="/my-contests" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">
                        My Contests
                      </Link>
                      <div className="border-t border-gray-100"></div>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/login" 
                    className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-all duration-200 font-medium"
                  >
                    Log In
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-400 transition-all duration-200 font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button className="text-white hover:text-indigo-200">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      
      
    
     
    </div>
  );
};

export default Navbar;