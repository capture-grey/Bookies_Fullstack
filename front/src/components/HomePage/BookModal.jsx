// src/components/HomePage/BookModal.jsx
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function BookModal({ book, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: book?.title || "",
    author: book?.author || "",
    genre: book?.genre || "",
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
      await onSubmit(formData);
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
          <h3 className="text-lg font-semibold">
            {book ? "Edit Book" : "Add New Book"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close Book Modal"
            disabled={loading}
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-4">
            <div>
              <label className="block mb-1 text-sm font-medium" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label
                className="block mb-1 text-sm font-medium"
                htmlFor="author"
              >
                Author
              </label>
              <input
                id="author"
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium" htmlFor="genre">
                Genre
              </label>
              <input
                id="genre"
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
                className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Save Book"}
          </button>
        </form>
      </div>
    </div>
  );
}
