import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Moon, Home, BarChart3, LogIn, LogOut, User } from "lucide-react";

const Navbar = ({ token, handleLogout }) => {
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("darkMode") === "true"
    );

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-md dark:shadow-lg transition duration-300">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Link
                        to="/"
                        className="flex items-center text-xl font-bold text-gray-800 dark:text-white"
                    >
                        <Home className="w-6 h-6 mr-2 text-blue-500 dark:text-blue-400" />
                        AI Resume
                    </Link>
                </motion.div>

                <div className="flex space-x-6">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Link
                            to="/dashboard"
                            className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition"
                        >
                            <BarChart3 className="w-5 h-5 mr-2" />
                            Dashboard
                        </Link>
                    </motion.div>

                    {token && (
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Link
                                to="/admin"
                                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition"
                            >
                                <User className="w-5 h-5 mr-2" />
                                Admin
                            </Link>
                        </motion.div>
                    )}
                </div>

                <div className="flex items-center space-x-4">
                    <motion.button
                        whileHover={{ rotate: 180 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 transition"
                        onClick={() => setDarkMode(!darkMode)}
                    >
                        {darkMode ? (
                            <Sun className="w-6 h-6 text-yellow-400" />
                        ) : (
                            <Moon className="w-6 h-6 text-gray-700" />
                        )}
                    </motion.button>

                    {token ? (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-5 h-5 mr-2" />
                            Logout
                        </motion.button>
                    ) : (
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Link
                                to="/login"
                                className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                            >
                                <LogIn className="w-5 h-5 mr-2" />
                                Login
                            </Link>
                        </motion.div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
