import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "public", "media", "team-visibility.json");

// Default all team members to visible
const DEFAULT_VISIBILITY: Record<string, boolean> = {
  "christopher-williams-md": true,
  "jason-bacharach-md": true,
  "cathleen-mccabe-md": true,
  "richard-lindstrom-md": true,
  "terrence-duckette": true,
  "brian-murphey": true,
  "rob-ostoich": true,
  "bill-williams": true,
  "dave-davis": true,
  "anita-galiano": true,
  "diana-banks": true,
  "lindsay-saddic": true,
  "chuck-yardley-advisor": true,
  "robel-tadele": true,
  "chris-louis": true,
};

async function getVisibility(): Promise<Record<string, boolean>> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return { ...DEFAULT_VISIBILITY, ...JSON.parse(data) };
  } catch {
    return DEFAULT_VISIBILITY;
  }
}

async function saveVisibility(visibility: Record<string, boolean>): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(visibility, null, 2));
}

// GET - Get current visibility settings
export async function GET() {
  const visibility = await getVisibility();
  return NextResponse.json(visibility);
}

// POST - Update visibility for a team member
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, visible } = body;

    if (!slug || typeof visible !== "boolean") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const visibility = await getVisibility();
    visibility[slug] = visible;
    await saveVisibility(visibility);

    return NextResponse.json({ success: true, visibility });
  } catch (err) {
    console.error("[Team Visibility] Error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
