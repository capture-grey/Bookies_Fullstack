// src/components/HomePage/BookRow.jsx
import React from "react";
import { Edit, Trash2 } from "lucide-react";

export default function BookRow({ book, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between border-b px-4 py-3 last:border-none">
      <div>
        <h4 className="font-medium text-gray-900">{book.title}</h4>
        <p className="text-sm text-gray-600">
          by {book.author} • {book.genre}
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => onEdit(book)}
          className="text-blue-600 hover:text-blue-800"
          aria-label={`Edit ${book.title}`}
        >
          <Edit size={16} />
        </button>
        <button
          onClick={() => onDelete(book.id)}
          className="text-red-600 hover:text-red-800"
          aria-label={`Delete ${book.title}`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
