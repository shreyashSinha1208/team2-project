"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ChartJsData } from "@/components/types";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  rawData: string;
}

const LineChart: React.FC<LineChartProps> = ({ rawData }) => {
  let data: ChartJsData = {
    labels: [],
    datasets: [],
  };

  try {
    const parsedData = JSON.parse(rawData);
    data = parsedData;
  } catch (err) {
    console.error("Failed to parse line chart data:", err);
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 15,
        },
      },
      title: {
        display: true,
        text: data.datasets[0]?.label || "Monthly Sales Distribution",
        font: {
          size: 16,
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#666",
        },
      },
      y: {
        grid: {
          color: "#ddd",
          drawBorder: false,
        },
        ticks: {
          color: "#666",
        },
        min: Math.min(...(data.datasets?.[0]?.data || [0])) - 10,
        max: Math.max(...(data.datasets?.[0]?.data || [100])) + 10,
      },
    },
    elements: {
      line: {
        tension: 0.4, // Makes the line curved
      },
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
  };

  return (
    <div className="w-full h-[60vh] p-4 bg-white rounded-lg">
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
