import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export interface BriefingRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  practiceType?: string;
  role?: string;
  message?: string;
  source: string;
  status: "new" | "contacted" | "scheduled" | "completed" | "archived";
  submittedAt: string;
  updatedAt?: string;
  notes?: string;
  assignedTo?: string;
}

const BRIEFINGS_KEY = "medpact:briefings";

// Check if Vercel KV is configured
function isKvConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

// In-memory fallback for local development
let localBriefings: BriefingRequest[] = [];

async function getBriefings(): Promise<BriefingRequest[]> {
  if (!isKvConfigured()) {
    console.log("[Briefings] KV not configured, using in-memory storage");
    return localBriefings;
  }
  
  try {
    const briefings = await kv.get<BriefingRequest[]>(BRIEFINGS_KEY);
    return briefings || [];
  } catch (err) {
    console.error("[Briefings] KV read error:", err);
    return localBriefings;
  }
}

async function saveBriefings(briefings: BriefingRequest[]): Promise<void> {
  if (!isKvConfigured()) {
    localBriefings = briefings;
    return;
  }
  
  try {
    await kv.set(BRIEFINGS_KEY, briefings);
  } catch (err) {
    console.error("[Briefings] KV write error:", err);
    localBriefings = briefings;
  }
}

// GET - Get all briefing requests
export async function GET() {
  const briefings = await getBriefings();
  
  // Sort by date, newest first
  const sorted = [...briefings].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
  
  return NextResponse.json({ 
    briefings: sorted,
    count: sorted.length,
    kvConfigured: isKvConfigured(),
  });
}

// POST - Add a new briefing request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const briefings = await getBriefings();
    
    const newBriefing: BriefingRequest = {
      id: "br-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9),
      name: body.name || "Unknown",
      email: body.email || "",
      phone: body.phone || "",
      organization: body.organization || "",
      practiceType: body.practiceType || "",
      role: body.role || "",
      message: body.message || "",
      source: body.source || "Website Contact Form",
      status: "new",
      submittedAt: new Date().toISOString(),
    };
    
    // Add to beginning of array (newest first)
    briefings.unshift(newBriefing);
    
    // Keep only last 500 briefings
    const trimmed = briefings.slice(0, 500);
    await saveBriefings(trimmed);
    
    return NextResponse.json({ success: true, briefing: newBriefing });
  } catch (err) {
    console.error("[Briefings API] Error:", err);
    return NextResponse.json({ error: "Failed to save briefing request" }, { status: 500 });
  }
}

// PATCH - Update a briefing request (status, notes, etc.)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json({ error: "Briefing ID required" }, { status: 400 });
    }
    
    const briefings = await getBriefings();
    const index = briefings.findIndex(b => b.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: "Briefing not found" }, { status: 404 });
    }
    
    briefings[index] = {
      ...briefings[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    await saveBriefings(briefings);
    
    return NextResponse.json({ success: true, briefing: briefings[index] });
  } catch (err) {
    console.error("[Briefings API] Error:", err);
    return NextResponse.json({ error: "Failed to update briefing" }, { status: 500 });
  }
}

// DELETE - Delete a briefing request
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Briefing ID required" }, { status: 400 });
    }
    
    const briefings = await getBriefings();
    const filtered = briefings.filter(b => b.id !== id);
    
    if (filtered.length === briefings.length) {
      return NextResponse.json({ error: "Briefing not found" }, { status: 404 });
    }
    
    await saveBriefings(filtered);
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Briefings API] Error:", err);
    return NextResponse.json({ error: "Failed to delete briefing" }, { status: 500 });
  }
}
