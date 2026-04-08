"use client";

import * as React from "react";

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

const defaultBoards: Board[] = [
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

export default function AdvisoryBoards() {
  const [boards, setBoards] = React.useState<Board[]>(defaultBoards);

  // Load saved boards from API
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/advisory/boards');
        if (res.ok) {
          const data = await res.json();
          if (data.boards && data.boards.length > 0) {
            setBoards(data.boards);
          }
        }
      } catch (e) {
        // Use defaults
      }
    })();
  }, []);

  return (
    <div className="mt-10 grid gap-8 md:grid-cols-2">
      {boards.map((board, boardIndex) => (
        <div 
          key={board.id}
          className={`rounded-3xl border ${board.borderColor} ${board.bgColor} p-6 scroll-animate`}
          style={{ animationDelay: `${boardIndex * 100}ms` }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{board.icon}</span>
            <h2 className={`text-xl font-bold ${board.color}`}>{board.name}</h2>
          </div>
          
          <ul className="space-y-2">
            {board.members.map((member, index) => (
              <li 
                key={`${board.id}-${index}`}
                className="flex items-center gap-3 p-3 bg-white/70 rounded-xl border border-white"
              >
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-bold text-gray-600 border border-gray-200">
                  {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="font-medium text-sm">{member.name}</div>
                  {member.title && (
                    <div className="text-xs text-gray-500">{member.title}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 text-xs text-gray-500 text-center">
            {board.members.length} member{board.members.length !== 1 ? 's' : ''}
          </div>
        </div>
      ))}
    </div>
  );
}
