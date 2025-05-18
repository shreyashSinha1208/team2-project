import React from "react";

export default function ListGraph({ data }: { data: string }) {
  const items = data.split("\n").filter(Boolean);
  return (
    <div className="p-4">
      <h3 className="font-semibold">List View</h3>
      <ul className="list-disc list-inside mt-2">
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  );
}
