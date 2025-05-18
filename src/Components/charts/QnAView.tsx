"use client";

import React from "react";

interface Props {
  items: string[];
}

export default function QnAView({ items }: Props) {
  return (
    <dl className="p-4">
      {items.map((line,i) => {
        const [q,a] = line.split(":");
        return (
          <div key={i} className="mb-2">
            <dt className="font-medium">{q?.trim()}</dt>
            <dd className="ml-4">{a?.trim()}</dd>
          </div>
        );
      })}
    </dl>
  );
}
