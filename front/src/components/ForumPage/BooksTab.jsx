// src/components/forum/BooksTab.jsx
import React from "react";
import BookRow from "./BookRow";

const BooksTab = ({ books, forumId, token, currentUserRole, onBookAction }) => {
  return books && books.length > 0 ? (
    <div className="divide-y">
      {books.map((book) => (
        <BookRow
          key={book._id}
          book={book}
          forumId={forumId}
          token={token}
          isAdmin={currentUserRole === "admin"}
          onBookAction={onBookAction}
        />
      ))}
    </div>
  ) : (
    <div className="text-center py-10 text-gray-500">
      No books added to this forum yet.
    </div>
  );
};

export default BooksTab;
