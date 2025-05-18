// src/app/components/GraphRenderer.tsx
"use client";

import React from "react";
import HierarchyGraph from "../charts/HierarchyGraph";
import TimelineGraph  from "../charts/TimelineGraph";
import ListGraph      from "../charts/ListGraph";
import QnAGraph       from "../charts/QnAGraph";

interface GraphRendererProps {
  type: string;
  data: string;
}

export default function GraphRenderer({ type, data }: GraphRendererProps) {
  switch (type) {
    case "hierarchy":
      return <HierarchyGraph data={data} />;

    case "timeline":
      return <TimelineGraph data={data} />;

    case "list":
      return <ListGraph data={data} />;

    case "qna":
      return <QnAGraph data={data} />;

    default:
      return (
        <div className="p-4 text-gray-500">
          Select a graph type to render
        </div>
      );
  }
}
