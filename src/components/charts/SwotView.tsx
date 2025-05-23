import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { setItems } from "@/app/store/dataSlice";
import { motion } from "framer-motion";

const SwotView = () => {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.swot.items);

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

  const handleEdit = (category: string, idx: number, newValue: string) => {
    const newItems: string[] = [];
    Object.entries(swotMap).forEach(([cat, points]) => {
      newItems.push(cat);
      points.forEach((point, pIdx) => {
        if (cat === category && pIdx === idx) {
          newItems.push(`${pIdx + 1}. ${newValue}`);
        } else {
          newItems.push(`${pIdx + 1}. ${point}`);
        }
      });
    });
    dispatch(setItems(newItems));
  };

  const categoryStyles: Record<string, string> = {
    Strengths: "bg-green-50 border-green-200",
    Weaknesses: "bg-red-50 border-red-200",
    Opportunities: "bg-blue-50 border-blue-200",
    Threats: "bg-yellow-50 border-yellow-200",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      {(Object.keys(swotMap) as (keyof typeof swotMap)[]).map((category) => (
        <div
          key={category}
          className={`rounded-2xl shadow-md p-6 border ${categoryStyles[category]} transition hover:shadow-lg`}
        >
          <h2 className="text-xl font-bold mb-4 text-white p-3 rounded bg-gray-800 shadow-sm text-center">
            {category}
          </h2>
          <ul className="space-y-3">
            {swotMap[category].map((point, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-1 text-gray-600">•</span>
                <input
                  type="text"
                  value={point}
                  onChange={(e) => handleEdit(category, idx, e.target.value)}
                  className="w-full border-b border-gray-300 focus:outline-none focus:border-gray-600 bg-transparent py-1 px-1 transition"
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SwotView;
