"use client";
import React, { useState } from "react";

export default function EmployeeRosterUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [manual, setManual] = useState("");
  const [status, setStatus] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("");
    }
  };

  const handleManualChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setManual(e.target.value);
    setStatus("");
  };

  const handleUpload = async () => {
    setStatus("Uploading...");
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/employees/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setStatus(data.success ? "Upload successful!" : `Error: ${data.error}`);
    } else if (manual.trim()) {
      const res = await fetch("/api/employees/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ manual }),
      });
      const data = await res.json();
      setStatus(data.success ? "Upload successful!" : `Error: ${data.error}`);
    } else {
      setStatus("Please select a file or enter employee data manually.");
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Employee Roster</h1>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Upload File (Word, Excel, CSV):</label>
        <input type="file" accept=".csv,.xlsx,.xls,.doc,.docx,.txt" onChange={handleFileChange} />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Or Enter Manually (one per line):</label>
        <textarea
          className="border px-2 py-1 rounded w-full min-h-[120px]"
          placeholder="Name, Email, Phone..."
          value={manual}
          onChange={handleManualChange}
        />
      </div>
      <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleUpload} type="button">
        Upload Roster
      </button>
      {status && <div className="mt-4 text-green-700">{status}</div>}
    </div>
  );
}
