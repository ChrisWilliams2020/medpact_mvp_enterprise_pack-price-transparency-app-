"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';


export default function ReportingPage() {
  const [reports, setReports] = useState<{ id: string; title: string; content?: string }[]>([]);
  const [reportTitle, setReportTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/reports")
      .then(res => res.json())
      .then(data => {
        setReports(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load reports");
        setLoading(false);
      });
  }, []);

  async function addReport(e: React.FormEvent) {
    e.preventDefault();
    if (!reportTitle.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: reportTitle.trim(), content: "" })
      });
      const newReport = await res.json();
      if (res.ok) {
        setReports([newReport, ...reports]);
        setReportTitle("");
        toast.success("Report added successfully");
      } else {
        setError(newReport.error || "Failed to add report");
        toast.error(newReport.error || "Failed to add report");
      }
    } catch {
      setError("Failed to add report");
      toast.error("Failed to add report");
    }
    setLoading(false);
  }

  async function deleteReport(id: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reports", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setReports(reports.filter(r => r.id !== id));
        toast.success("Report deleted successfully");
      } else {
        setError(result.error || "Failed to delete report");
        toast.error(result.error || "Failed to delete report");
      }
    } catch {
      setError("Failed to delete report");
      toast.error("Failed to delete report");
    }
    setLoading(false);
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-4">Reporting</h1>
      <p className="mb-6 text-gray-700 dark:text-gray-300">Manage and generate reports below.</p>
      <form onSubmit={addReport} className="flex flex-col md:flex-row gap-2 mb-6" aria-label="Add report">
        <label htmlFor="reportTitle" className="sr-only">Report Title</label>
        <input
          id="reportTitle"
          className="border p-2 rounded w-full md:w-2/3 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={reportTitle}
          onChange={e => setReportTitle(e.target.value)}
          placeholder="Report Title"
          required
          aria-required="true"
        />
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded font-bold transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Adding..." : "Add Report"}
        </button>
      </form>
  {error && <div className="text-red-600 mb-4" role="alert">{error}</div>}
      <div className="border rounded p-4 bg-blue-50 dark:bg-neutral-900">
        <h2 className="text-xl font-semibold mb-2">Report List</h2>
        {loading ? (
          <span className="text-gray-500">Loading...</span>
        ) : reports.length === 0 ? (
          <span className="text-gray-500">No reports added yet.</span>
        ) : (
          <ul className="divide-y divide-blue-200 dark:divide-neutral-800">
            {reports.map(r => (
              <li key={r.id} className="flex items-center justify-between py-2">
                <span className="font-bold text-blue-700 dark:text-blue-300">{r.title}</span>
                <button
                  onClick={() => deleteReport(r.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded font-bold hover:bg-red-600"
                >Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
