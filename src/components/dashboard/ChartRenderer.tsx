"use client";

import React from "react";
import dynamic from "next/dynamic";
const ConceptMapper = dynamic(() => import("../charts/ConceptMapper"), {
  ssr: false,
});
const ProcedureDiagram = dynamic(() => import("../charts/ProcedureDiagram"), {
  ssr: false,
});
const KnobChart = dynamic(() => import("../charts/KnobChart"), { ssr: false });

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
const SwotView = dynamic(() => import("../charts/SwotView"), { ssr: false });
const DoughnutChart = dynamic(() => import("../charts/DoughnutChart"), {
  ssr: false,
});

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

// Add ErrorMessage component
const ErrorMessage = ({ message }: { message: string }) => (
  <div className="p-4 text-center">
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <p className="text-red-600">{message}</p>
      <p className="text-red-400 text-sm mt-2">
        Please check your data format and try again.
      </p>
    </div>
  </div>
);

export default function ChartRenderer({ template, rawData }: Props) {
  let json: any = null;
  if (
    [
      "Bar Chart",
      "Pie Chart",
      "Line Chart",
      "Doughnut Chart",
      "Knob Chart",
    ].includes(template)
  ) {
    try {
      json = JSON.parse(rawData);
    } catch (err) {
      console.error("JSON parsing failed:", err);
      return <ErrorMessage message={`Invalid ${template} data format`} />;
    }
  }

  switch (template) {
    case "Hierarchy":
      const tree = parseIndentedTextToTree(rawData);
      return tree ? (
        <HierarchyTree data={tree} />
      ) : (
        <ErrorMessage message="Invalid hierarchy data structure" />
      );

    case "Bar Chart":
      return json ? (
        <BarChart data={json as ChartJsData} />
      ) : (
        <ErrorMessage message="Invalid bar chart data" />
      );

    case "Pie Chart":
      return json ? (
        <PieChart data={json as ChartJsData} />
      ) : (
        <ErrorMessage message="Invalid pie chart data" />
      );

    case "Line Chart":
      return json ? (
        <LineChart rawData={rawData} />
      ) : (
        <ErrorMessage message="Invalid line chart data" />
      );

    case "List":
      return <ListView />;

    case "Q&A":
      return <QnAView />;

    case "Concept Mapper":
      return <ConceptMapper data={rawData} />;

    case "Procedure Diagram":
      return <ProcedureDiagram data={rawData} />;

    case "Timeline":
      return <TimelineGraph />;

    case "Swot":
      return <SwotView />;

    case "Doughnut Chart":
      return json ? (
        <DoughnutChart data={json as ChartJsData} />
      ) : (
        <ErrorMessage message="Invalid doughnut chart data" />
      );

    case "Knob Chart":
      return json ? (
        <KnobChart data={json} />
      ) : (
        <ErrorMessage message="Invalid knob chart data" />
      );

    default:
      return (
        <div className="p-4 text-center text-gray-500">
          Please select a template to begin
        </div>
      );
  }
}
