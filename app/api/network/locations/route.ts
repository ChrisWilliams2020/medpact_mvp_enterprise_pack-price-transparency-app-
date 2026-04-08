import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { cookies } from "next/headers";

/**
 * GET /api/network/locations
 * Returns all network location pins for the map.
 *
 * POST /api/network/locations
 * Adds or updates a location pin (admin only).
 * Body: { id?, name, role, organization, city, state, lat, lng, type: "team" | "enrolled" }
 *
 * DELETE /api/network/locations?id=xxx
 * Removes a location pin (admin only).
 */

export interface NetworkLocation {
  id: string;
  name: string;
  role: string;
  organization: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  type: "team" | "enrolled";
  addedAt: string;
}

const DATA_PATH = join(process.cwd(), "public", "data", "network-locations.json");

// HMAC verification for admin cookie
async function hmacHex(secret: string, message: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  const bytes = new Uint8Array(sig as ArrayBuffer);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqualHex(a: string, b: string) {
  if (a.length !== b.length) return false;
  let res = 0;
  for (let i = 0; i < a.length; i++) res |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return res === 0;
}

async function verifyAdminAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get("admin")?.value;
    if (!adminCookie) return false;

    const parts = adminCookie.split(':');
    if (parts.length !== 2) return false;
    const [tsStr, sig] = parts;
    const ts = Number(tsStr);
    if (!ts || Number.isNaN(ts)) return false;

    const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASS || 'dev-secret';
    const expected = await hmacHex(secret, String(ts));
    if (!sig || !expected) return false;
    if (!timingSafeEqualHex(sig, expected)) return false;

    // Check expiry: 24 hours
    const age = Date.now() - ts;
    if (age > 24 * 60 * 60 * 1000) return false;

    return true;
  } catch {
    return false;
  }
}

// Input sanitization
function sanitizeInput(input: string | undefined, maxLength: number = 200): string {
  if (!input) return "";
  return input
    .slice(0, maxLength)
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
}

