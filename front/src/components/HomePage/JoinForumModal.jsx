// src/components/HomePage/JoinForumModal.jsx
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function JoinForumModal({ onClose, onJoin }) {
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await onJoin(inviteCode);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Join Forum</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close Join Forum Modal"
            disabled={loading}
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="inviteCode"
              className="block mb-1 text-sm font-medium"
            >
              Invite Code
            </label>
            <input
              id="inviteCode"
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="Enter forum invite code"
              required
              className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Joining..." : "Join Forum"}
          </button>
        </form>
      </div>
    </div>
  );
}
