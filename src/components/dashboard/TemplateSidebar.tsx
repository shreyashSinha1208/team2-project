"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  selected: string;
  onSelect: (t: string) => void;
}

const options = [
  "Hierarchy",
  "Timeline",
  "List",
  "Q&A",
  "Process",
  "Cycle",
  "Mindmap",
  "Family Tree",
  "Bar Chart",
  "Pie Chart",
  "Donut Chart",
  "Line Chart",
  "Concept Mapper",
  "Procedure Diagram",
  "Map",
];

export default function TemplateSidebar({ selected, onSelect }: Props) {
  return (
    <aside className="w-64 bg-yellow-300 p-4 flex flex-col">
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold underline">Templates</h2>
        <div className="flex space-x-2">
          <button className="bg-white px-2 py-1 rounded text-xs">
            Use AI<sup>+</sup>
          </button>
          <button className="bg-white px-2 py-1 rounded text-xs flex items-center">
            Customize
            <ChevronDown size={14} />
          </button>
        </div>
      </header>

      <div className="relative mb-4">
        <select
          className="w-full p-2 rounded appearance-none bg-white"
          value={selected}
          onChange={(e) => onSelect(e.target.value)}
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-2 top-1/2 -translate-y-1/2"
          size={16}
        />
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {options.map((o) => {
          const Icon = {
            Hierarchy: ChevronDown,
            Timeline: ChevronDown,
            List: ChevronDown,
            "Q&A": ChevronDown,
            Process: ChevronDown,
            Cycle: ChevronDown,
            Mindmap: ChevronDown,
            "Family Tree": ChevronDown,
            "Bar Chart": ChevronDown,
            "Pie Chart": ChevronDown,
            "Donut Chart": ChevronDown,
            "Line Chart": ChevronDown,
            "Concept Mapper": ChevronDown,
            "Procedure Diagram": ChevronDown,
          }[o]!;
          return (
            <button
              key={o}
              onClick={() => onSelect(o)}
              className={`flex flex-col items-center justify-center p-2 rounded
                ${
                  o === selected
                    ? "bg-blue-900 text-white"
                    : "bg-yellow-100 text-black"
                }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{o}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
