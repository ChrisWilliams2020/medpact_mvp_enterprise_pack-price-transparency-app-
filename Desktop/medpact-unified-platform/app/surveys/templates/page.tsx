"use client";
import React, { useState } from "react";

type SurveyTemplate = {
    title: string;
    department: string;
    questions: { q: string }[];
};

const defaultTemplates: SurveyTemplate[] = [
    { title: "Employee Satisfaction", department: "HR", questions: [{ q: "How satisfied are you?" }] },
    { title: "Onboarding Feedback", department: "General", questions: [{ q: "Was onboarding helpful?" }] },
];

export default function SurveyTemplatesPage() {
    const [templates, setTemplates] = useState(defaultTemplates);
    const [name, setName] = useState("");
    const [department, setDepartment] = useState("General");
    const [questions, setQuestions] = useState([""]);
    const [selectedTemplateIdx, setSelectedTemplateIdx] = useState<number | null>(null);
    const [recipients, setRecipients] = useState([""]);
    const [sendStatus, setSendStatus] = useState<string>("");
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
    const [aiLoading, setAiLoading] = useState(false);

    // AI Assistant: fetch suggestions
    const fetchAiSuggestions = async () => {
        setAiLoading(true);
        setTimeout(() => {
            setAiSuggestions([
                "How likely are you to recommend our practice?",
                "What improvements would you like to see?",
                "How satisfied are you with your care?",
                "Was communication clear and helpful?",
                "Did you feel respected and valued?",
            ]);
            setAiLoading(false);
        }, 1200);
    };
    const handleAddAiSuggestion = (suggestion: string) => {
        setQuestions([...questions, suggestion]);
    };

    const handleAddQuestion = () => {
        setQuestions([...questions, ""]);
    };

    const handleQuestionChange = (idx: number, value: string) => {
        const updated = [...questions];
        updated[idx] = value;
        setQuestions(updated);
    };

    const handleAddTemplate = () => {
        if (!name.trim() || questions.some(q => !q.trim())) return;
        setTemplates([
            ...templates,
            {
                title: name,
                department,
                questions: questions.map(q => ({ q })),
            },
        ]);
        setName("");
        setDepartment("General");
        setQuestions([""]);
    };

    const handleRecipientChange = (idx: number, value: string) => {
        const updated = [...recipients];
        updated[idx] = value;
        setRecipients(updated);
    };

    const handleAddRecipient = () => {
        setRecipients([...recipients, ""]);
    };

    const handleRemoveRecipient = (idx: number) => {
        setRecipients(recipients.filter((_, i) => i !== idx));
    };

    const handleAddAllEmployees = async () => {
        try {
            const res = await fetch("/api/employees");
            const data = await res.json();
            if (data.employees && Array.isArray(data.employees)) {
                setRecipients(data.employees.map((e: any) => e.email).filter(Boolean));
            }
        } catch (err) {
            setSendStatus("Failed to load employees");
        }
    };

    const handleSendSurvey = async () => {
        if (selectedTemplateIdx === null || recipients.some(r => !r.trim())) return;
        setSendStatus("Sending...");
        const template = templates[selectedTemplateIdx];
        const payload = {
            title: template.title,
            description: `Department: ${template.department}`,
            questions: template.questions.map(q => q.q),
            employeeEmails: recipients.filter(r => r.trim()),
            employeePhones: [],
        };
        try {
            const res = await fetch("/api/surveys/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (data.success) {
                setSendStatus("Survey sent to: " + payload.employeeEmails.join(", "));
            } else {
                setSendStatus("Failed to send: " + (data.error || "Unknown error"));
            }
        } catch (err: any) {
            setSendStatus("Failed to send: " + err.message);
        }
        setRecipients([""]);
    };

    return (
        <div className="flex">
            {/* AI Assistant Sidebar */}
            <aside className="w-72 min-h-screen bg-gray-50 border-r p-6 flex flex-col">
                <h2 className="text-lg font-bold mb-4 text-purple-700">AI Survey Assistant</h2>
                <button
                    className="mb-4 px-3 py-1 bg-purple-600 text-white rounded"
                    onClick={fetchAiSuggestions}
                    disabled={aiLoading}
                >
                    {aiLoading ? "Loading..." : "Get Smart Suggestions"}
                </button>
                <ul className="mb-4">
                    {aiSuggestions.map((s, idx) => (
                        <li key={idx} className="mb-2">
                            <span className="text-gray-700">{s}</span>
                            <button
                                className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-xs"
                                onClick={() => handleAddAiSuggestion(s)}
                                type="button"
                            >
                                Add
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="text-xs text-gray-500">AI can auto-generate questions, optimize survey flow, and guide best practices.</div>
            </aside>
            {/* Main Content */}
            <div className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-4">Survey Templates</h1>
                <ul>
                    {templates.map((t, idx) => (
                        <li key={idx} className="mb-2">
                            <strong>{t.title}</strong> ({t.department || "General"}): {t.questions.map(q => q.q).join(", ")}
                            <button
                                className={`ml-4 px-2 py-1 rounded text-xs ${selectedTemplateIdx === idx ? "bg-purple-700 text-white" : "bg-gray-200"}`}
                                onClick={() => setSelectedTemplateIdx(idx)}
                                type="button"
                            >
                                {selectedTemplateIdx === idx ? "Selected" : "Select"}
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-2">Create New Template</h2>
                    <input
                        placeholder="Template Name"
                        className="border px-2 py-1 rounded mb-2 block"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <select
                        className="border px-2 py-1 rounded mb-2 block"
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                    >
                        <option>General</option>
                        <option>Care Management</option>
                        <option>HR</option>
                    </select>
                    <div className="mb-2">
                        {questions.map((q, idx) => (
                            <div key={idx} className="flex items-center mb-1">
                                <input
                                    className="border px-2 py-1 rounded flex-1"
                                    placeholder={`Question ${idx + 1}`}
                                    value={q}
                                    onChange={e => handleQuestionChange(idx, e.target.value)}
                                />
                                {questions.length > 1 && (
                                    <button
                                        className="ml-2 text-red-500"
                                        onClick={() => setQuestions(questions.filter((_, i) => i !== idx))}
                                        type="button"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            className="text-blue-600 underline text-sm mt-1"
                            onClick={handleAddQuestion}
                            type="button"
                        >
                            + Add Question
                        </button>
                    </div>
                    <button
                        className="px-3 py-1 bg-purple-600 text-white rounded"
                        onClick={handleAddTemplate}
                        type="button"
                    >
                        Add Template
                    </button>
                    <div className="mt-2 text-sm text-gray-600">Brand your survey templates for each department.</div>
                </div>

                {/* Send Survey Section */}
                <div className="mt-12 border-t pt-8">
                    <button
                        className="mb-4 px-3 py-1 bg-blue-500 text-white rounded"
                        onClick={handleAddAllEmployees}
                        type="button"
                    >
                        Add All Employees as Recipients
                    </button>
                    <h2 className="text-xl font-bold mb-2">Send Survey</h2>
                    <div className="mb-2">
                        <label className="block mb-1 font-semibold">Recipients (emails):</label>
                        {recipients.map((r, idx) => (
                            <div key={idx} className="flex items-center mb-1">
                                <input
                                    className="border px-2 py-1 rounded flex-1"
                                    placeholder="Enter email address"
                                    value={r}
                                    onChange={e => handleRecipientChange(idx, e.target.value)}
                                />
                                {recipients.length > 1 && (
                                    <button
                                        className="ml-2 text-red-500"
                                        onClick={() => handleRemoveRecipient(idx)}
                                        type="button"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            className="text-blue-600 underline text-sm mt-1"
                            onClick={handleAddRecipient}
                            type="button"
                        >
                            + Add Recipient
                        </button>
                    </div>
                    <button
                        className="px-3 py-1 bg-green-600 text-white rounded mt-2"
                        onClick={handleSendSurvey}
                        type="button"
                        disabled={selectedTemplateIdx === null || recipients.some(r => !r.trim())}
                    >
                        Send Survey
                    </button>
                    {sendStatus && <div className="mt-2 text-green-700">{sendStatus}</div>}
                    <div className="mt-2 text-sm text-gray-600">Select a template and enter recipient emails to send a test survey.</div>
                </div>
            </div>
        </div>
    );
}
