"use client";

import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { setListData } from "@/app/store/chartsSlice";
import { motion } from "framer-motion";

interface Props {
  items?: string[];
}

export default function ListView({ items }: Props) {
  const dispatch = useAppDispatch();
  const listData = useAppSelector((state) => state.charts.data.list);
  
  useEffect(() => {
    if (items && items.length > 0) {
      dispatch(setListData(items));
    }
  }, [items, dispatch]);
  
  const displayItems = items || listData;
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="w-full h-full p-8 bg-gradient-to-br from-white to-emerald-50 rounded-xl shadow-sm overflow-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-emerald-700 text-center">Structured List</h2>
        
        {displayItems.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>No list items available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayItems.map((line, i) => {
              // Trim line to detect heading or subpoint properly
              const trimmedLine = line.trim();

              // If line starts with no spaces and contains "Heading", treat as heading
              const isHeading = /^[^\s]/.test(line) && trimmedLine.toLowerCase().startsWith("heading");

              if (isHeading) {
                return (
                  <motion.h3
                    key={i}
                    className="font-bold text-lg mt-6 mb-3 text-emerald-800 border-b-2 border-emerald-200 pb-2"
                    variants={headingVariants}
                  >
                    {trimmedLine.substring(8)} {/* Remove "Heading" prefix */}
                  </motion.h3>
                );
              } else {
                // subpoint line
                return (
                  <motion.div 
                    key={i} 
                    className="flex items-start gap-3 pl-2"
                    variants={itemVariants}
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">{trimmedLine}</p>
                  </motion.div>
                );
              }
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
