"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function RecruiterDashboard() {
    const [jobDescription, setJobDescription] = useState("");
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSearch = async () => {
        if (!jobDescription.trim()) {
            toast.error("Please enter a job description!");
            return;
        }

        setLoading(true);
        setCandidates([]); 

        try {
            const response = await axios.post("/api/findcandidates", { jobDescription }, {
                headers: { "Content-Type": "application/json" }
            });

            const data = response.data;
         
            if (data.candidates.length === 0) {
                toast.error("No matching candidates found!");
            }

            setCandidates(data.candidates);
        } catch (error) {
            console.error("Error fetching candidates:", error);
            toast.error("Failed to fetch candidates.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">Recruiter Dashboard</h1>

            <div className="flex gap-2 mb-6">
                <Input
                    type="text"
                    placeholder="Enter job description..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="flex-1"
                />
                <Button onClick={handleSearch} disabled={loading}>
                    {loading ? "Searching..." : "Find Candidates"}
                </Button>
            </div>

            {loading && <p className="text-center text-gray-500">Fetching candidates...</p>}

            <div className="space-y-4">
                {candidates?.map((candidate, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>{candidate.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 mb-2">
                                <strong>Email:</strong>{" "}
                                <a href={`mailto:${candidate.email}`} className="text-blue-500 underline">
                                    {candidate.email}
                                </a>
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>LinkedIn:</strong>{" "}
                                <a href={candidate.linkedin} target="_blank" className="text-blue-500 underline">
                                    {candidate.linkedin}
                                </a>
                            </p>
                            <p className="text-gray-700 italic">{candidate.summary}</p>
                            
                            {candidate.skills && candidate.skills.length > 0 && (
                                <div className="mt-2">
                                    <strong>Skills:</strong>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {candidate.skills.map((skill, idx) => (
                                            <span key={idx} className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Back to Home Button */}
            <div className="mt-6 text-center">
                <Button onClick={() => router.push("/")} variant="secondary">
                    Back to Home
                </Button>
            </div>
        </div>
    );
}
