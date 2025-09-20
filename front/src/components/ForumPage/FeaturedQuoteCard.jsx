"use client";

export default function FeaturedQuoteCard({ book, quote, author }) {
  if (!book && !quote) return null;

  return (
    <section className="bg-gradient-to-r from-yellow-100 via-yellow-50 to-white rounded-lg shadow p-4 md:p-6">
      <div className="flex flex-col h-full justify-center">
        <span className="text-xs uppercase font-semibold text-yellow-700">
          Featured
        </span>

        {book && (
          <h2 className="text-lg md:text-xl font-bold text-yellow-900 mt-1">
            {book}
          </h2>
        )}

        {author && (
          <span className="text-sm font-semibold text-yellow-800 mb-2">
            {author}
          </span>
        )}

        {quote && (
          <p className="text-sm md:text-base italic text-yellow-800 leading-snug">
            “{quote}”
          </p>
        )}
      </div>
    </section>
  );
}
