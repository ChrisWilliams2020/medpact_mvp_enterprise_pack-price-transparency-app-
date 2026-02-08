"use client";
import React, { useState } from "react";

const sampleProviders = [
  { name: "Dr. Alice", credential: "MD", contract: "Active" },
  { name: "Dr. Bob", credential: "DO", contract: "Pending" },
];

export default function ProviderNetwork() {
  const [providers, setProviders] = useState(sampleProviders);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const filtered = providers.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter ? p.credential === filter : true)
  );

  // Network adequacy visualization (simple count)
  const adequacy = filtered.length;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Provider Network Management</h1>
      <input
        placeholder="Search Provider"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 border px-2 py-1 rounded mr-2"
      />
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 border px-2 py-1 rounded"
      >
        <option value="">All Credentials</option>
        <option value="MD">MD</option>
        <option value="DO">DO</option>
      </select>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Provider</th>
            <th className="border px-4 py-2">Credential</th>
            <th className="border px-4 py-2">Contract Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p, idx) => (
            <tr key={idx}>
              <td className="border px-4 py-2">{p.name}</td>
              <td className="border px-4 py-2">{p.credential}</td>
              <td className="border px-4 py-2">{p.contract}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <strong>Network Adequacy:</strong>{" "}
        <span className="text-sm">
          {adequacy} providers match criteria.
        </span>
      </div>
    </div>
  );
}
