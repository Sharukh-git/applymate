"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import jsPDF from "jspdf";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

export default function CoverLetterPage() {
  const params = useParams();
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLetter = async () => {
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      try {
        const res = await fetch(`${API_BASE}/api/results/${id}`);
        const data = await res.json();
        setCoverLetter(data.coverLetter || "No cover letter found.");
      } catch {
        setCoverLetter("Error fetching cover letter. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchLetter();
  }, [params.id]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    doc.setLineHeightFactor(1.6);

    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxLineWidth = pageWidth - margin * 2;
    const fontSize = 12;

    doc.setFont("Times", "Normal");
    doc.setFontSize(fontSize);

    const lines = doc.splitTextToSize(coverLetter, maxLineWidth);
    let y = 60;

    lines.forEach((line: string) => {
      if (y > 750) {
        doc.addPage();
        y = 60;
      }
      doc.text(line, margin, y);
      y += fontSize * 1.6;
    });

    doc.save("Cover_Letter.pdf");
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800 drop-shadow-sm">
          Your Tailored Cover Letter
        </h1>

        <div className="rounded-2xl bg-white/90 shadow-lg p-6 md:p-8 border border-gray-200 backdrop-blur-md transition-all">
          {loading ? (
            <p className="text-center text-blue-500 font-medium">Loading cover letter...</p>
          ) : (
            <div className="text-gray-900 whitespace-pre-wrap leading-relaxed text-base md:text-lg">
              {coverLetter}
            </div>
          )}

          {!loading && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleDownloadPDF}
                className="bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-lg font-medium shadow-lg transition-all hover:scale-105"
              >
                Download as PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
