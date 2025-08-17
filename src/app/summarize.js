"use client";
import { useState } from "react";

export default function Summarizer() {
  const [file, setFile] = useState(null);
  const [instruction, setInstruction] = useState("");
  const [summary, setSummary] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please upload a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("instruction", instruction);

    try {
      const response = await fetch("http://localhost:8000/summarize/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setSummary(data.summary || "No summary returned.");
    } catch (error) {
      console.error("Error:", error);
      setSummary("Error while summarizing.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">
        AI Meeting Notes Summarizer
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept=".txt"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Enter instructions (e.g., summarize action items)"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Generate Summary
        </button>
      </form>

      {summary && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="font-semibold mb-2">Summary:</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
