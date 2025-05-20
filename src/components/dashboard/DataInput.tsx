// components/dashboard/DataInput.tsx
"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { setItems } from "@/app/store/dataSlice";

interface DataInputProps {
  data?: string; // optional
  onChange?: (value: string) => void; // optional
}

const DataInput: React.FC<DataInputProps> = ({ data, onChange }) => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state: RootState) => state.swot.items.join("\n"));

  const handleChange = (val: string) => {
    if (onChange) {
      onChange(val); // for non-SWOT templates
    } else {
      const lines = val.split("\n").map((line) => line.trim()).filter(Boolean);
      dispatch(setItems(lines)); // for SWOT
    }
  };

  const textareaValue = data !== undefined ? data : reduxData;

  return (
    <div className="w-64 p-4 bg-white border-r flex flex-col h-full">
      <div className="flex space-x-2 mb-2">
        {/* <button>📋</button>
        <button>↔️</button>
        <button>🗑️</button>
        <button>❓</button>
        <button>🔤</button>
        <button>⤢</button>
        <button>🔍</button> */}
      </div>
              <textarea
          className="w-full h-full resize-none border rounded p-4 focus:outline-none"
          value={textareaValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={`• item1\n• item2\n...`}
        />

    </div>
  );
};

export default DataInput;
