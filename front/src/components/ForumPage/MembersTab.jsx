// src/components/ForumPage/MembersTab.jsx
import React from "react";
import MemberRow from "./MemberRow";

const MembersTab = ({
  members,
  currentUserRole,
  forumId,
  token,
  onMemberAction,
}) => {
  return members && members.length > 0 ? (
    <div className="divide-y">
      {members.map((member) => (
        <MemberRow
          key={member.userId._id}
          member={member}
          currentUserRole={currentUserRole}
          forumId={forumId}
          token={token}
          onMemberAction={onMemberAction}
        />
      ))}
    </div>
  ) : (
    <div className="text-center py-10 text-gray-500">
      No members in this forum.
    </div>
  );
};

export default MembersTab;
