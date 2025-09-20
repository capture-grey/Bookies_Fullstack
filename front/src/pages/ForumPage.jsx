// src/pages/ForumPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookOpen, Users, ArrowLeft, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

import ForumDetailsForm from "../components/ForumPage/ForumDetailsForm";
import BooksTab from "../components/ForumPage/BooksTab";
import MembersTab from "../components/ForumPage/MembersTab";
import LeaveForumSection from "../components/ForumPage/LeaveForumSection";
import DeleteForumModal from "../components/ForumPage/DeleteForumModal";

export default function ForumPage() {
  const { forumId } = useParams();
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();

  const [forum, setForum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("books");
  const [currentUserRole, setCurrentUserRole] = useState("member");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch forum details
  useEffect(() => {
    const fetchForumDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/forum/${forumId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.status === 401) {
          logout();
          throw new Error("Session expired. Please login again.");
        }

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch forum details");
        }
        console.log(data); /////////////////
        console.log("Current user ID from auth:", user?._id); ////////////////////////////

        const transformedData = {
          ...data.data.forumInfo,
          _id: forumId,
          members: data.data.members.map((member) => ({
            userId: {
              _id: member._id,
              username: member.name,
              email: member.email,
            },
            role: member.role,
          })),
          books: data.data.books.map((book) => ({ ...book, owners: [] })),
          hiddenBooks: data.data.hiddenBooks,
        };

        setForum(transformedData);

        // Set current user role
        if (user && transformedData.members) {
          const currentUserMember = transformedData.members.find(
            (member) => String(member.userId._id) === String(user._id)
          );
          if (currentUserMember) {
            setCurrentUserRole(currentUserMember.role.toLowerCase());
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "An error occurred while loading the forum");
      } finally {
        setLoading(false);
      }
    };

    fetchForumDetails();
  }, [forumId, token, logout, user]);

  // Refresh forum data
  const refreshForumData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/forum/${forumId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to refresh forum data");
      }

      const transformedData = {
        ...data.data.forumInfo,
        _id: forumId,
        members: data.data.members.map((member) => ({
          userId: {
            _id: member._id,
            username: member.name,
            email: member.email,
          },
          role: member.role,
        })),
        books: data.data.books.map((book) => ({ ...book, owners: [] })),
        hiddenBooks: data.data.hiddenBooks,
      };

      setForum(transformedData);
    } catch (err) {
      console.error("Refresh error:", err);
      setError(err.message);
    }
  };

  // Leave forum handler
  const handleLeaveForum = async () => {
    try {
      setActionLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/forum/${forumId}/leave`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to leave forum");
      }

      navigate("/home");
    } catch (err) {
      console.error("Leave forum error:", err);
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete forum handler
  const handleDeleteForum = async () => {
    try {
      setActionLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/forum/${forumId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete forum");
      }

      navigate("/home");
    } catch (err) {
      console.error("Delete forum error:", err);
      setError(err.message);
    } finally {
      setActionLoading(false);
      setShowDeleteModal(false);
    }
  };

  // Loading/Error states
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Error</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/home")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    );

  if (!forum)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Forum Not Found</h2>
          <p className="mb-4">The requested forum could not be loaded.</p>
          <button
            onClick={() => navigate("/home")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header: Back + Actions */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 cursor-pointer transition"
          >
            <ArrowLeft size={18} />
            Back to Forums
          </button>
          <div>
            <p>{currentUserRole}</p>
          </div>
          <div className="flex gap-2">
            {currentUserRole === "admin" && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer transition"
              >
                <Trash2 size={16} />
                Delete Forum
              </button>
            )}

            <LeaveForumSection handleLeaveForum={handleLeaveForum} />
          </div>
        </div>

        {/* Forum Details */}
        <ForumDetailsForm
          forum={forum}
          token={token}
          currentUserRole={currentUserRole}
          onUpdate={(updatedData) =>
            setForum((prev) => ({ ...prev, ...updatedData }))
          }
        />

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow overflow-hidden mt-4">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("books")}
              className={`flex-1 py-3 font-medium flex items-center justify-center gap-2 ${
                activeTab === "books"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <BookOpen size={16} />
              Books
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={`flex-1 py-3 font-medium flex items-center justify-center gap-2 ${
                activeTab === "members"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Users size={16} />
              Members ({forum.members.length})
            </button>
          </div>

          <div className="p-4">
            {activeTab === "books" ? (
              <BooksTab
                books={forum.books}
                forumId={forumId}
                token={token}
                isAdmin={currentUserRole === "admin"}
                refreshForumData={refreshForumData}
              />
            ) : (
              <MembersTab
                members={forum.members}
                currentUserRole={currentUserRole}
                forumId={forumId}
                token={token}
                refreshForumData={refreshForumData}
              />
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteForumModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteForum}
        loading={actionLoading}
      />
    </div>
  );
}
