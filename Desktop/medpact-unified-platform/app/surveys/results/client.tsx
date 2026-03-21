"use client";
import React, { useEffect, useState } from "react";

export default function SurveyResultsDashboard() {
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    async function fetchResults() {
      const res = await fetch("/api/surveys/results");
      const data = await res.json();
      setResults(data.results || []);
    }
    fetchResults();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Survey Results Dashboard</h1>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Survey Title</th>
            <th className="border px-4 py-2">Employee</th>
            <th className="border px-4 py-2">Answers</th>
            <th className="border px-4 py-2">Submitted</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, idx) => (
            <tr key={idx}>
              <td className="border px-4 py-2">{r.surveyTitle}</td>
              <td className="border px-4 py-2">{r.employeeEmail}</td>
              <td className="border px-4 py-2">{JSON.stringify(r.answers)}</td>
              <td className="border px-4 py-2">{r.submitted ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
