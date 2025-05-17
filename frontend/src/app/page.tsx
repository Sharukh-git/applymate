"use client";

import { useState, useEffect,useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, LoaderCircle, XCircle } from "lucide-react";
import AuthButtons from "@/components/AuthButtons";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function truncateFileName(name: string): string {
  const extIndex = name.lastIndexOf('.');
  if (extIndex === -1) return name;

  const ext = name.slice(extIndex);
  const base = name.slice(0, extIndex);

  return base.length > 18 ? `${base.slice(0, 15)}...${ext}` : `${base}${ext}`;
}


export default function Home() {
  const [uploadMessage, setUploadMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState<{
  matchScore: number;
  weakSkills: string[];
  suggestedImprovements: string[];
  suggestedCourses: string[];
} | null>(null);
  const [applicationId, setApplicationId] = useState("");
  const [status, setStatus] = useState<"idle" | "queued" | "processing" | "done" | "error">("idle");
  const [generatingCover, setGeneratingCover] = useState(false);
  const [fileSizeMB, setFileSizeMB] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const saved = sessionStorage.getItem("applymate-data");
    if (saved) {
      const parsed = JSON.parse(saved);
      setJobDescription(parsed.jobDescription || "");
      setFileName(parsed.fileName || "");
      setResult(parsed.result || null);
      setApplicationId(parsed.applicationId || "");
      setStatus(parsed.status || "idle");
    }
  }, []);

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert("❌ File too large. Max allowed size is 5MB.");
      return;
    }
    if (file) {
  setResumeFile(file);
  setFileName(file.name);
  setFileSizeMB((file.size / (1024 * 1024)).toFixed(2)); // MB rounded
  setUploadMessage(""); // ✅ clears warning after file upload
}
  }
};


  const handleSubmit = async () => {
    if (!resumeFile || !jobDescription) return;
    setStatus("queued");
    setResult(null);

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);

    try {
      const res = await fetch(`${API_BASE}/api/analyze`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setApplicationId(data.id);
      setStatus("processing");
      pollForResults(data.id);
    } catch  {
      setStatus("error");
    }
  };

  const pollForResults = async (id: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/results/${id}`);
        const data = await res.json();

        if (data.status === "done") {
          clearInterval(interval);
          setResult(data);
          setStatus("done");
          sessionStorage.setItem("applymate-data", JSON.stringify({
          jobDescription,
          fileName,
          result: data,
          applicationId: id,
          status: "done",
}));

          setTimeout(() => {
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, 100);


          localStorage.setItem(
            "applymate-data",
            JSON.stringify({
              jobDescription,
              fileName,
              result: data,
              applicationId: id,
              status: "done",
            })
          );
        }
      } catch {
        clearInterval(interval);
        setStatus("error");
      }
    }, 3000);
  };

  const generateCoverLetter = async () => {
    setGeneratingCover(true);
    await fetch(`${API_BASE}/api/cover-letter/${applicationId}`, {
      method: "POST",
    });
    setGeneratingCover(false);
    router.push(`/cover-letter/${applicationId}`);
  };

  return (
    <>
      <section className="min-h-screen w-full bg-gradient-to-br from-indigo-50 to-white px-4 py-10">
        <AuthButtons />
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl font-extrabold tracking-tight text-indigo-900 drop-shadow-md">
              ApplyMate
            </h1>
            <p className="text-gray-600 mt-3 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
              Upload your resume and job description to get tailored insights from AI
            </p>
          </div>

          <div className="card backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
               <label
                tabIndex={0}
                className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded cursor-pointer text-sm font-medium border border-gray-300 shadow">
                  <Upload size={16} className="mr-2" />
                   Choose File
                   <input
  ref={fileInputRef}
  type="file"
  accept=".pdf, .doc, .docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  className="hidden"
  onChange={handleFileChange}
/>

    
  </label>
  <p className="text-xs text-gray-500 mt-1 ml-1">Max file size: 5MB</p>
  
  {fileName && (
  <span
    className="text-sm text-green-700 font-medium inline-block max-w-[220px] overflow-hidden whitespace-nowrap text-ellipsis"
    title={fileName}
  >
    Uploaded: {truncateFileName(fileName)} {fileSizeMB ? ` (${fileSizeMB} MB)` : ""}
  </span>
)}
{uploadMessage && (
  <p className="text-xs text-red-600 font-medium">
    ⚠️ {uploadMessage}
  </p>
)}


</div>

            <textarea
              placeholder="Paste job description here..."
              className="w-full h-40 p-3 rounded-xl shadow-inner border border-gray-200 bg-white/90 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={jobDescription}
              onChange={(e) =>  setJobDescription(e.target.value)}
  
/>

<p className="text-xs mt-1 text-gray-500">
  Max 1500 words. Current: {countWords(jobDescription)}
</p>

{countWords(jobDescription) > 1500 && (
  <p className="text-xs text-red-600 font-medium mt-1">
    ⚠️ Job description exceeds 1500 words. Please shorten it to continue.
  </p>
)}
            <div className="flex flex-col md:flex-row gap-3">
              <button
               onClick={handleSubmit}
               disabled={
               status === "processing" ||
               !resumeFile ||
              jobDescription.trim().length === 0 ||
               countWords(jobDescription) > 1500           
                }
           className={`button-primary ${
            status === "processing" ||
             !resumeFile ||
               jobDescription.trim().length === 0 ||
               countWords(jobDescription) > 1500
              ? "opacity-50 cursor-not-allowed"
               : ""
  }`}
>
  {status === "processing" ? (
    <LoaderCircle size={18} className="animate-spin mr-2" />
  ) : null}
  {status === "processing" ? "Analyzing..." : "Analyze"}
</button>


              <button
             onClick={() => {
              setUploadMessage("No file selected. Please upload a document to continue.");
              setResumeFile(null);
              setJobDescription("");
              setFileName("");
              setResult(null);
              setStatus("idle");
              localStorage.removeItem("applymate-data");
              if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
            }}
            className="inline-flex items-center justify-center border border-gray-300 text-gray-600 hover:text-gray-800 hover:border-gray-400 px-4 py-2 rounded-xl transition-all bg-white/70 backdrop-blur shadow-sm"
          >
            <XCircle size={16} className="mr-2" />
            Clear All
          </button>

            </div>

            {status === "error" && (
              <p className="text-red-600 text-sm font-medium">
                ❌ Something went wrong. Please try again.
              </p>
            )}
          </div>

          {status === "done" && result && (
            <div ref={resultRef} className="space-y-6">
              <ScoreBox score={result.matchScore} />
              <Section title="Weak / Missing Skills" items={result.weakSkills} />
              <Section title="Resume Suggestions" items={result.suggestedImprovements} />
              <Section title="Recommended Courses" items={result.suggestedCourses} />

              <button
                onClick={generateCoverLetter}
                disabled={generatingCover}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-medium shadow-md transition-transform hover:scale-105"
              >
                {generatingCover ? "Generating..." : "Generate Cover Letter"}
              </button>
            </div>
          )}
        </div>
      </section>

      <footer className="w-full text-center text-sm text-gray-400 mt-16 py-8 border-t border-gray-200">
        Powered by AI | © 2025 Sharukh Shaik. All rights reserved.
      </footer>
    </>
  );
}

function ScoreBox({ score }: { score: number }) {
  return (
    <div className="p-6 border border-green-500 rounded-lg bg-green-50 shadow">
      <h2 className="text-xl font-semibold text-green-800">Match Score</h2>
      <p className="text-3xl font-bold mt-2 text-green-700">{(score * 100).toFixed(0)}%</p>
      <div className="w-full bg-green-100 h-2 rounded mt-2">
        <div
          className="bg-green-500 h-2 rounded transition-all duration-500"
          style={{ width: `${score * 100}%` }}
        />
      </div>
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="section-box hover:bg-white/90 transition-all duration-300 border-t-4 border-blue-100">
      <h3 className="text-lg font-semibold mb-2 pt-2 text-gray-800">{title}</h3>
      <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
