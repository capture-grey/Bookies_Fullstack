import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const MemberRow = ({
  member,
  currentUserRole,
  forumId,
  token,
  onMemberAction,
}) => {
  const { userId, role: initialRole } = member;
  const { getUserId } = useAuth();
  const currentUserId = getUserId();
  const [role, setRole] = useState(initialRole);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [memberDetails, setMemberDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const isCurrentUser = userId._id === currentUserId;
  const canMakeAdmin =
    currentUserRole === "admin" && !isCurrentUser && role !== "admin";

  const fetchMemberDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/forum/${forumId}/users/${
          userId._id
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch member details");
      }

      const data = await response.json();
      setMemberDetails(data.data);
      setShowDetails(true);
    } catch (error) {
      console.error("Fetch member details error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMakeAdmin = async (e) => {
    e.stopPropagation(); // Prevent triggering row click
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/forum/${forumId}/users/${
          userId._id
        }`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to make admin");
      }

      setRole("admin");
      if (typeof onMemberAction === "function") onMemberAction();
    } catch (error) {
      console.error("Make admin error:", error);
      setError(error.message);
      setRole(initialRole);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = () => {
    if (!showDetails) {
      fetchMemberDetails();
    } else {
      setShowDetails(false);
    }
  };

  return (
    <div className="border-b">
      <div
        className={`flex justify-between items-center py-3 px-4 hover:bg-gray-50 rounded cursor-pointer ${
          showDetails ? "bg-gray-100" : ""
        }`}
        onClick={handleRowClick}
      >
        <div>
          <p className="font-medium">{userId.username}</p>
          <p className="text-sm text-gray-500">{userId.email}</p>
          {isCurrentUser && (
            <span className="text-xs text-gray-400">(You)</span>
          )}
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`capitalize px-3 py-1 rounded text-xs font-semibold ${
              role === "admin"
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {role}
          </span>

          {canMakeAdmin && (
            <button
              onClick={handleMakeAdmin}
              disabled={isLoading}
              className={`px-3 py-1 text-white text-sm rounded transition-colors ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isLoading ? "Processing..." : "Make Admin"}
            </button>
          )}
        </div>
      </div>

      {showDetails && memberDetails && (
        <div className="p-4 bg-gray-50 border-t">
          <h3 className="font-semibold mb-2">Member Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p>{memberDetails.member.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p>{memberDetails.member.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <p className="capitalize">{memberDetails.member.role}</p>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">
              Books ({memberDetails.books.length})
            </h4>
            {memberDetails.books.length > 0 ? (
              <ul className="space-y-2">
                {memberDetails.books.map((book) => (
                  <li key={book._id} className="text-sm">
                    {book.title} by {book.author}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No books added</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

MemberRow.defaultProps = {
  onMemberAction: () => {},
};

export default MemberRow;
