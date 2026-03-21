"use client";
import React, { useState } from "react";
import NegotiationNotifications from "./notifications";

const steps = [
  "Initial Contact",
  "Requirements Gathering",
  "Proposal Submission",
  "Negotiation",
  "Agreement Finalization",
];

export default function ContractNegotiation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [documents, setDocuments] = useState<File[]>([]);
  const [meeting, setMeeting] = useState("");
  const [status, setStatus] = useState(Array(steps.length).fill(false));
  const [email, setEmail] = useState("");

  async function handleStepChange(nextStep: number) {
    setCurrentStep(nextStep);
    const updatedStatus = [...status];
    updatedStatus[nextStep] = true;
    setStatus(updatedStatus);
    if (email) {
      await fetch("/contracts/negotiation/api/notify/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, step: steps[nextStep] }),
      });
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  }

  function handleMeetingChange(e: React.ChangeEvent<HTMLInputElement>) {
    setMeeting(e.target.value);
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Contract Negotiation Workflow</h1>
      <div className="mb-4">
        <label className="font-semibold mr-2">Notification Email:</label>
        <input type="email" value={email} onChange={handleEmailChange} className="border px-2 py-1 rounded" />
      </div>
      <ol className="list-decimal ml-6">
        {steps.map((step, idx) => (
          <li key={idx} className={idx === currentStep ? "font-bold text-green-600" : status[idx] ? "text-blue-500" : ""}>
            {step} {status[idx] && <span className="ml-2 text-xs">(Completed)</span>}
          </li>
        ))}
      </ol>
      <div className="mt-6">
        <button
          disabled={currentStep === 0}
          className="mr-2 px-4 py-2 bg-gray-200 rounded"
          onClick={() => handleStepChange(currentStep - 1)}
        >
          Previous
        </button>
        <button
          disabled={currentStep === steps.length - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => handleStepChange(currentStep + 1)}
        >
          Next
        </button>
      </div>
      <NegotiationNotifications currentStep={currentStep} />
      <div className="mt-8">
        <strong>Current Step:</strong> {steps[currentStep]}
      </div>
      {currentStep === 1 && (
        <div className="mt-8">
          <label className="block mb-2 font-semibold">Upload Requirements Documents:</label>
          <input type="file" multiple onChange={handleFileChange} />
          <ul className="mt-2">
            {documents.map((doc, idx) => (
              <li key={idx}>{doc.name}</li>
            ))}
          </ul>
        </div>
      )}
      {currentStep === 3 && (
        <div className="mt-8">
          <label className="block mb-2 font-semibold">Schedule Negotiation Meeting:</label>
          <input type="datetime-local" value={meeting} onChange={handleMeetingChange} className="border px-2 py-1 rounded" />
          {meeting && <div className="mt-2">Meeting scheduled for: {meeting}</div>}
        </div>
      )}
    </div>
  );
}
