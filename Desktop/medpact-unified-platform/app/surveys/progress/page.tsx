"use client";
import React, { useEffect, useState } from "react";

export default function EmployeeProgress() {
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
      <h1 className="text-2xl font-bold mb-4">Employee Survey Progress</h1>
      <ul>
        {results.map((r, idx) => (
          <li key={idx}>
            {r.employeeEmail}: {r.submitted ? "Completed" : "Not Started"}
          </li>
        ))}
      </ul>
    </div>
  );
}
