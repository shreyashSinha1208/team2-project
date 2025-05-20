import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { setItems } from "@/app/store/dataSlice";

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

  const categoryStyles: Record<string, string> = {
    Strengths: "bg-green-100",
    Weaknesses: "bg-red-100",
    Opportunities: "bg-blue-100",
    Threats: "bg-yellow-100",
  };

  return (
    <div className="max-w-5xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {(Object.keys(swotMap) as (keyof typeof swotMap)[]).map((category) => (
        <div
          key={category}
          className={`rounded-xl shadow p-4 ${categoryStyles[category]} border border-gray-300`}
        >
          <h2 className="text-lg font-bold mb-2 bg-gray-800 text-white p-2 rounded">
            {category}
          </h2>
          <ul className="list-disc list-inside space-y-1">
            {swotMap[category].map((point, idx) => (
              <li key={idx}>
                <input
                  type="text"
                  className="border-b border-gray-400 bg-transparent w-full"
                  value={point}
                  onChange={(e) => handleEdit(category, idx, e.target.value)}
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
