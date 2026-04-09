import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export interface BriefingRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  practice_type?: string;
  role?: string;
  message?: string;
  source: string;
  status: "new" | "contacted" | "scheduled" | "completed" | "archived";
  submitted_at: string;
  updated_at?: string;
  notes?: string;
  assigned_to?: string;
}

// In-memory fallback for when Supabase is not configured
let localBriefings: BriefingRequest[] = [];

// GET - Get all briefing requests
export async function GET() {
  const supabase = getSupabaseAdmin();
  
  if (!supabase) {
    console.log("[Briefings] Supabase not configured, using in-memory storage");
    const sorted = [...localBriefings].sort(
      (a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
    );
    return NextResponse.json({ 
      briefings: sorted,
      count: sorted.length,
      storage: "memory",
    });
  }

  try {
    const { data, error } = await supabase
      .from("briefing_requests")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) {
      console.error("[Briefings] Supabase error:", error);
      throw error;
    }

    return NextResponse.json({ 
      briefings: data || [],
      count: data?.length || 0,
      storage: "supabase",
    });
  } catch (err) {
    console.error("[Briefings] Error fetching briefings:", err);
    return NextResponse.json({ 
      briefings: localBriefings,
      count: localBriefings.length,
      storage: "memory",
      error: "Database temporarily unavailable",
    });
  }
}

// POST - Add a new briefing request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getSupabaseAdmin();
    
    const newBriefing = {
      id: "br-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9),
      name: body.name || "Unknown",
      email: body.email || "",
      phone: body.phone || "",
      organization: body.organization || "",
      practice_type: body.practiceType || body.practice_type || "",
      role: body.role || "",
      message: body.message || "",
      source: body.source || "Website Contact Form",
      status: "new" as const,
      submitted_at: new Date().toISOString(),
    };

    if (!supabase) {
      localBriefings.unshift(newBriefing);
      if (localBriefings.length > 100) localBriefings = localBriefings.slice(0, 100);
      return NextResponse.json({ success: true, briefing: newBriefing, storage: "memory" });
    }

    const { data, error } = await supabase
      .from("briefing_requests")
      .insert([newBriefing])
      .select()
      .single();

    if (error) {
      console.error("[Briefings] Supabase insert error:", error);
      localBriefings.unshift(newBriefing);
      return NextResponse.json({ success: true, briefing: newBriefing, storage: "memory" });
    }

    return NextResponse.json({ success: true, briefing: data, storage: "supabase" });
  } catch (err) {
    console.error("[Briefings API] Error:", err);
    return NextResponse.json({ error: "Failed to save briefing request" }, { status: 500 });
  }
}

// PATCH - Update a briefing request
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    const supabase = getSupabaseAdmin();
    
    if (!id) {
      return NextResponse.json({ error: "Briefing ID required" }, { status: 400 });
    }

    const dbUpdates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (updates.assignedTo !== undefined) dbUpdates.assigned_to = updates.assignedTo;

    if (!supabase) {
      const index = localBriefings.findIndex(b => b.id === id);
      if (index === -1) {
        return NextResponse.json({ error: "Briefing not found" }, { status: 404 });
      }
      localBriefings[index] = { ...localBriefings[index], ...dbUpdates } as BriefingRequest;
      return NextResponse.json({ success: true, briefing: localBriefings[index], storage: "memory" });
    }

    const { data, error } = await supabase
      .from("briefing_requests")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[Briefings] Supabase update error:", error);
      return NextResponse.json({ error: "Failed to update briefing" }, { status: 500 });
    }

    return NextResponse.json({ success: true, briefing: data, storage: "supabase" });
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
    const supabase = getSupabaseAdmin();
    
    if (!id) {
      return NextResponse.json({ error: "Briefing ID required" }, { status: 400 });
    }

    if (!supabase) {
      const originalLength = localBriefings.length;
      localBriefings = localBriefings.filter(b => b.id !== id);
      if (localBriefings.length === originalLength) {
        return NextResponse.json({ error: "Briefing not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, storage: "memory" });
    }

    const { error } = await supabase
      .from("briefing_requests")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[Briefings] Supabase delete error:", error);
      return NextResponse.json({ error: "Failed to delete briefing" }, { status: 500 });
    }

    return NextResponse.json({ success: true, storage: "supabase" });
  } catch (err) {
    console.error("[Briefings API] Error:", err);
    return NextResponse.json({ error: "Failed to delete briefing" }, { status: 500 });
  }
}
