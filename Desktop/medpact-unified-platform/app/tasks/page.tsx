"use client";
import React, { useState } from "react";

const sampleTasks = [
  { task: "Verify insurance", assigned: "Front Desk", due: "2026-02-10", status: "Open" },
  { task: "Send follow-up survey", assigned: "Nurse A", due: "2026-02-12", status: "Completed" },
];

export default function TaskAutomation() {
  const [search, setSearch] = useState("");
  const filtered = sampleTasks.filter(t => t.task.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Task & Workflow Automation</h1>
      <input placeholder="Search Task" value={search} onChange={e => setSearch(e.target.value)} className="mb-4 border px-2 py-1 rounded" />
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Task</th>
            <th className="border px-4 py-2">Assigned</th>
            <th className="border px-4 py-2">Due</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((t, idx) => (
            <tr key={idx}>
              <td className="border px-4 py-2">{t.task}</td>
              <td className="border px-4 py-2">{t.assigned}</td>
              <td className="border px-4 py-2">{t.due}</td>
              <td className="border px-4 py-2">{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        (UI placeholder for task assignment, recurring tasks, and workflow templates)
        <div className="mt-2">Progress tracking and notifications enabled.</div>
      </div>
    </div>
  );
}
