"use client";
import React, { useState, useEffect } from "react";

export default function ContractDocuments() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [role, setRole] = useState("admin"); // Simulate role

  useEffect(() => {
    async function fetchDocs() {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter) params.append("status", statusFilter);
      const res = await fetch(`/contracts/documents/api/list/route?${params.toString()}`);
      const data = await res.json();
      setDocuments(data.documents || []);
    }
    fetchDocs();
  }, [search, statusFilter]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;
    if (!["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
      alert("Only PDF and DOCX files allowed.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);
    formData.append("uploadedBy", "admin");
    const res = await fetch("/contracts/documents/api/upload/route", { method: "POST", body: formData });
    const data = await res.json();
    if (data.success) setDocuments(docs => [...docs, data.document]);
    else alert(data.error);
  }

  function handleSelect(id: string) {
    setSelected(sel => sel.includes(id) ? sel.filter(s => s !== id) : [...sel, id]);
  }

  function handleBulkDownload() {
    selected.forEach(id => {
      const doc = documents.find(d => d.id === id);
      if (doc) window.open(doc.url);
    });
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Contract Document Management</h1>
      <div className="mb-4">
        <input placeholder="Search by name" value={search} onChange={e => setSearch(e.target.value)} className="border px-2 py-1 rounded mr-2" />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border px-2 py-1 rounded">
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Expired">Expired</option>
        </select>
      </div>
      {role === "admin" && (
        <div className="mb-4">
          <input type="file" onChange={handleUpload} />
        </div>
      )}
      <ul className="mt-4">
        {documents.map((doc, idx) => (
          <li key={doc.id} className="mb-2 flex items-center">
            <input type="checkbox" checked={selected.includes(doc.id)} onChange={() => handleSelect(doc.id)} className="mr-2" />
            <span className="font-semibold mr-2">{doc.name}</span>
            <span className="mr-2">Status: {doc.status}</span>
            <button className="ml-2 px-2 py-1 bg-green-500 text-white rounded" onClick={() => window.open(doc.url)}>
              View/Download
            </button>
            <span className="ml-4 text-xs">Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
            {doc.activity && <span className="ml-2 text-xs">Activity: {JSON.stringify(doc.activity)}</span>}
          </li>
        ))}
      </ul>
      {selected.length > 0 && (
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={handleBulkDownload}>
          Download Selected
        </button>
      )}
      {/* Reminder logic can be triggered via /api/reminders/route */}
    </div>
  );
}
