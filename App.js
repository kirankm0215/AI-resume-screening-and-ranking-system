import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import Dashboard from './Dashboard';  
import AdminLogin from "./AdminLogin";
import AdminSignUp from "./AdminSignUp";
import AdminDashboard from "./AdminDashboard";
import { Sun, Moon, Upload, Mail, LogOut, FileText } from "lucide-react"; 
import ClipLoader from "react-spinners/ClipLoader";
import "./index.css";

const PrivateRoute = ({ children }) => {
    return localStorage.getItem("adminToken") ? children : <Navigate to="/login" />;
};

const App = () => {
    const [file, setFile] = useState(null);
    const [extractedText, setExtractedText] = useState("");
    const [rankedCandidates, setRankedCandidates] = useState([]);
    const [email, setEmail] = useState("");
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [jobDescription, setJobDescription] = useState("");

    useEffect(() => {
        if (token) fetchResumes();
    }, [token]);

    const fetchResumes = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://127.0.0.1:5000/get_resumes");
            const data = await response.json();
            setResumes(data);
        } catch (error) {
            alert("❌ Error fetching resumes.");
        }
        setLoading(false);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("❌ Please select a file to upload.");
            setExtractedText(""); // Clear extracted text when no new resume is uploaded
            return;
        }
    
        const formData = new FormData();
        formData.append("resume", file);
        setLoading(true);
        setExtractedText(""); // Clear the old extracted text before uploading a new one
    
        try {
            const response = await fetch("http://127.0.0.1:5000/upload", {
                method: "POST",
                body: formData,
            });
    
            const data = await response.json();
            if (data.message) {
                setExtractedText(data.extracted_text);
                alert("✅ Resume uploaded successfully!");
                fetchResumes();
            } else {
                alert("❌ Failed to upload resume.");
            }
        } catch (error) {
            alert("❌ Error uploading resume.");
        }
        setLoading(false);
    };
    
    const handleRanking = async () => {
        if (!jobDescription.trim()) {
            alert("❌ Please enter a job description.");
            return;
        }
        setLoading(true);
        try {
            const resumesText = resumes.map(resume => resume.text);
    
            const response = await fetch("http://127.0.0.1:5000/rank_resumes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resumes: resumesText, job_description: jobDescription }),
            });
    
            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }
    
            const data = await response.json();
            setRankedCandidates(data.ranked_candidates);
            alert("✅ Ranking successful!");
        } catch (error) {
            alert("❌ Failed to rank resumes.");
        }
        setLoading(false);
    };
    
    

    const sendEmailNotification = async () => {
        if (!email) {
            alert("❌ Please enter an email address.");
            return;
        }
    
        setLoading(true);
        try {
            const response = await fetch("http://127.0.0.1:5000/send_email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    message: "Your resume has been processed. Check your ranking in the system.",
                }),
            });
    
            const data = await response.json();
            if (response.ok) {
                alert("✅ Email sent successfully!");
            } else {
                alert(`❌ Failed to send email: ${data.error}`);
            }
        } catch (error) {
            alert(`❌ Error sending email: ${error.message}`);
        }
        setLoading(false);
    };
    

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    return (
        <Router>
            <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} p-6`}>
                {/* 🔹 Navbar */}
                <nav className={`p-4 shadow-md rounded-lg flex justify-between items-center ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <h1 className="text-xl font-bold">AI Resume Screening</h1>
                    <div className="flex gap-4">
                        <Link className="hover:text-blue-500" to="/">Home</Link>
                        <Link className="hover:text-blue-500" to="/dashboard">Dashboard</Link>
                        {token && <Link className="hover:text-blue-500" to="/admin">Admin</Link>}
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => setDarkMode(!darkMode)}>
                            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
                        </button>
                        {token ? (
                            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white flex items-center gap-2">
                                <LogOut size={18} /> Logout
                            </button>
                        ) : (
                            <Link className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white" to="/admin-login">Login</Link>
                        )}
                    </div>
                </nav>

                {/* 🔹 Main Content */}
                <div className="container mx-auto p-6">
                <Routes>
    <Route path="/" element={
        <div className="text-center">
            <h2 className="text-3xl font-bold">AI Resume Screening & Ranking</h2>

            {/* 🔹 Upload Resume Box */}
<div className="mt-6 bg-white p-6 shadow-lg rounded-lg max-w-lg mx-auto">
    <h3 className="text-lg font-semibold">Upload Resume</h3>
    <input type="file" onChange={(e) => setFile(e.target.files[0])} className="border p-2 w-full rounded-md" />

    <button 
        onClick={handleUpload}
        className="mt-4 bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg text-white flex items-center gap-2">
        <Upload size={18} /> Upload & Extract
    </button>
    {loading && <ClipLoader color="#000" className="mt-4" />}
    {/* 🔹 Extracted Resume Text (Scrollable Box Inside Upload Section) */}
    {extractedText && (
  <div className="mt-6 p-4 shadow-lg rounded-lg text-left max-w-lg mx-auto extracted-text-container">
      <h4 className="font-semibold text-gray-700 flex items-center gap-2">
          <FileText size={18} /> Extracted Resume Text:
      </h4>
      <p className="text-sm text-gray-600 mt-2">{extractedText}</p>
  </div>
)}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold">Job Description</h3>
                        <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} className="border p-2 w-full rounded-md" placeholder="Enter job description here"></textarea>
                    </div>

    
</div>

            {/* 🔹 Send Notification Box (Fixed Input Visibility) */}
<div className="mt-6 max-w-lg bg-white p-4 shadow-lg rounded-lg mx-auto">
    <h3 className="text-lg font-semibold">Send Notification</h3>
    <input 
        type="email" 
        value={email}  // Ensures visibility
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter candidate email" 
        className="border border-gray-400 p-2 w-full rounded-md text-black bg-white"
    />
    <button 
        onClick={sendEmailNotification}
        className="mt-4 bg-purple-500 hover:bg-purple-600 px-6 py-2 rounded-lg text-white flex items-center gap-2">
        <Mail size={18} /> Send Email
    </button>
</div>


            {/* 🔹 Ranking Button (Below Send Notification) */}
            <button onClick={handleRanking} className="mt-4 bg-green-500 px-4 py-2 rounded text-white">Rank Resumes</button>

<h3 className="mt-4 font-semibold">Resume Rankings</h3>
<table className="w-full border mt-2">
    <thead>
        <tr className="bg-gray-300">
            <th className="border p-2">Rank</th>
            <th className="border p-2">Resume Name</th>
            <th className="border p-2">Score</th>
        </tr>
    </thead>
    <tbody>
        {rankedCandidates.sort((a, b) => b.score - a.score).map((candidate, index) => (
            <tr key={index} className="border">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{candidate.name}</td>
                <td className="border p-2">{candidate.score}</td>
            </tr>
        ))}
    </tbody>
</table>
</div>

    }
 />
                         <Route path="/dashboard" element={<Dashboard rankedCandidates={rankedCandidates} />} />
                         <Route path="/admin-login" element={<AdminLogin />} />
                         <Route path="/admin-signup" element={<AdminSignUp />} />
                        <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
