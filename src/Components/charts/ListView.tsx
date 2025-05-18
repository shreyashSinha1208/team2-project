"use client";

import React from "react";

interface Props {
  items: string[];
}

export default function ListView({ items }: Props) {
  return (
    <ul className="list-disc list-inside p-4">
      {items.map((it,i) => <li key={i}>{it}</li>)}
    </ul>
  );
}
