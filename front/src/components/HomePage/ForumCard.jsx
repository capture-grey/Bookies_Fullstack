// src/components/HomePage/ForumCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { UserRoundCog, BookOpen, Users } from "lucide-react";

export default function ForumCard({ forum }) {
  const navigate = useNavigate();
  const roleIconColor =
    forum.role === "admin" ? "text-yellow-400" : "text-gray-300";

  return (
    <div
      onClick={() => navigate(`/forums/${forum.forumId}`)}
      className="flex cursor-pointer rounded-md border border-gray-200 bg-white p-3 mb-2 transition-shadow hover:shadow-md"
    >
      <div className="flex flex-col flex-grow pl-2 md:pl-5 break-words">
        <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
          <h3>{forum.name}</h3>
          <UserRoundCog size={18} className={roleIconColor} />
        </div>
        <p className="text-xs text-gray-600 mt-0.5">{forum.location}</p>
      </div>

      <div className="flex gap-6 items-center text-sm text-gray-700">
        <div className="flex items-center gap-1 select-none">
          <BookOpen size={16} />
          <span>{forum.membersBookCount}</span>
        </div>
        <div className="flex items-center gap-1 select-none">
          <Users size={16} />
          <span>{forum.memberCount}</span>
        </div>
      </div>
    </div>
  );
}
