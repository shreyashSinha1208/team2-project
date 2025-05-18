import React from "react";

export default function QnAGraph({ data }: { data: string }) {
  const lines = data.split("\n").filter(Boolean);
  return (
    <div className="p-4">
      <h3 className="font-semibold">Q&A View</h3>
      <dl className="mt-2">
        {lines.map((line, i) => {
          const [q, a] = line.split(":");
          return (
            <div key={i} className="mb-2">
              <dt className="font-medium">{q?.trim()}</dt>
              <dd className="ml-4">{a?.trim()}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
