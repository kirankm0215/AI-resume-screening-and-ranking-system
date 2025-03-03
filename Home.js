import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import { Moon, Sun, Upload, Mail, LogOut, UserPlus, LogIn, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import Dashboard from "./Dashboard";  
import AdminLogin from "./AdminLogin";
import AdminSignup from "./AdminSignup";
import AdminDashboard from "./AdminDashboard";
import "tailwindcss/tailwind.css";

const PrivateRoute = ({ children }) => {
    return localStorage.getItem("adminToken") ? children : <Navigate to="/login" />;
};

const App = () => {
    const [file, setFile] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    const handleToggleDarkMode = () => setDarkMode(!darkMode);

    return (
        <Router>
            <div className={darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}>
                {/* Navbar */}
                <nav className="flex justify-between items-center p-5 bg-blue-600 text-white shadow-lg">
                    <div className="flex items-center gap-4">
                        <Link className="text-xl font-bold flex items-center gap-2" to="/">
                            <BarChart3 className="w-6 h-6" /> ResumeRanker
                        </Link>
                        <Link className="px-3 py-1 rounded hover:bg-blue-500" to="/dashboard">Dashboard</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={handleToggleDarkMode} className="p-2 rounded bg-gray-800 hover:bg-gray-700">
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <Link className="bg-green-500 px-4 py-2 rounded flex items-center gap-2" to="/login">
                            <LogIn className="w-4 h-4" /> Login
                        </Link>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="container mx-auto p-10 text-center">
                    <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
                        className="text-4xl font-bold">
                        AI Resume Screening System
                    </motion.h2>
                    <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
                        Upload resumes, rank candidates, and streamline your hiring process.
                    </p>
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}
                        className="mt-6 flex justify-center gap-4">
                        <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2">
                            <Upload className="w-5 h-5" /> Upload Resume
                            <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                        </label>
                        <button className="bg-purple-500 px-4 py-2 rounded text-white flex items-center gap-2">
                            <Mail className="w-5 h-5" /> Notify Candidates
                        </button>
                    </motion.div>
                </div>

                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/login" element={<AdminLogin />} />
                    <Route path="/signup" element={<AdminSignup />} />
                    <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
