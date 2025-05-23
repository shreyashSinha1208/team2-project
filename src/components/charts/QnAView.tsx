"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { setQnAData } from "@/app/store/chartsSlice";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, CornerDownRight } from "lucide-react";

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
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-8">
          📝 Q&A Questionnaire
        </h2>

        {items.length === 0 && (
          <p className="text-center text-gray-400 text-lg">
            No questions available.
          </p>
        )}

        <dl className="space-y-6">
          {items.map((line, i) => {
            if (!line.includes(":")) {
              return <div key={i} className="min-h-[50px]"></div>;
            }

            const [q, a, ...rest] = line.split(":");

            if (!q?.trim() || !a?.trim() || rest.length > 0) {
              return <div key={i} className="min-h-[50px]"></div>;
            }

            return (
              <div
                key={i}
                className="group transition border border-gray-200 bg-blue-50 rounded-xl p-6"
              >
                <dt className="flex items-center text-blue-900 text-base font-semibold mb-1">
                  <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
                  {q.trim()}
                </dt>
                <dd className="ml-7 flex items-start text-gray-800 leading-relaxed">
                  <CornerDownRight className="w-4 h-4 mt-1 mr-2 text-blue-400" />
                  {a.trim()}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
}
