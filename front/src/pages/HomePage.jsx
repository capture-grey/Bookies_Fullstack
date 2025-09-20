// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRoundCog,
  BookOpen,
  Users,
  User,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

import ForumCard from "../components/HomePage/ForumCard";
import BookRow from "../components/HomePage/BookRow";
import ProfileModal from "../components/HomePage/ProfileModal";
import BookModal from "../components/HomePage/BookModal";
import JoinForumModal from "../components/HomePage/JoinForumModal";
import CreateForumModal from "../components/HomePage/CreateForumModal";

import { useHomePageHandlers } from "../hooks/useHomePageHandlers";

export default function HomePage() {
  const { isAuthenticated, token, logout, user, setUser } = useAuth();
  const navigate = useNavigate();

  const [forums, setForums] = useState([]);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("forums");

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [showJoinForumModal, setShowJoinForumModal] = useState(false);
  const [showCreateForumModal, setShowCreateForumModal] = useState(false);

  // Use handlers from the custom hook
  const {
    handleAddBook,
    handleUpdateBook,
    handleDeleteBook,
    handleJoinForum,
    handleCreateForum,
    handleUpdateProfile,
    handleDeleteAccount,
  } = useHomePageHandlers({
    token,
    currentBook,
    setBooks,
    setForums,
    setUser,
    logout,
    navigate,
    setError,
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) throw new Error("Authentication required");

        setLoading(true);

        const userResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/user/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (userResponse.status === 401) {
          logout();
          throw new Error("Session expired. Please login again.");
        }

        if (!userResponse.ok) throw new Error("Failed to fetch user data");

        const userData = await userResponse.json();
        setForums(userData.user.forums || []);

        const booksResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/user/me/books`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (booksResponse.ok) {
          const booksData = await booksResponse.json();
          setBooks(booksData.books || []);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, token, logout]);

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Please Login</h2>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
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
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Login Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full px-4 mb-10 mt-5">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("forums")}
              className={`px-4 py-2 ${
                activeTab === "forums"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Your Forums
            </button>
            <button
              onClick={() => setActiveTab("books")}
              className={`px-4 py-2 ${
                activeTab === "books" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Your Books
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowProfileModal(true)}
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
              title="Profile"
            >
              <User size={20} />
            </button>
            <button
              onClick={logout}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {activeTab === "forums" ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Your Forums</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowJoinForumModal(true)}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Join Forum
                </button>
                <button
                  onClick={() => setShowCreateForumModal(true)}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Create Forum
                </button>
              </div>
            </div>
            <div className="forum-list flex flex-col gap-1">
              {forums.length > 0 ? (
                forums.map((forum) => (
                  <ForumCard key={forum.forumId} forum={forum} />
                ))
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">
                    You haven't joined any forums yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">
                Your Books ({books.length})
              </h2>
              <button
                onClick={() => {
                  setCurrentBook(null);
                  setShowBookModal(true);
                }}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
              >
                <Plus size={16} />
                Add Book
              </button>
            </div>
            <div className="bg-white rounded-lg shadow">
              {books.length > 0 ? (
                <div className="divide-y">
                  {books.map((book) => (
                    <BookRow
                      key={book.id}
                      book={book}
                      onEdit={(book) => {
                        setCurrentBook(book);
                        setShowBookModal(true);
                      }}
                      onDelete={handleDeleteBook}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">
                    You haven't added any books yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showProfileModal && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfileModal(false)}
          onUpdate={handleUpdateProfile}
          onDelete={handleDeleteAccount}
        />
      )}

      {showBookModal && (
        <BookModal
          book={currentBook}
          onClose={() => setShowBookModal(false)}
          onSubmit={currentBook ? handleUpdateBook : handleAddBook}
        />
      )}

      {showJoinForumModal && (
        <JoinForumModal
          onClose={() => setShowJoinForumModal(false)}
          onJoin={handleJoinForum}
        />
      )}

      {showCreateForumModal && (
        <CreateForumModal
          onClose={() => setShowCreateForumModal(false)}
          onCreate={handleCreateForum}
        />
      )}
    </div>
  );
}
