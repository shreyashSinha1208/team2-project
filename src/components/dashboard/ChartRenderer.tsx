"use client";

import React from "react";
import dynamic from "next/dynamic";


const HierarchyTree = dynamic(() => import("../charts/HierarchyTree"), {
  ssr: false,
});
const BarChart = dynamic(() => import("../charts/BarChart"), { ssr: false });
const PieChart = dynamic(() => import("../charts/PieChart"), { ssr: false });
const LineChart = dynamic(() => import("../charts/LineChart"), { ssr: false });
const ListView = dynamic(() => import("../charts/ListView"), { ssr: false });
const QnAView = dynamic(() => import("../charts/QnAView"), { ssr: false });
const TimelineGraph = dynamic(() => import("../charts/TimelineGraph"), {
  ssr: false,
});
const SwotView = dynamic(() => import("../charts/SwotView"), {ssr: false,});


import { TreeNode, ChartJsData } from "../types";

interface Props {
  template: string;
  rawData: string;
}
 
function parseIndentedTextToTree(text: string) {
  const lines = text.split("\n").filter(Boolean);
  const stack: any[] = [];
  let root = null;

  for (const line of lines) {
    const level = line.search(/\S/); 
    const name = line.trim();
    const node = { name, children: [] };

    while (stack.length && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    if (stack.length === 0) {
      root = node;
    } else {
      stack[stack.length - 1].node.children.push(node);
    }

    stack.push({ level, node });
  }

  return root;
}


export default function ChartRenderer({ template, rawData }: Props) {
  const listItems = rawData.split("\n").filter(Boolean);
  console.log("Raw data received:", rawData);

  let json: any = null;
  if (["Bar Chart", "Pie Chart", "Line Chart"].includes(template)) {
    try {
      json = JSON.parse(rawData);
    } catch (err) {
      console.error("JSON parsing failed:", err);
    }
  }

  switch (template) {
    case "Hierarchy":
      const tree = parseIndentedTextToTree(rawData);
      return tree ? (
        <HierarchyTree data={tree} />
      ) : (
        <p>Invalid Hierarchy Data</p>
      );

    case "Bar Chart":
      return json ? (
        <BarChart data={json as ChartJsData} />
      ) : (
        <p>Invalid Bar Data</p>
      );

    case "Pie Chart":
      return json ? (
        <PieChart data={json as ChartJsData} />
      ) : (
        <p>Invalid Pie Data</p>
      );

    case "Line Chart":
      return <LineChart rawData={rawData} />;

    case "List":
      return <ListView/>;

    case "Q&A":
      return <QnAView items={listItems} />;

    case "Timeline":
      // TimelineGraph now gets its data from the Redux store, so no 'data' prop is passed here.
      return <TimelineGraph />;

    case "Swot":
      return <SwotView />;

    default:
      return <p className="text-center text-gray-500">Select a template</p>;
  }
}