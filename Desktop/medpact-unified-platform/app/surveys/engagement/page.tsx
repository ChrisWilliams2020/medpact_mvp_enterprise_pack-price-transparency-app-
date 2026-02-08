"use client";
import React, { useState } from "react";

const sampleEngagement = [
  { role: "Nurse", location: "East", responses: 18, engagement: 90, department: "Clinical" },
  { role: "Physician", location: "West", responses: 12, engagement: 75, department: "Medical" },
];

export default function SurveyEngagementAnalytics() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const filtered = sampleEngagement.filter(e =>
    (e.role.toLowerCase().includes(search.toLowerCase()) || e.location.toLowerCase().includes(search.toLowerCase())) &&
    (department ? e.department === department : true)
  );

  function exportCSV() {
    const rows = ["role,location,responses,engagement,department", ...filtered.map(e => `${e.role},${e.location},${e.responses},${e.engagement},${e.department}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "engagement.csv";
    a.click();
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Survey Response & Engagement Analytics</h1>
      <input placeholder="Search Role/Location" value={search} onChange={e => setSearch(e.target.value)} className="mb-4 border px-2 py-1 rounded mr-2" />
      <select value={department} onChange={e => setDepartment(e.target.value)} className="mb-4 border px-2 py-1 rounded">
        <option value="">All Departments</option>
        <option value="Clinical">Clinical</option>
        <option value="Medical">Medical</option>
      </select>
      <button onClick={exportCSV} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">Export CSV</button>
      <table className="min-w-full border mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Location</th>
            <th className="border px-4 py-2">Responses</th>
            <th className="border px-4 py-2">Engagement</th>
            <th className="border px-4 py-2">Department</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((e, idx) => (
            <tr key={idx} style={{ background: `rgba(16, 185, 129, ${e.engagement / 100})` }}>
              <td className="border px-4 py-2">{e.role}</td>
              <td className="border px-4 py-2">{e.location}</td>
              <td className="border px-4 py-2">{e.responses}</td>
              <td className="border px-4 py-2">{e.engagement}%</td>
              <td className="border px-4 py-2">{e.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <strong>Heatmap:</strong> Row color intensity reflects engagement.
      </div>
    </div>
  );
}
