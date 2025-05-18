import React from "react";

export default function TimelineGraph({ data }: { data: string }) {
  return (
    <div className="p-4">
      <h3 className="font-semibold">Timeline View</h3>
      <pre className="mt-2 bg-white p-2 rounded border">{data}</pre>
    </div>
  );
}
