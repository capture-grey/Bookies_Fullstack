// src/components/forum/BookRow.jsx
import React, { useState } from "react";

const BookRow = ({ book, forumId, token, isAdmin, onBookAction }) => {
  const [showOwners, setShowOwners] = useState(false);
  const [owners, setOwners] = useState([]);
  const [loadingOwners, setLoadingOwners] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOwners = async () => {
    setLoadingOwners(true);
    setError(null);
    try {
      // Fetch forum members first
      const forumResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/forum/${forumId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!forumResponse.ok) throw new Error("Failed to fetch forum members");

      const forumData = await forumResponse.json();

      const ownersList = [];

      // Iterate through members and check if they have this book
      for (const member of forumData.data.members) {
        const memberResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/forum/${forumId}/users/${
            member._id
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!memberResponse.ok) continue;

        const memberData = await memberResponse.json();

        const hasBook = memberData.data.books.some((b) => b._id === book._id);
        if (hasBook) {
          ownersList.push({
            _id: member._id,
            username: member.name,
            email: member.email,
          });
        }
      }

      setOwners(ownersList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingOwners(false);
    }
  };

  const toggleOwners = () => {
    if (!showOwners && owners.length === 0) {
      fetchOwners();
    }
    setShowOwners(!showOwners);
  };

  const handleToggleHidden = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/forum/${forumId}/books/${
          book._id
        }/${book.hidden ? "unhide" : "hide"}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to update book status");
      onBookAction();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="border-b p-3">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-medium">{book.title}</h4>
          <p className="text-sm text-gray-600">by {book.author}</p>
          {book.genre && (
            <p className="text-xs text-gray-500">Genre: {book.genre}</p>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={toggleOwners}
            className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
            disabled={loadingOwners}
          >
            {loadingOwners
              ? "Loading..."
              : showOwners
              ? "Hide Owners"
              : "Show Owners"}
          </button>
          {isAdmin && (
            <button
              onClick={handleToggleHidden}
              disabled={actionLoading}
              className={`px-2 py-1 text-xs rounded text-white ${
                book.hidden
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              } disabled:opacity-50`}
            >
              {actionLoading
                ? "Processing..."
                : book.hidden
                ? "Unhide"
                : "Hide"}
            </button>
          )}
        </div>
      </div>

      {showOwners && (
        <div className="mt-2 pl-4 border-l-2 border-gray-200">
          {loadingOwners ? (
            <p className="text-sm text-gray-500">Loading owners...</p>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : owners.length > 0 ? (
            <ul className="text-sm">
              {owners.map((owner) => (
                <li key={owner._id} className="py-1">
                  {owner.username}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No owners found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BookRow;
