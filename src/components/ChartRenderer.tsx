"use client";

import React from "react";
import dynamic from "next/dynamic";
import ErrorMessage from "./ErrorMessage";

// Define chart data types
interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string[];
  borderColor?: string[];
  borderWidth?: number;
}

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

interface KnobData {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  color?: string;
}

// Dynamically import chart components with proper types
const BarChart = dynamic<{ data: ChartData }>(
  () => import("./charts/BarChart"),
  { ssr: false }
);
const PieChart = dynamic<{ data: ChartData }>(
  () => import("./charts/PieChart"),
  { ssr: false }
);
const DoughnutChart = dynamic<{ data: ChartData }>(
  () => import("./charts/DoughnutChart"),
  { ssr: false }
);
const KnobChart = dynamic<{ data: KnobData[] }>(
  () => import("./charts/KnobChart"),
  { ssr: false }
);
const LineChart = dynamic<{ data: ChartData }>(
  () => import("./charts/LineChart"),
  { ssr: false }
);

interface ChartRendererProps {
  chartType: string;
  data: string | ChartData | KnobData[];
}

const isChartData = (data: any): data is ChartData => {
  return (
    data &&
    Array.isArray(data.labels) &&
    Array.isArray(data.datasets) &&
    data.datasets.length > 0 &&
    data.datasets.every(
      (dataset: any) =>
        Array.isArray(dataset.data) && typeof dataset.label === "string"
    )
  );
};

const isKnobData = (data: any): data is KnobData[] => {
  return (
    Array.isArray(data) && data.every((item) => typeof item.value === "number")
  );
};

const ChartRenderer: React.FC<ChartRendererProps> = ({ chartType, data }) => {
  // Validate data
  if (!data) {
    return (
      <ErrorMessage
        title="No Data Provided"
        message="Please provide data for the chart."
      />
    );
  }

  try {
    // Parse data if it's a string
    const parsedData = typeof data === "string" ? JSON.parse(data) : data;

    // Validate parsed data structure
    if (!isChartData(parsedData) && !isKnobData(parsedData)) {
      return (
        <ErrorMessage
          title="Invalid Data Format"
          message="The provided data format is not valid for any chart type."
        />
      );
    }

    // Render appropriate chart based on type
    switch (chartType.toLowerCase()) {
      case "bar":
      case "pie":
      case "doughnut":
      case "line":
        if (!isChartData(parsedData)) {
          return (
            <ErrorMessage
              title="Invalid Data Format"
              message={`The provided data format is not valid for ${chartType} chart.`}
            />
          );
        }
        switch (chartType.toLowerCase()) {
          case "bar":
            return <BarChart data={parsedData} />;
          case "pie":
            return <PieChart data={parsedData} />;
          case "doughnut":
            return <DoughnutChart data={parsedData} />;
          case "line":
            return <LineChart data={parsedData} />;
        }
        break;

      case "knob":
        if (!isKnobData(parsedData)) {
          return (
            <ErrorMessage
              title="Invalid Data Format"
              message="The provided data format is not valid for Knob chart."
            />
          );
        }
        return <KnobChart data={parsedData} />;

      default:
        return (
          <ErrorMessage
            title="Invalid Chart Type"
            message={`Chart type '${chartType}' is not supported.`}
          />
        );
    }
  } catch (error) {
    console.error("Error rendering chart:", error);
    return (
      <ErrorMessage
        title="Chart Rendering Error"
        message={
          error instanceof Error
            ? error.message
            : "An error occurred while rendering the chart."
        }
      />
    );
  }
};

export default ChartRenderer;