function ensureDataDir() {
  const dir = join(process.cwd(), "public", "data");
  if (!existsSync(dir)) {
    const fs = require("fs");
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readLocations(): NetworkLocation[] {
  try {
    if (!existsSync(DATA_PATH)) {
      return getDefaultLocations();
    }
    const data = readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return getDefaultLocations();
  }
}

function writeLocations(locations: NetworkLocation[]) {
  ensureDataDir();
  writeFileSync(DATA_PATH, JSON.stringify(locations, null, 2));
}

function getDefaultLocations(): NetworkLocation[] {
  return [
    {
      id: "dr-christopher-williams",
      name: "Dr. Christopher Williams",
      role: "Founder & CEO",
      organization: "MedPACT",
      city: "Media",
      state: "PA",
      lat: 39.9168,
      lng: -75.3877,
      type: "team",
      addedAt: new Date().toISOString(),
    },
    {
      id: "dr-greg-smith",
      name: "Dr. Greg Smith",
      role: "Physician",
      organization: "MedPACT Network",
      city: "Wilmington",
      state: "DE",
      lat: 39.7391,
      lng: -75.5398,
      type: "team",
      addedAt: new Date().toISOString(),
    },
    {
      id: "dr-jonathan-myers",
      name: "Dr. Jonathan Myers",
      role: "Physician",
      organization: "MedPACT Network",
      city: "Philadelphia",
      state: "PA",
      lat: 39.9526,
      lng: -75.1652,
      type: "team",
      addedAt: new Date().toISOString(),
    },
    {
      id: "dr-joel-schuman",
      name: "Dr. Joel Schuman",
      role: "Physician",
      organization: "MedPACT Network",
      city: "Philadelphia",
      state: "PA",
      lat: 39.9496,
      lng: -75.1703,
      type: "team",
      addedAt: new Date().toISOString(),
    },
    {
      id: "dr-sagun-pendse",
      name: "Dr. Sagun Pendse",
      role: "Physician",
      organization: "MedPACT Network",
      city: "Philadelphia",
      state: "PA",
      lat: 39.9566,
      lng: -75.1899,
      type: "team",
      addedAt: new Date().toISOString(),
    },
    {
      id: "dr-mark-pyfer",
      name: "Dr. Mark Pyfer",
      role: "Physician",
      organization: "MedPACT Network",
      city: "Philadelphia",
      state: "PA",
      lat: 39.9626,
      lng: -75.1552,
      type: "team",
      addedAt: new Date().toISOString(),
    },
    {
      id: "dr-scott-edmonds",
      name: "Dr. Scott Edmonds",
      role: "Physician",
      organization: "MedPACT Network",
      city: "Philadelphia",
      state: "PA",
      lat: 39.9446,
      lng: -75.1802,
      type: "team",
      addedAt: new Date().toISOString(),
    },
    {
      id: "dr-cathleen-mccabe",
      name: "Dr. Cathleen McCabe",
      role: "Physician",
      organization: "MedPACT Network",
      city: "Tampa",
      state: "FL",
      lat: 27.9506,
      lng: -82.4572,
      type: "team",
      addedAt: new Date().toISOString(),
    },
    {
      id: "dr-jason-bacharach",
      name: "Dr. Jason Bacharach",
      role: "Physician",
      organization: "MedPACT Network",
      city: "San Francisco",
      state: "CA",
      lat: 37.7749,
      lng: -122.4194,
      type: "team",
      addedAt: new Date().toISOString(),
    },
    {
      id: "dr-richard-lindstrom",
      name: "Dr. Richard Lindstrom",
      role: "Advisor",
      organization: "MedPACT Network",
      city: "Minneapolis",
      state: "MN",
      lat: 44.9778,
      lng: -93.2650,
      type: "team",
      addedAt: new Date().toISOString(),
    },
  ];
}

export async function GET() {
  const locations = readLocations();
  return NextResponse.json({ locations });
}

export async function POST(req: Request) {
  try {
    // Require admin authentication for POST
    const isAdmin = await verifyAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    if (!body.name || !body.city || !body.state || body.lat === undefined || body.lng === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate lat/lng are valid numbers
    const lat = parseFloat(body.lat);
    const lng = parseFloat(body.lng);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
    }

    const locations = readLocations();
    
    // Sanitize inputs
    const newLocation: NetworkLocation = {
      id: sanitizeInput(body.id, 100) || `loc-${Date.now()}`,
      name: sanitizeInput(body.name, 100),
      role: sanitizeInput(body.role, 100),
      organization: sanitizeInput(body.organization, 200),
      city: sanitizeInput(body.city, 100),
      state: sanitizeInput(body.state, 50),
      lat: lat,
      lng: lng,
      type: body.type === "team" ? "team" : "enrolled",
      addedAt: new Date().toISOString(),
    };

    // Update existing or add new
    const existingIndex = locations.findIndex((l) => l.id === newLocation.id);
    if (existingIndex >= 0) {
      locations[existingIndex] = newLocation;
    } else {
      locations.push(newLocation);
    }

    writeLocations(locations);
    return NextResponse.json({ success: true, location: newLocation });
  } catch (err) {
    console.error("[Network Locations] Error:", err);
    return NextResponse.json({ error: "Failed to save location" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    // Require admin authentication for DELETE
    const isAdmin = await verifyAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
    }

    // Sanitize the ID
    const sanitizedId = sanitizeInput(id, 100);
    if (!sanitizedId) {
      return NextResponse.json({ error: "Invalid id parameter" }, { status: 400 });
    }

    const locations = readLocations();
    const filtered = locations.filter((l) => l.id !== sanitizedId);

    if (filtered.length === locations.length) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    writeLocations(filtered);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Network Locations] Error:", err);
    return NextResponse.json({ error: "Failed to delete location" }, { status: 500 });
  }
}
