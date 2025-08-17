"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [transcriptText, setTranscriptText] = useState("");
  const [instruction, setInstruction] = useState("Summarize in bullet points for executives. Emphasize action items with owners and deadlines.");
  const [aiSummary, setAiSummary] = useState("");
  const [editedSummary, setEditedSummary] = useState("");
  const [recipients, setRecipients] = useState("");
  const [loading, setLoading] = useState(false);

  // read file into transcriptText if user uploads .txt
  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => {
      setTranscriptText(String(reader.result || ""));
    };
    reader.readAsText(f);
  };

  const generateSummary = async () => {
    if (!file && !transcriptText.trim()) {
      alert("Please upload a .txt file or paste the transcript.");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      if (file) form.append("file", file);
      else form.append("transcript", transcriptText);
      form.append("instruction", instruction);

      const res = await fetch("http://127.0.0.1:8000/summarize/", {
        method: "POST",
        body: form,
      });
      const j = await res.json();
      if (res.ok) {
        setAiSummary(j.summary || "");
        setEditedSummary(j.summary || "");
      } else {
        alert("Error: " + (j.detail || JSON.stringify(j)));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to call backend. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async () => {
    const list = recipients.split(",").map(s => s.trim()).filter(Boolean);
    if (!list.length) {
      alert("Enter recipient emails (comma separated).");
      return;
    }
    const subject = "Meeting Summary";
    // Convert editedSummary (plaintext/markdown) into minimal HTML for email
    const html = editedSummary
      .split("\n")
      .map(line => `<p>${line.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`)
      .join("");

    try {
      const res = await fetch("http://127.0.0.1:8000/send-email/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, html, recipients: list }),
      });
      const j = await res.json();
      if (res.ok) {
        alert("Email sent!");
      } else {
        alert("Email error: " + (j.detail || JSON.stringify(j)));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send email. Check backend logs.");
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-100 flex justify-center">
      <div style={{ maxWidth: 900, width: "100%" }} className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">AI Meeting Notes Summarizer</h1>

        <div className="mb-4">
          <label className="block font-medium mb-1">Upload transcript (.txt)</label>
          <input type="file" accept=".txt" onChange={onFileChange} />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Or paste transcript</label>
          <textarea rows={6} value={transcriptText} onChange={(e)=>setTranscriptText(e.target.value)} className="w-full border p-2" />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Custom instruction / prompt</label>
          <input value={instruction} onChange={(e)=>setInstruction(e.target.value)} className="w-full border p-2" />
        </div>

        <button onClick={generateSummary} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
          {loading ? "Generating..." : "Generate Summary"}
        </button>

        {aiSummary && (
          <section className="mt-6">
            <h2 className="text-lg font-semibold mb-2">AI Summary (editable)</h2>
            <textarea rows={12} value={editedSummary} onChange={(e)=>setEditedSummary(e.target.value)} className="w-full border p-2" />
            <details className="mt-2">
              <summary className="cursor-pointer">Show original AI output</summary>
              <pre className="mt-2 p-2 bg-gray-50 border">{aiSummary}</pre>
            </details>

            <div className="mt-4">
              <label className="block font-medium mb-1">Recipient emails (comma separated)</label>
              <input value={recipients} onChange={(e)=>setRecipients(e.target.value)} className="w-full border p-2 mb-2" placeholder="alice@example.com, bob@example.com" />
              <button onClick={sendEmail} className="px-4 py-2 bg-green-600 text-white rounded">Send Summary via Email</button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
