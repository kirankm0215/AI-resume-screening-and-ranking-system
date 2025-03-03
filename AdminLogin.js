import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock } from "lucide-react";

const AdminLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); 

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:5000/admin_login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (data.token) {
                localStorage.setItem("adminToken", data.token);
                alert("✅ Admin logged in successfully!");
                navigate("/"); 
            } else {
                alert("❌ Invalid credentials!");
            }
        } catch (error) {
            alert("❌ Error logging in.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
            <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 relative overflow-hidden">
                <h2 className="text-4xl font-extrabold text-white text-center mb-6 drop-shadow-md">
                    Admin Login
                </h2>

                <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                    <div className="relative">
                        <span className="absolute left-4 top-3 text-gray-300">
                            <User size={20} />
                        </span>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 outline-none transition"
                            required
                        />
                    </div>

                    <div className="relative">
                        <span className="absolute left-4 top-3 text-gray-300">
                            <Lock size={20} />
                        </span>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 outline-none transition"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 shadow-lg shadow-blue-500/30 animate-glow"
                    >
                        Login
                    </button>
                </form>

                {/* Use Link instead of <a> */}
                <p className="text-gray-300 text-center mt-6">
                    Don't have an account?{" "}
                    <Link to="/admin-signup" className="text-blue-300 hover:text-blue-400 font-semibold transition">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
