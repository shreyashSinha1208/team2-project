"use client";

import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie } from "react-chartjs-2";
import { ChartJsData } from "@/components/types";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface PieChartProps {
  data: ChartJsData;
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      title: {
        display: true,
        text: data.datasets[0]?.label || "Pie Chart",
        font: {
          size: 16,
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
      // Add plugin to display percentages in segments
      datalabels: {
        color: "#fff",
        font: {
          weight: "bold" as const,
          size: 12,
        },
        formatter: (value: number, ctx: any) => {
          const dataset = ctx.dataset;
          const total = dataset.data.reduce(
            (acc: number, data: number) => acc + data,
            0
          );
          const percentage = Math.round((value / total) * 100);
          return percentage + "%";
        },
        display: function (ctx: any) {
          return ctx.dataset.data[ctx.dataIndex] > 0;
        },
      },
    },
  };

  return (
    <div className="w-full h-[60vh] p-4">
      <Pie data={data} options={options} plugins={[ChartDataLabels]} />
    </div>
  );
};

export default PieChart;
