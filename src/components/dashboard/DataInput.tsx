"use client";

import React from "react";

interface Props {
  data: string;
  onChange: (v: string) => void;
}

export default function DataInput({ data, onChange }: Props) {
  return (
    <div className="w-64 p-4 bg-white border-r flex flex-col">
      <div className="flex space-x-2 mb-2">
        {/* toolbar icons (list, indent, trash, help, text, expand, search) */}
        <button>📋</button>
        <button>↔️</button>
        <button>🗑️</button>
        <button>❓</button>
        <button>🔤</button>
        <button>⤢</button>
        <button>🔍</button>
      </div>
      <textarea
        className="flex-1 border rounded p-2 focus:outline-none"
        value={data}
        onChange={e => onChange(e.target.value)}
        placeholder="• item1
• item2
..."
      />
    </div>
  );
}
