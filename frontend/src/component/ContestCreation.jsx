import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Baseurl } from "../main";
import QuestionForm from "./Question.jsx";
import Navbar from "./Navbar.jsx";
import AigeneratedQuestion from "./AigeneratedQuestion.jsx";

// Custom Logo Component (same as login page)
const QuizLogo = () => (
  <div className="flex items-center justify-center">
    <div className="relative">
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
        <rect width="60" height="60" rx="12" fill="url(#gradient1)" />
        <path d="M21 16.5C21 15.6716 21.6716 15 22.5 15H37.5C38.3284 15 39 15.6716 39 16.5V43.5C39 44.3284 38.3284 45 37.5 45H22.5C21.6716 45 21 44.3284 21 43.5V16.5Z" fill="white" />
        <path d="M25.5 22.5C25.5 21.6716 26.1716 21 27 21H33C33.8284 21 34.5 21.6716 34.5 22.5V25.5C34.5 26.3284 33.8284 27 33 27H27C26.1716 27 25.5 26.3284 25.5 25.5V22.5Z" fill="url(#gradient2)" />
        <circle cx="30" cy="33" r="3" fill="url(#gradient2)" />
        <path d="M25.5 39C25.5 38.1716 26.1716 37.5 27 37.5H33C33.8284 37.5 34.5 38.1716 34.5 39C34.5 39.8284 33.8284 40.5 33 40.5H27C26.1716 40.5 25.5 39.8284 25.5 39Z" fill="url(#gradient2)" />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl opacity-20 blur-xl"></div>
    </div>
    <span className="text-white font-black text-3xl ml-4 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200">KnitQuiz</span>
  </div>
);

