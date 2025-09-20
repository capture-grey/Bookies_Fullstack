import React, { useState } from "react";
import { Settings, Copy, MessageSquare } from "lucide-react";

const ForumDetailsForm = ({ forum, token, onUpdate, currentUserRole }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: forum.name,
    location: forum.location,
    description: forum.description || "",
    inviteCode: forum.inviteCode || "",
    messengerLink: forum.messengerLink || "",
    featured: forum.featured || { book: "", quote: "" },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const canEdit = currentUserRole !== "member"; // only admins/moderators

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeaturedChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      featured: {
        ...prev.featured,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/forum/${forum._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update forum details");

      const data = await response.json();
      onUpdate(data.data);
      setEditMode(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Forum Details</h3>

        {canEdit && (
          <button
            onClick={() => {
              setEditMode((prev) => !prev);
              setError(null);
              setFormData({
                name: forum.name,
                location: forum.location,
                description: forum.description || "",
                inviteCode: forum.inviteCode || "",
                messengerLink: forum.messengerLink || "",
                featured: forum.featured || { book: "", quote: "" },
              });
            }}
            className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            <Settings size={16} />
            {editMode ? "Cancel" : "Edit"}
          </button>
        )}
      </div>

      {editMode ? (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Messenger Link
              </label>
              <input
                type="url"
                name="messengerLink"
                value={formData.messengerLink}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Invite Code
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  name="inviteCode"
                  value={formData.inviteCode}
                  className="w-full p-2 border rounded-l"
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(formData.inviteCode)}
                  className="px-3 bg-gray-200 border-t border-r border-b rounded-r hover:bg-gray-300"
                >
                  <Copy size={16} />
                </button>
              </div>
              {copied && (
                <p className="text-green-500 text-sm mt-1">
                  Copied to clipboard!
                </p>
              )}
            </div>

            {/* Featured Book */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Featured Book
              </label>
              {canEdit ? (
                <>
                  <input
                    type="text"
                    name="book"
                    value={formData.featured.book}
                    onChange={handleFeaturedChange}
                    className="w-full p-2 border rounded mb-2"
                    placeholder="Book title"
                  />
                  <textarea
                    name="quote"
                    value={formData.featured.quote}
                    onChange={handleFeaturedChange}
                    className="w-full p-2 border rounded"
                    rows="2"
                    placeholder="Featured quote"
                  />
                </>
              ) : (
                <div className="p-2 bg-gray-100 rounded">
                  {forum.featured.book && (
                    <p>
                      <span className="font-semibold">Book:</span>{" "}
                      {forum.featured.book}
                    </p>
                  )}
                  {forum.featured.quote && (
                    <p className="italic mt-1">"{forum.featured.quote}"</p>
                  )}
                  {!forum.featured.book && !forum.featured.quote && <p>-</p>}
                </div>
              )}
            </div>
          </div>

          {canEdit && (
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{forum.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{forum.location || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Description</p>
              <p className="font-medium">{forum.description || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Messenger Link</p>
              {forum.messengerLink ? (
                <a
                  href={forum.messengerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-500 hover:underline flex items-center gap-1"
                >
                  <MessageSquare size={16} /> Join Chat
                </a>
              ) : (
                <p className="font-medium">-</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">Invite Code</p>
              <div className="flex items-center gap-2">
                <p className="font-medium bg-gray-100 p-2 rounded-l flex-1">
                  {forum.inviteCode}
                </p>
                <button
                  onClick={() => copyToClipboard(forum.inviteCode)}
                  className="px-3 bg-gray-200 rounded-r hover:bg-gray-300"
                >
                  <Copy size={16} />
                </button>
              </div>
              {copied && (
                <p className="text-green-500 text-sm mt-1">
                  Copied to clipboard!
                </p>
              )}
            </div>
          </div>

          {/* Featured Display */}
          {forum.featured && (forum.featured.book || forum.featured.quote) && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded">
              <h4 className="font-medium text-yellow-800 mb-1">Featured</h4>
              {forum.featured.book && (
                <p className="text-yellow-700">
                  <span className="font-semibold">Book:</span>{" "}
                  {forum.featured.book}
                </p>
              )}
              {forum.featured.quote && (
                <p className="text-yellow-700 mt-1 italic">
                  "{forum.featured.quote}"
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ForumDetailsForm;
