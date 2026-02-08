"use client";
import React, { useState } from "react";

const defaultLogo = "/logo.png";
const defaultColor = "#2563eb";

async function sendSurveyToEmployees(survey: any, employees: any[], method: string) {
  const res = await fetch("/api/surveys/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ survey, employees, method }),
  });
  return await res.json();
}

export default function SurveyBuilder() {
  const [step, setStep] = useState(1);
  const [employees, setEmployees] = useState<any[]>([]);
  const [survey, setSurvey] = useState<any>(null);
  const [method, setMethod] = useState("email");
  const [sendResult, setSendResult] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [logo, setLogo] = useState(defaultLogo);
  const [color, setColor] = useState(defaultColor);
  const [schedule, setSchedule] = useState("");
  const [conditional, setConditional] = useState<any>({});
  const [anonymous, setAnonymous] = useState(false);

  function addQuestion() {
    setQuestions((qs) => [...qs, { q: "", type: "text" }]);
  }

  function handleQuestionChange(idx: number, value: string) {
    const updated = [...questions];
    updated[idx].q = value;
    setQuestions(updated);
  }

  function handleTypeChange(idx: number, value: string) {
    const updated = [...questions];
    updated[idx].type = value;
    setQuestions(updated);
  }

  function handleConditionalChange(idx: number, value: string) {
    setConditional((cond) => ({ ...cond, [idx]: value }));
  }

  async function handleSend() {
    if (!survey || employees.length === 0) return;
    const result = await sendSurveyToEmployees(survey, employees, method);
    if (result.success) {
      setSendResult("Survey sent successfully!");
    } else {
      setSendResult("Failed to send survey.");
    }
  }

  return (
    <div className="p-8" style={{ background: color }}>
      <img src={logo} alt="Practice Logo" className="mb-4 w-32 h-32" />
      <h1 className="text-2xl font-bold mb-4">Survey Builder</h1>
      <input
        placeholder="Survey Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-2 border px-2 py-1 rounded"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-2 border px-2 py-1 rounded w-full"
      />
      <div className="mb-2">
        <label>Logo URL:</label>
        <input
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
          className="ml-2 border px-2 py-1 rounded"
        />
        <label className="ml-4">Theme Color:</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="ml-2"
        />
      </div>
      <div className="mb-2">
        <label>Schedule Survey:</label>
        <input
          type="datetime-local"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          className="ml-2 border px-2 py-1 rounded"
        />
      </div>
      <div className="mb-2">
        <label>
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
          />
          Allow anonymous responses
        </label>
      </div>
      <div className="mb-4">
        <button
          onClick={addQuestion}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Add Question
        </button>
      </div>
      {questions.map((q, idx) => (
        <div key={idx} className="mb-2">
          <input
            placeholder="Question"
            value={q.q}
            onChange={(e) => handleQuestionChange(idx, e.target.value)}
            className="border px-2 py-1 rounded mr-2"
          />
          <select
            value={q.type}
            onChange={(e) => handleTypeChange(idx, e.target.value)}
            className="border px-2 py-1 rounded mr-2"
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="choice">Choice</option>
          </select>
          <input
            placeholder="Show if answer is..."
            value={conditional[idx] || ""}
            onChange={(e) => handleConditionalChange(idx, e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
      ))}
      <div style={{ marginTop: "2rem" }}>
        <label>Delivery Method:</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="ml-2 border px-2 py-1 rounded"
        >
          <option value="email">Email</option>
          <option value="text">Text</option>
          <option value="manual">Manual</option>
        </select>
        <button
          style={{ marginLeft: "1rem" }}
          onClick={handleSend}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Send Survey
        </button>
        {sendResult && (
          <div style={{ color: "green", marginTop: "1rem" }}>{sendResult}</div>
        )}
      </div>
      <p style={{ marginTop: "2rem" }}>
        This is a placeholder for the full survey workflow. Next steps: connect to
        backend, enable delivery, and AI agent integration.
      </p>
    </div>
  );
}
