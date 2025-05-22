import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { setItems } from "@/app/store/dataSlice";
import { motion } from "framer-motion";

const SwotView = () => {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.swot.items);

  // Same logic to map items to categories
  const swotMap: Record<string, string[]> = {
    Strengths: [],
    Weaknesses: [],
    Opportunities: [],
    Threats: [],
  };
  let currentCategory: keyof typeof swotMap | null = null;

  items.forEach((item) => {
    const trimmed = item.trim();
    if (["Strengths", "Weaknesses", "Opportunities", "Threats"].includes(trimmed)) {
      currentCategory = trimmed as keyof typeof swotMap;
    } else if (currentCategory) {
      swotMap[currentCategory].push(trimmed.replace(/^\d+\.\s*/, ""));
    }
  });

  // Editable handler: update the item at a specific global index
  const handleEdit = (category: string, idx: number, newValue: string) => {
    // Rebuild the whole list by replacing that specific item in Redux
    // We must reconstruct items array, keeping categories and order

    const newItems: string[] = [];
    Object.entries(swotMap).forEach(([cat, points]) => {
      newItems.push(cat);
      points.forEach((point, pIdx) => {
        if (cat === category && pIdx === idx) {
          // Replace edited value, add numbering
          newItems.push(`${pIdx + 1}. ${newValue}`);
        } else {
          newItems.push(`${pIdx + 1}. ${point}`);
        }
      });
    });

    dispatch(setItems(newItems));
  };

  const categoryStyles: Record<string, { bg: string, border: string, icon: string, title: string }> = {
    Strengths: {
      bg: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      border: "border-emerald-200",
      icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "text-emerald-700"
    },
    Weaknesses: {
      bg: "bg-gradient-to-br from-rose-50 to-rose-100",
      border: "border-rose-200",
      icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
      title: "text-rose-700"
    },
    Opportunities: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100",
      border: "border-blue-200",
      icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
      title: "text-blue-700"
    },
    Threats: {
      bg: "bg-gradient-to-br from-amber-50 to-amber-100",
      border: "border-amber-200",
      icon: "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z",
      title: "text-amber-700"
    },
  };

  // Animation variants
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

  const handleAddItem = (category: string) => {
    const newItems = [...items];
    const categoryIndex = newItems.indexOf(category);
    let insertIndex = categoryIndex + 1;
    
    // Find where to insert the new item (after the last item in this category)
    for (let i = categoryIndex + 1; i < newItems.length; i++) {
      if (["Strengths", "Weaknesses", "Opportunities", "Threats"].includes(newItems[i])) {
        break;
      }
      insertIndex = i + 1;
    }
    
    // Add new item with the next number
    const nextNum = swotMap[category as keyof typeof swotMap].length + 1;
    newItems.splice(insertIndex, 0, `${nextNum}. New item`);
    
    dispatch(setItems(newItems));
  };

  return (
    <motion.div 
      className="w-full h-full p-6 bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-sm overflow-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h2 className="text-2xl font-bold mb-6 text-slate-700 text-center">SWOT Analysis</h2>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {(Object.keys(swotMap) as (keyof typeof swotMap)[]).map((category) => (
          <motion.div
            key={category}
            className={`rounded-xl shadow-md p-5 ${categoryStyles[category].bg} border ${categoryStyles[category].border} transition-all duration-300 hover:shadow-lg`}
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className={`w-6 h-6 ${categoryStyles[category].title}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={categoryStyles[category].icon} />
              </svg>
              <h3 className={`text-xl font-bold ${categoryStyles[category].title}`}>
                {category}
              </h3>
            </div>
            
            <div className="space-y-3">
              {swotMap[category].length === 0 ? (
                <p className="text-gray-500 italic text-sm">No items added yet</p>
              ) : (
                swotMap[category].map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm mt-1">
                      <span className={`text-sm font-medium ${categoryStyles[category].title}`}>{idx + 1}</span>
                    </div>
                    <input
                      type="text"
                      className="flex-1 text-gray-700 border-b border-gray-300 bg-transparent w-full py-1 px-2 focus:outline-none focus:border-gray-500 transition-colors rounded-sm focus:bg-white/50"
                      value={point}
                      onChange={(e) => handleEdit(category, idx, e.target.value)}
                    />
                  </div>
                ))
              )}
              
              <button 
                onClick={() => handleAddItem(category)}
                className="mt-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add item
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SwotView;
