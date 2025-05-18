// src/app/components/dashboard/TemplateSidebar.tsx
"use client";

import React from "react";
import {
  Grid,          // hierarchy icon
  Clock,         // timeline icon
  List,          // list icon
  MessageCircle, // Q&A icon
  Layout,        // Pro icon
  ChevronDown
} from "lucide-react";

interface Props {
  selected: string;
  onSelect: (t: string) => void;
}

const options = [
  { key: "Hierarchy", icon: Grid },
  { key: "Timeline",  icon: Clock },
  { key: "List",      icon: List },
  { key: "Q&A",       icon: MessageCircle },
  { key: "Pro",       icon: Layout }
];

export default function TemplateSidebar({ selected, onSelect }: Props) {
  return (
    <aside className="w-64 flex flex-col bg-yellow-400 border-r border-black h-screen">
      {/* Top nav */}
      <div className="h-12 flex items-center justify-between px-4 bg-blue-900">
        <h2 className="text-lg font-bold text-white underline">Templates</h2>
        <div className="flex items-center space-x-2">
          <span className="text-white text-sm">Use AI<sup>✨</sup></span>
          <span className="text-white text-sm flex items-center">
            Customize<ChevronDown size={16} className="ml-1" />
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-[2px] bg-black" />

      {/* Dropdown */}
      <div className="px-4 py-2">
        <div className="relative">
          <select
            className="w-full p-2 rounded-lg border-2 border-black bg-white text-black appearance-none"
            value={selected}
            onChange={e => onSelect(e.target.value)}
          >
            <option>All</option>
            {options.map(o => (
              <option key={o.key}>{o.key}</option>
            ))}
          </select>
          <ChevronDown
            size={20}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black"
          />
        </div>
      </div>

      {/* Icon buttons */}
      <div className="px-4 grid grid-cols-5 gap-2">
        {options.map(({ key, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={
              `flex flex-col items-center justify-center p-2 rounded-lg
               ${selected === key
                 ? "bg-blue-900 text-white"
                 : "bg-yellow-200 text-black"}
               border-2 border-black
               hover:bg-yellow-300`
            }
          >
            <Icon size={24} />
            <span className="mt-1 text-xs">{key}</span>
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-4 px-4">
        <div className="h-2 bg-blue-900 rounded-full w-1/3" />
        <div className="h-2 bg-gray-300 rounded-full mt-1" />
      </div>

      {/* Remove prompt box: DataInput sits separately now */}
    </aside>
  );
}
