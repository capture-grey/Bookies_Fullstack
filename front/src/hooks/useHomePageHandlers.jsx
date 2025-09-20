// src/hooks/useHomePageHandlers.js
import { useCallback } from "react";

export function useHomePageHandlers({
  token,
  currentBook,
  setBooks,
  setForums,
  setUser,
  logout,
  navigate,
  setError,
}) {
  const handleAddBook = useCallback(
    async (bookData) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/book/add`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bookData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to add book");
        }

        const data = await response.json();
        setBooks((prev) => [
          ...prev,
          {
            id: data.id,
            title: data.title,
            author: data.author,
            genre: bookData.genre,
          },
        ]);
      } catch (err) {
        throw err;
      }
    },
    [token, setBooks]
  );

  const handleUpdateBook = useCallback(
    async (bookData) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/book/${currentBook.id}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bookData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update book");
        }

        setBooks((prev) =>
          prev.map((book) =>
            book.id === currentBook.id ? { ...book, ...bookData } : book
          )
        );
      } catch (err) {
        throw err;
      }
    },
    [token, currentBook, setBooks]
  );

  const handleDeleteBook = useCallback(
    async (bookId) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/book/${bookId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete book");
        }

        setBooks((prev) => prev.filter((book) => book.id !== bookId));
      } catch (err) {
        setError(err.message);
      }
    },
    [token, setBooks, setError]
  );

  const handleJoinForum = async (inviteCode) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/forum/join`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inviteCode }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to join forum");
      }

      // Refresh user data to get updated forums list
      const userResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setForums(userData.user.forums || []);

        // Optional: Navigate to the newly joined forum
        //navigate(`/forums/${data.data.forumId}`);
      }

      return data;
    } catch (err) {
      console.error("Join forum error:", err);
      setError(err.message);
      throw err;
    }
  };

  const handleCreateForum = useCallback(
    async (forumData) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/forum`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(forumData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create forum");
        }

        const data = await response.json();
        setForums((prev) => [
          ...prev,
          {
            forumId: data.data.forumId,
            name: data.data.name,
            location: data.data.location,
            memberCount: 1,
            membersBookCount: 0,
            role: "admin",
          },
        ]);
      } catch (err) {
        throw err;
      }
    },
    [token, setForums]
  );

  const handleUpdateProfile = useCallback(
    async (updateData) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/user/me`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update profile");
        }

        const data = await response.json();

        setUser((prev) => ({
          ...prev,
          name: data.data.name,
          ...(data.data.email && { email: data.data.email }),
        }));

        return data;
      } catch (err) {
        throw err;
      }
    },
    [token, setUser]
  );

  const handleDeleteAccount = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/me`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      logout();
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  }, [token, logout, navigate, setError]);

  return {
    handleAddBook,
    handleUpdateBook,
    handleDeleteBook,
    handleJoinForum,
    handleCreateForum,
    handleUpdateProfile,
    handleDeleteAccount,
  };
}
