"use client";

import React from "react";

interface Props {
  items: string[];
}

export default function QnAView({ items }: Props) {
  return (
    <dl className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-extrabold text-indigo-700 mb-6 text-center">
        Q&A
      </h2>
      {items.length === 0 && (
        <p className="text-center text-gray-400">No questions available.</p>
      )}
      {items.map((line, i) => {
        // Check if line has colon and splits into exactly 2 parts (Q and A)
        if (!line.includes(":")) {
          return <div key={i} className="mb-5 min-h-[50px]"></div>; // blank space div
        }

        const [q, a, ...rest] = line.split(":");

        // If question or answer missing or empty, render blank div
        if (!q?.trim() || !a?.trim() || rest.length > 0) {
          return <div key={i} className="mb-5 min-h-[50px]"></div>;
        }

        return (
          <div
            key={i}
            className="mb-5 border-l-4 border-indigo-500 bg-indigo-50 rounded-md p-4 shadow-sm"
          >
            <dt className="text-lg font-semibold text-indigo-800 mb-1">
              {q.trim()}
            </dt>
            <dd className="ml-4 text-gray-700 leading-relaxed">{a.trim()}</dd>
          </div>
        );
      })}
    </dl>
  );
}
