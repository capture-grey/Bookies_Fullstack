import React, { useState } from "react";
import { LogOut } from "lucide-react";

export default function LeaveForumSection({ handleLeaveForum }) {
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  return (
    <>
      {/* Leave Forum Button */}
      <button
        onClick={() => setShowLeaveModal(true)}
        className="flex items-center gap-1 px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 cursor-pointer transition"
      >
        <LogOut size={16} />
        Leave Forum
      </button>

      {/* Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Leave Forum</h2>
            <p>Are you sure you want to leave this forum?</p>
            <div className="mt-4 flex gap-2 justify-center">
              <button
                onClick={handleLeaveForum}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes, Leave
              </button>
              <button
                onClick={() => setShowLeaveModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
