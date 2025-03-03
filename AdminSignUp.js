import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Mail, Key } from "lucide-react"; // Icons

const AdminSignup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // ✅ Hook for navigation

    const handleSignup = async (e) => {
        e.preventDefault();

        // ✅ Check if passwords match before sending request
        if (password !== confirmPassword) {
            alert("❌ Passwords do not match! Please try again.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("http://127.0.0.1:5000/admin_signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();
            console.log("Server Response:", data); // ✅ Debugging line

            if (response.ok && data.success) {
                alert("✅ Account created successfully!");
                navigate("/admin-login"); // ✅ Redirect after signup
            } else {
                alert(`❌ Signup failed! ${data.error || "Try again."}`);
            }
        } catch (error) {
            alert("❌ Error during signup. Please check your connection.");
            console.error("Signup Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
            <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20">
                <h2 className="text-4xl font-extrabold text-white text-center mb-6">
                    Admin Signup
                </h2>

                <form onSubmit={handleSignup} className="space-y-6">
                    {/* Username Input */}
                    <div className="relative">
                        <span className="absolute left-4 top-3 text-gray-300">
                            <User size={20} />
                        </span>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 outline-none transition"
                            required
                        />
                    </div>

                    {/* Email Input */}
                    <div className="relative">
                        <span className="absolute left-4 top-3 text-gray-300">
                            <Mail size={20} />
                        </span>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 outline-none transition"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <span className="absolute left-4 top-3 text-gray-300">
                            <Lock size={20} />
                        </span>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 outline-none transition"
                            required
                        />
                    </div>

                    {/* Confirm Password Input */}
                    <div className="relative">
                        <span className="absolute left-4 top-3 text-gray-300">
                            <Key size={20} />
                        </span>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 outline-none transition"
                            required
                        />
                    </div>

                    {/* Signup Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 shadow-lg shadow-blue-500/30"
                    >
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>

                {/* Already have an account? Login */}
                <p className="text-gray-300 text-center mt-6">
                    Already have an account?{" "}
                    <button
                        onClick={() => navigate("/admin-login")}
                        className="text-blue-300 hover:text-blue-400 font-semibold transition"
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AdminSignup;
