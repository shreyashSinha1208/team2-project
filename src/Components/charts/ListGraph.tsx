import React from "react";

export default function ListView({ data }) {
  const groups = data.trim().split(/\n\s*\n/);

  return (
    <div className="p-4">
      {groups.map((group, i) => {
        const lines = group.split("\n").filter(Boolean);
        const heading = lines[0];
        const subpoints = lines.slice(1);

        return (
          <div key={i} className="mb-6">
            {/* Heading: no bullet, left aligned */}
            <h3 className="font-semibold">{heading}</h3>

            {/* Subpoints: bulleted list, indented by padding on ul */}
            <ul className="list-disc ml-8 mt-2">
              {subpoints.map((sub: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined, idx: React.Key | null | undefined) => (
                <li key={idx}>{sub}</li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
