"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { setQnAData } from "@/app/store/chartsSlice";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react";

interface Props {
  items?: string[];
}

export default function QnAView({ items }: Props) {
  const dispatch = useAppDispatch();
  const { qna } = useAppSelector((state) => state.charts.data);
  const [expandedItems, setExpandedItems] = useState<number[]>([0]); // First item expanded by default
  
  useEffect(() => {
    if (items && items.length > 0) {
      dispatch(setQnAData(items));
    }
  }, [items, dispatch]);

  const displayItems = items || qna;
  
  const toggleItem = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const parseQnA = (line: string) => {
    if (!line.includes(":")) return null;
    
    const [q, ...aParts] = line.split(":");
    const a = aParts.join(":");
    
    if (!q?.trim() || !a?.trim()) return null;
    
    return { question: q.trim(), answer: a.trim() };
  };

  const validItems = displayItems
    .map(parseQnA)
    .filter(item => item !== null);

  return (
    <motion.div 
      className="w-full h-full overflow-auto bg-gradient-to-br from-white to-amber-50 rounded-xl p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-amber-600 mb-8 text-center flex items-center justify-center gap-2">
          <MessageCircle className="h-6 w-6" />
          Questions & Answers
        </h2>
        
        {validItems.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No questions available.</p>
          </div>
        )}
        
        <div className="space-y-4">
          {validItems.map((item, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-amber-200"
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => toggleItem(i)}
                className="w-full flex justify-between items-center p-4 text-left bg-gradient-to-r from-amber-100 to-amber-50 hover:from-amber-200 hover:to-amber-100 transition-colors duration-200"
              >
                <h3 className="text-lg font-medium text-amber-800">
                  {item!.question}
                </h3>
                {expandedItems.includes(i) ? (
                  <ChevronUp className="h-5 w-5 text-amber-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-amber-600 flex-shrink-0" />
                )}
              </button>
              
              <AnimatePresence>
                {expandedItems.includes(i) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 bg-white border-t border-amber-100">
                      <p className="text-gray-700 leading-relaxed">
                        {item!.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
