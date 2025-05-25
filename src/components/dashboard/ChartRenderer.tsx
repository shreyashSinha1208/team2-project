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
// const SwotView = dynamic(() => import("../charts/SwotView"), {ssr: false,});
const FlashcardView = dynamic(() => import("../charts/FlashcardView"), {
  ssr: false,
});
const MindfullnesscardView = dynamic(
  () => import("../charts/MindfullnesscardView"),
  { ssr: false }
);

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

function parseKeyValueData(rawData: string) {
  try {
    // Split by newlines and filter out empty lines
    const lines = rawData.split("\n").filter((line) => line.trim());

    // Convert to object
    const data: { [key: string]: number } = {};
    lines.forEach((line) => {
      const [key, value] = line.split(":").map((part) => part.trim());
      if (key && value) {
        data[key] = Number(value);
      }
    });

    return Object.keys(data).length > 0 ? data : null;
  } catch (err) {
    console.error("Data parsing failed:", err);
    return null;
  }
}

// Add ErrorMessage component with example format
const ErrorMessage = ({
  message,
  template,
}: {
  message: string;
  template?: string;
}) => (
  <div className="p-4 text-center">
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <p className="text-red-600">{message}</p>
      {template === "Line Chart" ? (
        <div className="mt-4 text-left bg-gray-50 p-4 rounded">
          <p className="text-gray-600 mb-2">Expected format:</p>
          <pre className="text-sm text-gray-700">
            Affordable:140,125,120,110,105,105,115,130,145,155,160,170{"\n"}
            Luxury:135,120,140,133,106,106,126,140,150,160,170,180{"\n"}
            SuperLuxury:125,135,145,155,166,166,176,150,165,170,185,190
          </pre>
        </div>
      ) : (
        (template === "Bar Chart" ||
          template === "Pie Chart" ||
          template === "Doughnut Chart") && (
          <div className="mt-4 text-left bg-gray-50 p-4 rounded">
            <p className="text-gray-600 mb-2">Expected format:</p>
            <pre className="text-sm text-gray-700">
              Norway: 99{"\n"}
              United_States: 89{"\n"}
              India: 54{"\n"}
              Nigeria: 50
            </pre>
          </div>
        )
      )}
    </div>
  </div>
);

export default function ChartRenderer({ template, rawData }: Props) {
  // Set default data for Line Chart when it's selected and no data is provided
  if (template === "Line Chart" && !rawData.trim()) {
    rawData =
      "Affordable:140,125,120,110,105,105,115,130,145,155,160,170\nLuxury:135,120,140,133,106,106,126,140,150,160,170,180\nSuperLuxury:125,135,145,155,166,166,176,150,165,170,185,190";
  }

  let json: any = null;

  if (
    ["Bar Chart", "Pie Chart", "Line Chart", "Doughnut Chart"].includes(
      template
    )
  ) {
    // Try parsing as key:value format first
    json = parseKeyValueData(rawData);

    // If that fails, try parsing as JSON as fallback
    if (!json) {
      try {
        json = JSON.parse(rawData);
      } catch (err) {
        console.error("JSON parsing failed:", err);
        return (
          <ErrorMessage
            message={`Invalid ${template} data format`}
            template={template}
          />
        );
      }
    }
  } else if (template === "Knob Chart") {
    try {
      json = JSON.parse(rawData);
    } catch (err) {
      console.error("JSON parsing failed:", err);
      return <ErrorMessage message="Invalid Knob Chart data format" />;
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
      const chartData = json && Object.keys(json).length > 0 ? json : null;
      return chartData ? (
        <BarChart label={json.label || "Chart"} data={chartData} />
      ) : (
        <ErrorMessage
          message="Please enter data in key: value format"
          template={template}
        />
      );

    case "Pie Chart":
      const pieChartData = json && Object.keys(json).length > 0 ? json : null;
      return pieChartData ? (
        <PieChart data={pieChartData} />
      ) : (
        <ErrorMessage
          message="Please enter data in key: value format"
          template={template}
        />
      );

    case "Line Chart":
      // Parse the data format data:value1,value2,value3
      const lineChartData: { [key: string]: number[] } = {};
      rawData.split("\n").forEach((line) => {
        const [key, values] = line.split(":");
        if (key && values) {
          lineChartData[key.trim()] = values.split(",").map(Number);
        }
      });

      return Object.keys(lineChartData).length > 0 ? (
        <LineChart data={lineChartData} />
      ) : (
        <ErrorMessage
          message="Please enter data in format: data:value1,value2,value3"
          template={template}
        />
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

    case "Flashcard":
      return <FlashcardView />;

    case "Mindfullness":
      return <MindfullnesscardView />;
    case "Doughnut Chart":
      const doughnutChartData =
        json && Object.keys(json).length > 0 ? json : null;
      return doughnutChartData ? (
        <DoughnutChart data={doughnutChartData} />
      ) : (
        <ErrorMessage
          message="Please enter data in key: value format"
          template={template}
        />
      );

    case "Knob Chart":
      const knobChartData = json && Object.keys(json).length > 0 ? json : null;
      return knobChartData ? (
        <KnobChart data={knobChartData} />
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
