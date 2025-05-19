"use client";

import React from "react";

interface Props {
  items: string[];
}

export default function ListView({ items }: Props) {
  return (
    <div className="p-4">
      {items.map((line, i) => {
        // Trim line to detect heading or subpoint properly
        const trimmedLine = line.trim();

        // If line starts with no spaces and contains "Heading", treat as heading
        const isHeading = /^[^\s]/.test(line) && trimmedLine.toLowerCase().startsWith("heading");

        if (isHeading) {
          return (
            <h3
              key={i}
              className="font-bold text-lg mb-2 mt-4 text-black-700 border-b-2 border-black-400 pb-1"
            >
              {trimmedLine}
            </h3>
          );
        } else {
          // subpoint line
          return (
            <li key={i} className="ml-6 list-disc mb-1 text-gray-700">
              {trimmedLine}
            </li>
          );
        }
      })}
    </div>
  );
}
