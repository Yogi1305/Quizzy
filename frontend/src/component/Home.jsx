import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Baseurl } from '../main';
import Navbar from './Navbar';

const Home = () => {
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
      localStorage.removeItem("userId1");
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
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 flex flex-col">
      {/* Navbar */}
       <Navbar/>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Test Your Knowledge with <span className="text-indigo-200">KnitQuiz</span>
          </h1>
          
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of quiz enthusiasts in testing your knowledge, competing with others, and learning something new every day.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              to="/contest" 
              className="w-full sm:w-auto bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Join Contests
            </Link>
            
            {!isLoggedIn && (
              <Link 
                to="/register" 
                className="w-full sm:w-auto bg-transparent text-white border-2 border-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-all duration-200"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-white/10 backdrop-blur-sm py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose KnitQuiz?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:bg-white/30 transition-all duration-300 shadow-lg">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4 text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Diverse Question Bank</h3>
              <p className="text-white/80">Access thousands of questions across multiple categories to test and expand your knowledge.</p>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:bg-white/30 transition-all duration-300 shadow-lg">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4 text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Real-time Contests</h3>
              <p className="text-white/80">Compete with others in real-time contests and see where you stand on the leaderboard.</p>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:bg-white/30 transition-all duration-300 shadow-lg">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4 text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Secure Platform</h3>
              <p className="text-white/80">Our platform ensures fair play and secure participation in all contests.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-white/70">© 2023 KnitQuiz. All rights reserved.</p>
          </div>
          
          <div className="flex space-x-6">
            <a href="/privacy" className="text-white/70 hover:text-white">Privacy Policy</a>
            <a href="/terms" className="text-white/70 hover:text-white">Terms of Service</a>
            <a href="/contactus" className="text-white/70 hover:text-white">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;