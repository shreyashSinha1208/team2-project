"use client";

import React from "react";
import { Search, Menu, List as ListIcon, Maximize } from "lucide-react";

interface Props {
  children?: React.ReactNode;
}

export default function FooterToolbar({ children }: Props) {
  return (
    <footer className="flex justify-end items-center gap-2 p-4 border-t bg-white">
      <button className="p-2 bg-white rounded border hover:bg-gray-100">
        <Search size={16}/>
      </button>
      <button className="p-2 bg-white rounded border hover:bg-gray-100">
        <Menu size={16}/>
      </button>
      <button className="p-2 bg-white rounded border hover:bg-gray-100">
        <ListIcon size={16}/>
      </button>
      <button className="p-2 bg-white rounded border hover:bg-gray-100">
        <Maximize size={16}/>
      </button>
      {children}
      <button className="px-4 py-2 bg-yellow-400 rounded hover:bg-yellow-500">
        Download
      </button>
    </footer>
  );
}
