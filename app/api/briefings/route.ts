import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "public", "data", "briefing-requests.json");

export interface BriefingRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  practiceType?: string;
  message?: string;
  source: string;
  status: "new" | "contacted" | "scheduled" | "completed" | "archived";
  submittedAt: string;
  updatedAt?: string;
  notes?: string;
  assignedTo?: string;
}

async function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function getBriefings(): Promise<BriefingRequest[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveBriefings(briefings: BriefingRequest[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(briefings, null, 2));
}

// GET - Get all briefing requests
export async function GET() {
  const briefings = await getBriefings();
  // Sort by date, newest first
  briefings.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  return NextResponse.json({ briefings });
}

// POST - Add a new briefing request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const briefings = await getBriefings();
    
    const newBriefing: BriefingRequest = {
      id: `br-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: body.name,
      email: body.email,
      phone: body.phone || "",
      organization: body.organization || "",
      practiceType: body.practiceType || "",
      message: body.message || "",
      source: body.source || "Website Contact Form",
      status: "new",
      submittedAt: new Date().toISOString(),
    };
    
    briefings.unshift(newBriefing);
    await saveBriefings(briefings);
    
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
