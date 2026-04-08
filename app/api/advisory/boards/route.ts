import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "public", "media", "advisory-boards.json");

type BoardMember = {
  name: string;
  title?: string;
};

type Board = {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  members: BoardMember[];
};

const DEFAULT_BOARDS: Board[] = [
  {
    id: "medical",
    name: "Medical Advisory Board",
    icon: "🩺",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    members: [
      { name: "Dr. Chris Williams" },
      { name: "Dr. Jason Bacharach" },
      { name: "Dr. Cathleen McCabe" },
      { name: "Brian Murphey" },
      { name: "Dr. Joel Schuman" },
      { name: "Dr. Richard Lindstrom" },
      { name: "Dr. Zaina Al-Mohtaseb" },
    ],
  },
  {
    id: "technology",
    name: "Technology Advisory Board",
    icon: "💻",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    members: [
      { name: "Dr. Scott Edmonds" },
      { name: "Dr. Mark Pyfer" },
      { name: "Dr. Greg Smith" },
    ],
  },
  {
    id: "consultant",
    name: "Consultant Advisory Board",
    icon: "📋",
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    members: [
      { name: "Dr. Sagun Pendse" },
      { name: "Dr. Gary Brown" },
      { name: "Dr. Melissa Brown" },
      { name: "Jay Fairfield" },
      { name: "Jeff Stroble" },
    ],
  },
  {
    id: "practice",
    name: "Practice Administrator Board",
    icon: "🏥",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    members: [
      { name: "Jen Blasingame" },
    ],
  },
];

async function getBoards(): Promise<Board[]> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return DEFAULT_BOARDS;
  }
}

async function saveBoards(boards: Board[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(boards, null, 2));
}

// GET - Get all boards
export async function GET() {
  const boards = await getBoards();
  return NextResponse.json({ boards });
}

// POST - Update boards (add/remove member, etc.)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, boardId, member, memberIndex } = body;

    const boards = await getBoards();
    const boardIndex = boards.findIndex(b => b.id === boardId);

    if (boardIndex === -1 && action !== 'set_all') {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    switch (action) {
      case 'add_member':
        if (!member?.name) {
          return NextResponse.json({ error: "Member name required" }, { status: 400 });
        }
        boards[boardIndex].members.push(member);
        break;

      case 'remove_member':
        if (typeof memberIndex !== 'number') {
          return NextResponse.json({ error: "Member index required" }, { status: 400 });
        }
        boards[boardIndex].members.splice(memberIndex, 1);
        break;

      case 'update_member':
        if (typeof memberIndex !== 'number' || !member?.name) {
          return NextResponse.json({ error: "Member index and name required" }, { status: 400 });
        }
        boards[boardIndex].members[memberIndex] = member;
        break;

      case 'set_all':
        if (body.boards) {
          await saveBoards(body.boards);
          return NextResponse.json({ success: true, boards: body.boards });
        }
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await saveBoards(boards);
    return NextResponse.json({ success: true, boards });
  } catch (err) {
    console.error("[Advisory Boards] Error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
