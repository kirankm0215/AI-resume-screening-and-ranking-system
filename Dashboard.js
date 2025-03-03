import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Dashboard = ({ rankedCandidates }) => {
    return (
        <div className="p-6 flex flex-col items-center">
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-3xl">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    📊 Resume Ranking Results
                </h2>

                {rankedCandidates.length > 0 ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={rankedCandidates} barSize={40}>
                                <XAxis dataKey="name" stroke="#4B5563" tick={{ fill: "#374151", fontSize: 14 }} />
                                <YAxis stroke="#4B5563" tick={{ fill: "#374151", fontSize: 14 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#1F2937",
                                        color: "#FFF",
                                        borderRadius: "8px",
                                        padding: "10px",
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="score" fill="#6366F1" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center mt-4">
                        ⚠️ No ranked resumes available. Please rank resumes first.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
