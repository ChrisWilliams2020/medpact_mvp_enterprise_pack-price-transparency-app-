"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Container, Pill, Button } from "@/components/ui";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: Date;
  title: string;
}

const STORAGE_KEY = "kcn-chat-sessions";
const CURRENT_SESSION_KEY = "kcn-current-session";

function getStoredSessions(): ChatSession[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const sessions = JSON.parse(stored);
    return sessions.map((s: any) => ({
      ...s,
      createdAt: new Date(s.createdAt),
      messages: s.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })),
    }));
  } catch {
    return [];
  }
}

function saveSessions(sessions: ChatSession[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

function generateTitle(messages: Message[]): string {
  const firstUserMessage = messages.find(m => m.role === "user");
  if (firstUserMessage) {
    return firstUserMessage.content.slice(0, 40) + (firstUserMessage.content.length > 40 ? "..." : "");
  }
  return "New Conversation";
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: `**Welcome to KCN Chat!** 👋

I'm the MedPACT Knowledge Center Network AI assistant. I can help you with:

• **Price Transparency** — Understanding CMS mandates and payer pricing data
• **Payer Analytics** — Reimbursement patterns, denials, contract performance  
• **Ophthalmology Insights** — Cataract economics, IOL pricing, ASC vs HOPD
• **Contract Intelligence** — Benchmarking and negotiation strategies
• **MedPACT Platform** — How we transform data into actionable leverage

What would you like to explore?`,
  timestamp: new Date(),
};

export default function KCNChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = getStoredSessions();
    setSessions(stored);
    const currentId = localStorage.getItem(CURRENT_SESSION_KEY);
    if (currentId) {
      const session = stored.find(s => s.id === currentId);
      if (session) {
        setCurrentSessionId(currentId);
        setMessages(session.messages);
      }
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length <= 1) return;
    const sessionId = currentSessionId || `session-${Date.now()}`;
    if (!currentSessionId) {
      setCurrentSessionId(sessionId);
      localStorage.setItem(CURRENT_SESSION_KEY, sessionId);
    }
    const updatedSession: ChatSession = {
      id: sessionId,
      messages,
      createdAt: new Date(),
      title: generateTitle(messages),
    };
    setSessions(prev => {
      const existing = prev.findIndex(s => s.id === sessionId);
      let updated: ChatSession[];
      if (existing >= 0) {
        updated = [...prev];
        updated[existing] = updatedSession;
      } else {
        updated = [updatedSession, ...prev];
      }
      saveSessions(updated);
      return updated;
    });
  }, [messages, currentSessionId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);
    try {
      const response = await fetch("/api/kcn/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          history: updatedMessages.slice(-10).map(m => ({ role: m.role, content: m.content })),
          sessionId: currentSessionId,
        }),
      });
      const data = await response.json();
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.response || "I apologize, I couldn't process that request.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "I'm having trouble connecting. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }

  function startNewChat() {
    setMessages([WELCOME_MESSAGE]);
    setCurrentSessionId(null);
    localStorage.removeItem(CURRENT_SESSION_KEY);
    setShowHistory(false);
  }

  function loadSession(session: ChatSession) {
    setMessages(session.messages);
    setCurrentSessionId(session.id);
    localStorage.setItem(CURRENT_SESSION_KEY, session.id);
    setShowHistory(false);
  }

  function deleteSession(sessionId: string) {
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== sessionId);
      saveSessions(updated);
      return updated;
    });
    if (currentSessionId === sessionId) startNewChat();
  }

  function formatContent(content: string) {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <strong key={i} className="block text-base mb-1">{line.slice(2, -2)}</strong>;
      }
      if (line.includes('**')) {
        const parts = line.split(/\*\*([^*]+)\*\*/g);
        return <span key={i} className="block">{parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}</span>;
      }
      if (line.startsWith('• ') || line.startsWith('- ')) return <span key={i} className="block ml-3">{line}</span>;
      if (line.trim() === '') return <br key={i} />;
      return <span key={i} className="block">{line}</span>;
    });
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Container className="py-8 md:py-12">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <Pill>Knowledge Center Network</Pill>
            <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">KCN Chat</h1>
            <p className="mt-1 text-sm text-black/60">AI-powered intelligence for price transparency and payer analytics</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowHistory(!showHistory)}>{showHistory ? "Hide History" : "History"}</Button>
            <Button variant="secondary" onClick={startNewChat}>New Chat</Button>
            <Link href="/"><Button variant="ghost">← Home</Button></Link>
          </div>
        </div>
        <div className="mx-auto max-w-4xl flex gap-4">
          {showHistory && (
            <div className="w-64 flex-shrink-0">
              <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                <h3 className="font-semibold text-sm mb-3">Chat History</h3>
                {sessions.length === 0 ? <p className="text-xs text-black/50">No previous chats</p> : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {sessions.slice(0, 20).map(session => (
                      <div key={session.id} onClick={() => loadSession(session)}
                        className={`p-2 rounded-lg cursor-pointer text-xs group ${currentSessionId === session.id ? "bg-black text-white" : "bg-gray-50 hover:bg-gray-100"}`}>
                        <div className="font-medium truncate">{session.title}</div>
                        <div className="flex justify-between items-center mt-1">
                          <span className={currentSessionId === session.id ? "text-white/60" : "text-black/40"}>{session.messages.length} msgs</span>
                          <button onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                            className={`opacity-0 group-hover:opacity-100 ${currentSessionId === session.id ? "text-white/60" : "text-red-400"}`}>×</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="flex-1">
            <div className="rounded-3xl border border-black/10 bg-white shadow-lg overflow-hidden">
              <div className="h-[500px] overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === "user" ? "bg-black text-white" : "bg-gray-100 text-black"}`}>
                      <div className="text-sm whitespace-pre-wrap">{formatContent(msg.content)}</div>
                      <div className={`text-xs mt-2 ${msg.role === "user" ? "text-white/50" : "text-black/40"}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex space-x-1.5">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="border-t border-black/10 p-4 bg-gray-50/50">
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <input type="text" value={input} onChange={(e) => setInput(e.target.value)} disabled={isTyping}
                    placeholder="Ask about price transparency, payer behavior, contracts..."
                    className="flex-1 rounded-xl border border-black/15 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 bg-white" />
                  <Button type="submit" disabled={!input.trim() || isTyping}>{isTyping ? "..." : "Send"}</Button>
                </form>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {["What is MedPACT?", "Price transparency", "Cataract reimbursement", "Contract tips", "Schedule demo"].map((q) => (
                <button key={q} onClick={() => setInput(q)} disabled={isTyping}
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-medium hover:bg-gray-50 transition-colors disabled:opacity-50">{q}</button>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
