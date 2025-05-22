"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { setSelectedTemplate } from "@/app/store/chartsSlice";
import { motion } from "framer-motion";

interface Props {
  selected: string;
  onSelect: (t: string) => void;
}

const options = [
  "Hierarchy","Timeline","List","Q&A",
  "Process","Cycle","Mindmap","Family Tree",
  "Bar Chart","Pie Chart","Donut Chart","Line Chart"
];

export default function TemplateSidebar({ selected, onSelect }: Props) {
  const dispatch = useAppDispatch();
  const selectedTemplate = useAppSelector(state => state.charts.selectedTemplate);
  
  const handleSelect = (template: string) => {
    dispatch(setSelectedTemplate(template));
    onSelect(template);
  };
  
  const displaySelected = selectedTemplate || selected;
  
  return (
    <aside className="w-64 bg-gradient-to-br from-yellow-300 to-yellow-400 dark:from-yellow-700 dark:to-yellow-800 p-4 flex flex-col rounded-lg shadow-md">
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Templates</h2>
        <div className="flex space-x-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white dark:bg-gray-700 dark:text-white px-3 py-1.5 rounded text-xs font-medium shadow-sm hover:shadow-md transition-shadow"
          >
            Use AI<sup>+</sup>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white dark:bg-gray-700 dark:text-white px-3 py-1.5 rounded text-xs font-medium shadow-sm hover:shadow-md transition-shadow flex items-center"
          >
            Customize<ChevronDown size={14} className="ml-1"/>
          </motion.button>
        </div>
      </header>

      <div className="relative mb-4">
        <select
          className="w-full p-2 rounded appearance-none bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={displaySelected}
          onChange={e => handleSelect(e.target.value)}
        >
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16}/>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {options.map(o => {
          const Icon = {
            Hierarchy: ChevronDown,    Timeline: ChevronDown,
            List: ChevronDown,        "Q&A": ChevronDown,
            Process: ChevronDown,      Cycle: ChevronDown,
            Mindmap: ChevronDown,      "Family Tree": ChevronDown,
            "Bar Chart": ChevronDown,   "Pie Chart": ChevronDown,
            "Donut Chart": ChevronDown, "Line Chart": ChevronDown
          }[o]!;
          return (
            <motion.button
              key={o}
              onClick={() => handleSelect(o)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center justify-center p-2 rounded shadow-sm
                ${o === displaySelected
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-900/30"}`
              }
            >
              <Icon size={20}/>
              <span className="text-xs mt-1 truncate w-full text-center">{o}</span>
            </motion.button>
          );
        })}
      </div>
    </aside>
  );
}
