"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamically import chart components with SSR disabled
const HierarchyTree = dynamic(() => import("../charts/HierarchyGraph"), { ssr: false });
const BarChart      = dynamic(() => import("../charts/BarChart"),        { ssr: false });
const PieChart      = dynamic(() => import("../charts/PieChart"),        { ssr: false });
const LineChart     = dynamic(() => import("../charts/LineChart"),       { ssr: false });
const ListView      = dynamic(() => import("../charts/ListView"),        { ssr: false });
const QnAView       = dynamic(() => import("../charts/QnAView"),         { ssr: false });
// ...add others as needed

import { TreeNode, ChartJsData } from "../types";

interface Props {
  template: string;
  rawData: string;
}

export default function ChartRenderer({ template, rawData }: Props) {
  let listItems = rawData.split("\n").filter(Boolean);
  let json: any;
  try {
    json = JSON.parse(rawData);
  } catch {
    json = null;
  }

  switch (template) {
    case "Hierarchy":
      return json ? <HierarchyTree data={json as TreeNode} /> : <p>Invalid JSON Tree</p>;

    case "Bar Chart":
      return json ? <BarChart data={json as ChartJsData} /> : <p>Invalid Bar Data</p>;

    case "Pie Chart":
      return json ? <PieChart data={json as ChartJsData} /> : <p>Invalid Pie Data</p>;

    case "Line Chart":
      return <LineChart rawData={rawData} />;

    case "List":
      return <ListView items={listItems} />;

    case "Q&A":
      return <QnAView items={listItems} />;

    default:
      return <p className="text-center text-gray-500">Select a template</p>;
  }
}
