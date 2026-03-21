"use client";
import { useState } from "react";
import * as XLSX from "xlsx";

async function saveEmployeesToBackend(employees: any[]) {
  const res = await fetch("/api/employees/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ employees }),
  });
  return await res.json();
}

export default function Stakeholders() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      setEmployees(json as any[]);
      setUploadError(null);
      setUploadSuccess(null);
    };
    reader.onerror = () => setUploadError("Failed to read file");
    reader.readAsArrayBuffer(file);
  }

  async function handleSave() {
    if (employees.length === 0) return;
    const result = await saveEmployeesToBackend(employees);
    if (result.success) {
      setUploadSuccess("Employees saved to backend!");
    } else {
      setUploadError("Failed to save employees.");
    }
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Stakeholder Management</h1>
      <p>
        This is a placeholder for managing employees, patients, and vendors.
        Connect to your database for live data.
      </p>
      <p>Upload an Excel file with your employees to add them as stakeholders.</p>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        style={{ margin: "1rem 0" }}
      />
      {uploadError && <div style={{ color: "red" }}>{uploadError}</div>}
      {uploadSuccess && <div style={{ color: "green" }}>{uploadSuccess}</div>}
      {employees.length > 0 && (
        <div>
          <h2>Preview:</h2>
          <table border={1} cellPadding={6} style={{ marginTop: 12 }}>
            <thead>
              <tr>
                {Object.keys(employees[0]).map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, j) => (
                    <td key={j}>{val as string}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button style={{ marginTop: "1rem" }} onClick={handleSave}>
            Save Employees to Backend
          </button>
        </div>
      )}
    </main>
  );
}
