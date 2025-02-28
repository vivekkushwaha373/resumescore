"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function CandidateForm() {
    const { register, handleSubmit, setValue ,getValues,reset} = useForm();
    const [resumeText, setResumeText] = useState("");
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setValue("resumeText", resumeText);
    }, [resumeText, setValue]);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("/api/parseresume", formData);
            setResumeText(response.data.text);
        } catch (error) {
            console.error("Error parsing PDF:", error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const newSkill = e.target.value.trim();
            if (newSkill && !skills.includes(newSkill)) {
                setSkills([...skills, newSkill]);
                setValue("skills", [...skills, newSkill]); // Update form state
            }
            e.target.value = "";
        }
    };
   
    const handleRemoveSkill = (skillToRemove) => {
        const updatedSkills = skills.filter(skill => skill !== skillToRemove);
        setSkills(updatedSkills);
        setValue("skills", updatedSkills); // Update form state
    };



    const onSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.post("/api/storeresume", {
                candidateId: `${getValues("name")}_123`, // Unique ID
                resumeText, // Extracted text from PDF
                skills,
                name: getValues("name"),
                email: getValues("email"),
                linkdinUrl: getValues("linkedin"),
             }, {
                headers: { "Content-Type": "application/json" }
            });

            toast.success(response.data.message);
            reset();
            setResumeText("");

        } catch (error) {
            toast.error(error.response?.data.message);
            console.error("Error storing resume:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex flex-col gap-2 items-center justify-center p-4">
            <div className="flex justify-between gap-10">

            <Link href={'/'}>
                    <button className="bg-slate-200 text-black px-4 py-2 rounded">Back to Home</button>
            </Link>
            <Link href={'/jobdescription'}>
                    <button className="bg-slate-200 text-black px-4 py-2 rounded">Search Candidate</button>
            </Link>
            </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 p-4 max-w-lg mx-auto border rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Candidate Application</h2>

            <label className="block">Name</label>
            <input {...register("name", { required: true })} className="border p-2 w-full mb-2" />

            <label className="block">Email</label>
            <input type="email" {...register("email", { required: true })} className="border p-2 w-full mb-2" />

            <label className="block">LinkedIn URL</label>
            <input type="url" {...register("linkedin", { required: true })} className="border p-2 w-full mb-2" />

                <label className="block">Upload Resume (<strong>PDF Only</strong>)</label>
            <input type="file" accept="application/pdf" onChange={handleFileUpload} className="border p-2 w-full mb-2" />

            <textarea {...register("resumeText")} value={resumeText} readOnly className="border p-2 w-full h-24 mb-2" />

            <label className="block">Skills & Experience</label>
            <input placeholder="Type a skill and press Enter or comma" onKeyPress={handleKeyPress} type="text" className="border p-2 w-full mb-2" />
            <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveSkill(skill)}>
                        {skill} ×
                    </Badge>
                ))}
            </div>
            {
                    loading ? (<button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded"><p className="flex">submitting <span><Loader2 className="animate-spin"></Loader2></span></p></button>): (<button type = "submit" className = "bg-blue-500 text-white px-4 py-2 rounded">Submit</button>)       
            } 
           
            </form>
           
        </div>
          
    );
}
