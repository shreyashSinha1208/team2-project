"use client";

import React from "react";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

// Initialize FusionCharts only on client side
if (typeof window !== "undefined") {
  // Disable credits label
  FusionCharts.options.creditLabel = false;

  // Initialize core FusionCharts with basic charts
  ReactFusioncharts.fcRoot(FusionCharts, Charts, FusionTheme);
}

// Default data
const defaultData = {
  Norway: 99,
  United_States: 89,
  India: 54,
  Nigeria: 50,
  South_Africa: 72,
  Germany: 93,
  Brazil: 78,
};

interface KnobChartProps {
  data?: { [key: string]: number };
}

const KnobChart: React.FC<KnobChartProps> = ({ data }) => {
  // Ensure we have data by using default if none provided
  const chartData = data && Object.keys(data).length > 0 ? data : defaultData;

  // Create a donut chart for each data entry
  const charts = Object.entries(chartData).map(([label, value], index) => {
    // Calculate the remaining percentage for the donut
    const remaining = 100 - value;

    // Get color based on value
    const getColor = (val: number) => {
      if (val >= 70) return "#800026"; // Dark red for high values
      if (val >= 35) return "#BD0026"; // Medium red for medium values
      return "#E31A1C"; // Light red for low values
    };

    const chartConfigs = {
      type: "doughnut2d",
      width: "100%",
      height: "180",
      dataFormat: "json",
      dataSource: {
        chart: {
          showLabels: "0",
          showValues: "0",
          showPercentValues: "0",
          showLegend: "0",
          showToolTip: "0",
          defaultCenterLabel: `${label}\n${value}%`,
          centerLabelBold: "1",
          centerLabelFontSize: "12",
          centerLabelColor: "#333333",
          centerLabelFont: "Inter",
          doughnutRadius: "65",
          slicingDistance: "0",
          theme: "fusion",
          showBorder: "0",
          bgColor: "#FFFAF0", // Light yellow background
          plotBorderAlpha: "0",
          plotBorderColor: "#FFFFFF",
          use3DLighting: "0",
          enableSmartLabels: "0",
          startingAngle: "90",
          pieInnerRadius: "25",
          chartTopMargin: "0",
          chartBottomMargin: "0",
          chartLeftMargin: "0",
          chartRightMargin: "0",
        },
        data: [
          {
            label: "Filled",
            value: value,
            color: getColor(value),
            alpha: "100",
          },
          {
            label: "Remaining",
            value: remaining,
            color: "#FFFFFF",
            alpha: "40",
          },
        ],
      },
    };

    const Chart = ReactFusioncharts as any;

    return (
      <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-1">
        <div className="bg-[#FFFAF0] rounded-lg p-2">
          <Chart {...chartConfigs} />
        </div>
      </div>
    );
  });

  return (
    <div className="w-full p-2">
      <h2 className="text-xl font-semibold text-center mb-4 text-[#800026]">
        Internet Penetration Rates by Country
      </h2>
      <div className="flex flex-wrap -mx-1">{charts}</div>
    </div>
  );
};

export default KnobChart;
