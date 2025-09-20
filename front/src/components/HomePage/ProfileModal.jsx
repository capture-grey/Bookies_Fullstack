// src/components/HomePage/ProfileModal.jsx
import React, { useState, useEffect } from "react";
import { User, Edit, Trash2, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function ProfileModal({ onClose }) {
  const { user, setUser, token, logout } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const updateData = {
        name: formData.name,
        ...(formData.email && { email: formData.email }),
        ...(formData.currentPassword && {
          currentPassword: formData.currentPassword,
        }),
        ...(formData.newPassword && { newPassword: formData.newPassword }),
      };

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
      setUser({
        ...user,
        name: data.data.name,
        ...(data.data.email && { email: data.data.email }),
      });

      setEditMode(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/me`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      logout();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Profile</h3>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close Profile Modal"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        {editMode ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Add your email"
                  className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Required for password changes"
                  className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current"
                  className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {error && (
              <p className="mb-4 rounded bg-red-100 p-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                disabled={loading}
                className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : showDeleteConfirm ? (
          <div>
            <p className="mb-4 text-red-600">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
                className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-gray-200 p-6">
                <User size={32} className="text-gray-600" />
              </div>
            </div>
            <div className="mb-6 space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
              {user.email && (
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              )}
            </div>
            <div className="flex justify-between gap-2">
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-1 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                <Edit size={16} /> Edit Profile
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                <Trash2 size={16} /> Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
