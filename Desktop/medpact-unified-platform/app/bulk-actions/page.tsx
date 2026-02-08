"use client";
import React, { useRef, useState } from "react";

export default function BulkActions() {
  const [file, setFile] = useState<File | null>(null);
  const [dataPreview, setDataPreview] = useState<any[]>([]);
  const [detectedModule, setDetectedModule] = useState<string>("");
  const [autoFormat, setAutoFormat] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dummy module detection logic
  function detectModule(data: any[]): string {
    if (!data.length) return "";
    const keys = Object.keys(data[0]).map(k => k.toLowerCase());
    if (keys.includes("employee") || keys.includes("name")) return "Employee Management";
    if (keys.includes("contract") || keys.includes("provider")) return "Contracts";
    if (keys.includes("patient")) return "Patients";
    if (keys.includes("survey")) return "Surveys";
    if (keys.includes("report")) return "Reporting";
    return "Unknown";
  }

  // Dummy CSV/JSON parser
  function parseFile(file: File, cb: (data: any[]) => void) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      let data: any[] = [];
      if (file.name.endsWith(".json")) {
        try { data = JSON.parse(text); } catch {}
      } else if (file.name.endsWith(".csv")) {
        const [header, ...rows] = text.split(/\r?\n/).filter(Boolean);
        const keys = header.split(",");
        data = rows.map(row => {
          const values = row.split(",");
          return Object.fromEntries(keys.map((k, i) => [k.trim(), values[i]?.trim() ?? ""]));
        });
      }
      cb(data);
    };
    reader.readAsText(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    parseFile(f, (data) => {
      setDataPreview(data.slice(0, 5));
      setDetectedModule(detectModule(data));
    });
    setUploadStatus("");
  }

  function handleAutoFormat() {
    setAutoFormat(true);
    setUploadStatus("Data auto-reformatted to match template for " + detectedModule);
  }

  function handleUpload() {
    setUploadStatus("Data uploaded to " + detectedModule + " module.");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex">
      {/* AI Assistant Sidebar */}
      <aside className="w-72 min-h-screen bg-white border-r p-6 flex flex-col mr-8">
        <h2 className="text-lg font-bold mb-4 text-blue-700">AI Bulk Actions Assistant</h2>
        <button className="mb-4 px-3 py-1 bg-blue-600 text-white rounded">Get Smart Automation</button>
        <ul className="mb-4">
          <li className="mb-2 text-gray-700">Suggest batch actions</li>
          <li className="mb-2 text-gray-700">Automate repetitive tasks</li>
          <li className="mb-2 text-gray-700">Detect upload errors</li>
          <li className="mb-2 text-gray-700">Optimize export workflows</li>
        </ul>
        <div className="text-xs text-gray-500">AI can help you process large data sets, automate exports, and reduce manual work.</div>
      </aside>
      {/* Main Content */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Bulk Actions</h1>
        <div className="mb-6">
          <input
            type="file"
            accept=".csv,.json"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="mb-2"
          />
          {file && (
            <div className="mb-2 text-sm text-gray-700">Selected: {file.name}</div>
          )}
          {dataPreview.length > 0 && (
            <div className="mb-2">
              <div className="font-semibold">Preview (first 5 rows):</div>
              <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto max-h-40">{JSON.stringify(dataPreview, null, 2)}</pre>
            </div>
          )}
          {detectedModule && (
            <div className="mb-2">Detected Module: <span className="font-bold text-blue-700">{detectedModule}</span></div>
          )}
          {dataPreview.length > 0 && (
            <div className="flex gap-2 mb-2">
              <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={handleAutoFormat} disabled={autoFormat}>Auto Reformat</button>
              <button className="bg-blue-700 text-white px-3 py-1 rounded" onClick={handleUpload}>Upload</button>
            </div>
          )}
          {uploadStatus && <div className="text-green-700 font-semibold mt-2">{uploadStatus}</div>}
        </div>
        <ul className="list-disc ml-6 mb-4">
          <li>Bulk upload employees</li>
          <li>Bulk export contracts</li>
          <li>Batch process reports</li>
          <li>Universal upload for all modules</li>
        </ul>
        <div className="bg-white rounded-xl shadow p-6 mb-4">
          <div className="font-semibold mb-2">Bulk Upload/Export/Batch Processing</div>
          <div className="h-32 bg-blue-50 rounded flex items-center justify-center text-gray-400">Drag & drop upload, export, and batch processing UI</div>
        </div>
        <div className="text-sm text-gray-600">Smart automation, error detection, and workflow optimization coming soon.</div>
      </div>
    </div>
  );
}
