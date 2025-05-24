"use client";

import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface KnobChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor?: string[];
      borderWidth?: number;
    }>;
  };
}

const KnobChart: React.FC<KnobChartProps> = ({ data }) => {
  // Validate data structure
  if (!data || !data.labels || !data.datasets || !data.datasets[0]) {
    console.error("Invalid data structure:", data);
    return (
      <div className="w-full p-4 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">
            Error: Invalid data structure provided to KnobChart
          </p>
          <p className="text-red-400 text-sm mt-2">
            Please ensure your data includes labels and datasets.
          </p>
        </div>
      </div>
    );
  }

  // Function to create individual knob data
  const createKnobData = (value: number, color: string) => ({
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [value, 100 - value],
        backgroundColor: [color, "#f0f0f0"],
        borderWidth: 0,
        circumference: 360,
        rotation: -90,
      },
    ],
  });

  // Options for individual knobs
  const knobOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {data.datasets[0].label || "Internet Penetration Rates by Country"}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {data.labels.map((label, index) => {
          const value = data.datasets[0].data[index];
          const color = data.datasets[0].backgroundColor[index];

          if (typeof value !== "number" || isNaN(value)) {
            console.error(`Invalid value for ${label}:`, value);
            return null;
          }

          const knobData = createKnobData(value, color as string);

          return (
            <div key={label} className="relative flex flex-col items-center">
              <div className="w-32 h-32 relative">
                <Doughnut data={knobData} options={knobOptions} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-gray-800">
                      {value}%
                    </span>
                  </div>
                </div>
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KnobChart;
