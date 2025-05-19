"use client";

import React from "react";
import { Plus, Minus, RotateCcw } from "lucide-react";

export default function ZoomControls() {
  return (
    <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-yellow-300 rounded-r p-1 flex flex-col gap-1">
      <button className="p-2 bg-white rounded"><Plus size={16} /></button>
      <button className="p-2 bg-white rounded"><Minus size={16} /></button>
      <button className="p-2 bg-white rounded"><RotateCcw size={16} /></button>
    </div>
  );
}
