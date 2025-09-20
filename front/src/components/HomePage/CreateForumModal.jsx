// src/components/HomePage/CreateForumModal.jsx
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function CreateForumModal({ onClose, onCreate }) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await onCreate(formData);
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
          <h3 className="text-lg font-semibold">Create New Forum</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close Create Forum Modal"
            disabled={loading}
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-4">
            <div>
              <label htmlFor="name" className="block mb-1 text-sm font-medium">
                Forum Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block mb-1 text-sm font-medium"
              >
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block mb-1 text-sm font-medium"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full resize-none rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Forum"}
          </button>
        </form>
      </div>
    </div>
  );
}
