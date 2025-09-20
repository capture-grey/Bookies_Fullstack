// src/components/forum/DeleteForumModal.jsx
import React from "react";
import { Trash2 } from "lucide-react";

const DeleteForumModal = ({ show, onClose, onDelete, loading }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Trash2 size={20} className="text-red-600" />
          Delete Forum
        </h3>
        <p className="mb-6">
          Are you sure you want to delete this forum? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete Forum"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteForumModal;
