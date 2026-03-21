"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

export default function SurveyAnalytics() {
  const [results, setResults] = useState<any[]>([]);
  const [dateFilter, setDateFilter] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    async function fetchResults() {
      const params = new URLSearchParams();
      if (dateFilter) params.append("date", dateFilter);
      if (department) params.append("department", department);
      const res = await fetch(`/api/surveys/results?${params.toString()}`);
      const data = await res.json();
      setResults(data.results || []);
    }
    fetchResults();
  }, [dateFilter, department]);

  // Example: Completion rate
  const completed = results.filter(r => r.submitted).length;
  const total = results.length;
  const completionRate = total ? Math.round((completed / total) * 100) : 0;

  // Example: Bar chart for responses
  const barData = {
    labels: results.map(r => r.employeeEmail),
    datasets: [{
      label: "Completed",
      data: results.map(r => r.submitted ? 1 : 0),
      backgroundColor: "#4ade80",
    }],
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Survey Analytics</h2>
      <div className="mb-4">Completion Rate: {completionRate}%</div>
      <div className="mb-4">
        <label>Date Filter:</label>
        <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="ml-2 border px-2 py-1 rounded" />
        <label className="ml-4">Department:</label>
        <input value={department} onChange={e => setDepartment(e.target.value)} className="ml-2 border px-2 py-1 rounded" />
      </div>
      <Bar data={barData} />
    </div>
  );
}
