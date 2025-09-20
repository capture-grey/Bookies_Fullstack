// src/components/Banner.jsx
import React from "react";
import { Button } from "@/components/ui/button";

const Banner = ({ featuredBook }) => {
  if (!featuredBook) return null;

  return (
    <div className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl shadow-lg overflow-hidden mb-6">
      <div className="flex flex-col md:flex-row">
        <img
          src={featuredBook.image}
          alt={featuredBook.title}
          className="w-full md:w-1/3 object-cover"
        />
        <div className="p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold">{featuredBook.title}</h2>
            <p className="mt-2 text-sm text-white/80">{featuredBook.author}</p>
            <p className="mt-4">{featuredBook.description}</p>
          </div>
          <div className="mt-4">
            <Button variant="secondary">Read More</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