// Modal component for the question form
const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600/75 flex items-center justify-center p-4">
      <div className="relative bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-500/30 max-w-2xl w-full mx-4 animate-fadeIn overflow-hidden">
        {/* Glassmorphism effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="text-purple-200 hover:text-white focus:outline-none transition-colors duration-300"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

const ContestCreation = () => {
  const navigate = useNavigate();
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const handleOpenModal = () => setAiModalOpen(true);
  const handleCloseModal = () => setAiModalOpen(false);

  // State for contest creation
  const [contestData, setContestData] = useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    isPublic: false,
  });

  // State for created contests
  const [contests, setContests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedContestId, setSelectedContestId] = useState(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  // Load existing contests on component mount
  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    const userid = localStorage.getItem("userId");
    setIsLoading(true);
    try {
      const response = await axios.get(`${Baseurl}/post/getcontest`, {
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userid,
        },
        withCredentials: true,
      });
      setContests(response.data.contests);
    } catch (error) {
      console.error("Error fetching contests:", error);
      toast.error("Failed to load contests. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContestChange = (e) => {
    const { name, value, type, checked } = e.target;
    setContestData({
      ...contestData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const createContest = async (e) => {
    e.preventDefault();

    const startDateTime = new Date(`${contestData.startDate}T${contestData.startTime}`);
    const endDateTime = new Date(`${contestData.endDate}T${contestData.endTime}`);

    if (endDateTime <= startDateTime) {
      toast.error("End date must be after start date");
      return;
    }

    const contestPayload = {
      title: contestData.title,
      description: contestData.description,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      isPublic: contestData.isPublic,
      QuestionSet: [],
    };

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${Baseurl}/post/createcontest`,
        contestPayload,
        {
          withCredentials: true,
          headers: {
            "x-user-id": localStorage.getItem("userId"),
          },
        }
      );
      const newContest = response.data;

      setContests([...contests, newContest]);
      setContestData({
        title: "",
        description: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        isPublic: false,
      });

      toast.success("Contest created successfully!");
    } catch (error) {
      console.error("Error creating contest:", error);
      toast.error("Failed to create contest. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const toggleContestVisibility = async (contestId, currentStatus) => {
    try {
      await axios.post(
        `${Baseurl}/post/makepublic`,
        { isPublic: !currentStatus, contestId },
        { withCredentials: true }
      );

      setContests(
        contests.map((contest) =>
          (contest.id || contest._id) === contestId
            ? { ...contest, isPublic: !currentStatus }
            : contest
        )
      );

      toast.success(`Contest is now ${!currentStatus ? "public" : "private"}`);
    } catch (error) {
      console.error("Error updating contest visibility:", error);
      toast.error("Failed to update contest visibility. Please try again.");
    }
  };

  const handleAddQuestion = (contestId) => {
    setSelectedContestId(contestId);
    setIsQuestionModalOpen(true);
  };

  const closeQuestionForm = () => {
    setSelectedContestId(null);
    setIsQuestionModalOpen(false);
    fetchContests();
  };

  const handleQuestionComplete = () => {
    closeQuestionForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 relative z-10 py-12">
        <div className="max-w-6xl w-full mx-4">
          {/* Contest Creation Card */}
          <div className="group relative bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden mb-10">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="p-8 relative z-10">
              <div className="mb-8 text-center">
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200 mb-4 leading-tight tracking-tight">
                  Create New Contest
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Set up your programming challenge with custom questions
                </p>
              </div>

              <form onSubmit={createContest} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contest Title */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-white tracking-wide">Contest Title</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-purple-300 group-focus-within:text-purple-400 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="title"
                        value={contestData.title}
                        onChange={handleContestChange}
                        className="block w-full pl-12 pr-4 py-4 border-0 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/20 text-white transition-all duration-300 hover:shadow-xl hover:bg-white/15"
                        placeholder="Algorithmic Challenge 2023"
                        required
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-white tracking-wide">Description</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-purple-300 group-focus-within:text-purple-400 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <textarea
                        name="description"
                        value={contestData.description}
                        onChange={handleContestChange}
                        className="block w-full pl-12 pr-4 py-4 border-0 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/20 text-white transition-all duration-300 hover:shadow-xl hover:bg-white/15"
                        placeholder="Describe your contest..."
                        rows="2"
                        required
                      />
                    </div>
                  </div>

                  {/* Start Date */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-white tracking-wide">Start Date</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-purple-300 group-focus-within:text-purple-400 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="date"
                        name="startDate"
                        value={contestData.startDate}
                        onChange={handleContestChange}
                        className="block w-full pl-12 pr-4 py-4 border-0 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/20 text-white transition-all duration-300 hover:shadow-xl hover:bg-white/15"
                        required
                      />
                    </div>
                  </div>

                  {/* Start Time */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-white tracking-wide">Start Time</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-purple-300 group-focus-within:text-purple-400 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <input
                        type="time"
                        name="startTime"
                        value={contestData.startTime}
                        onChange={handleContestChange}
                        className="block w-full pl-12 pr-4 py-4 border-0 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/20 text-white transition-all duration-300 hover:shadow-xl hover:bg-white/15"
                        required
                      />
                    </div>
                  </div>

                  {/* End Date */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-white tracking-wide">End Date</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-purple-300 group-focus-within:text-purple-400 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="date"
                        name="endDate"
                        value={contestData.endDate}
                        onChange={handleContestChange}
                        className="block w-full pl-12 pr-4 py-4 border-0 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/20 text-white transition-all duration-300 hover:shadow-xl hover:bg-white/15"
                        required
                      />
                    </div>
                  </div>

                  {/* End Time */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-white tracking-wide">End Time</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-purple-300 group-focus-within:text-purple-400 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <input
                        type="time"
                        name="endTime"
                        value={contestData.endTime}
                        onChange={handleContestChange}
                        className="block w-full pl-12 pr-4 py-4 border-0 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/20 text-white transition-all duration-300 hover:shadow-xl hover:bg-white/15"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Privacy Toggle */}
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isPublic"
                      checked={contestData.isPublic}
                      onChange={handleContestChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-300">
                      {contestData.isPublic ? 'Public Contest' : 'Private Contest'}
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-4 px-6 border border-transparent rounded-2xl shadow-2xl text-base font-black text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                  disabled={isSubmitting}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </div>
                    ) : (
                      'Create Contest'
                    )}
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                </button>
              </form>
            </div>
          </div>

          {/* Your Contests Section */}
          <div className="group relative bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="p-8 relative z-10">
              <div className="mb-8 text-center">
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200 mb-4 leading-tight tracking-tight">
                  Your Contests
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Manage and add questions to your contests
                </p>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <svg
                    className="animate-spin h-10 w-10 text-purple-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : contests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {contests.map((contest) => (
                    <div
                      key={contest.id || contest._id}
                      className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02]"
                    >
                      <div className={`h-2 ${contest.isPublic ? "bg-green-500" : "bg-gray-600"}`}></div>
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-xl text-white line-clamp-1">
                            {contest.title}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs rounded-full hover:cursor-pointer transition-colors duration-300 ${
                              contest.isPublic
                                ? "bg-green-900/50 text-green-300 hover:bg-green-800/50"
                                : "bg-gray-900/50 text-gray-300 hover:bg-gray-800/50"
                            }`}
                            onClick={() =>
                              toggleContestVisibility(
                                contest.id || contest._id,
                                contest.isPublic
                              )
                            }
                          >
                            {contest.isPublic ? "Public" : "Private"}
                          </span>
                        </div>

                        <p className="text-gray-300 mb-4 line-clamp-2 h-12">
                          {contest.description}
                        </p>

                        <div className="space-y-1 text-sm text-gray-400 mb-4">
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1 text-green-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              ></path>
                            </svg>
                            <span>Start: {formatDate(contest.startDate)}</span>
                          </div>
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1 text-red-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              ></path>
                            </svg>
                            <span>End: {formatDate(contest.endDate)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                          <div className="flex items-center text-sm">
                            <svg
                              className="w-5 h-5 mr-1 text-purple-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              ></path>
                            </svg>
                            <span className="font-medium text-white">
                              {contest.QuestionSet?.length || 0} Questions
                            </span>
                          </div>
                        </div>

                        <div className="flex mt-4 space-x-2">
                          <button
                            onClick={handleOpenModal}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center group"
                          >
                            <svg
                              className="w-4 h-4 mr-2 transition-transform group-hover:scale-110"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                              />
                            </svg>
                            <span className="relative">
                              AI Questions
                              <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                            </span>
                          </button>
                          <AigeneratedQuestion
                            isOpen={aiModalOpen}
                            onClose={handleCloseModal}
                            onSave={() => {}}
                          />
                          <button
                            onClick={() => handleAddQuestion(contest.id || contest._id)}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors shadow-md hover:shadow-lg flex items-center justify-center group"
                          >
                            <svg
                              className="w-4 h-4 mr-1 group-hover:rotate-90 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              ></path>
                            </svg>
                            Add Questions
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white/5 rounded-xl backdrop-blur-sm">
                  <svg
                    className="mx-auto h-16 w-16 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-white">
                    No contests created yet
                  </h3>
                  <p className="mt-2 text-gray-300 max-w-md mx-auto">
                    Get started by creating your first contest using the form above.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Question Form Modal */}
      <Modal isOpen={isQuestionModalOpen} onClose={closeQuestionForm}>
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 px-6 py-4 -m-6 mb-6 rounded-t-xl border-b border-purple-500/30">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200">
            Add Question
          </h2>
          <p className="text-gray-300 text-sm">
            Create a multiple choice question for your contest
          </p>
        </div>
        {selectedContestId && (
          <QuestionForm
            contestId={selectedContestId}
            onComplete={handleQuestionComplete}
          />
        )}
      </Modal>

      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

export default ContestCreation;