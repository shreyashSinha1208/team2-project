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

interface PieChartProps {
  data?: { [key: string]: number };
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  // Ensure we have data by using default if none provided
  const chartData = data && Object.keys(data).length > 0 ? data : defaultData;

  // New vibrant color palette
  const colors = [
    "#2196F3", // Bright Blue
    "#FF5722", // Deep Orange
    "#4CAF50", // Green
    "#9C27B0", // Purple
    "#FFC107", // Amber
    "#00BCD4", // Cyan
    "#E91E63", // Pink
    "#3F51B5", // Indigo
  ];

  // Transform the data format to FusionCharts format
  const formattedData = Object.entries(chartData).map(
    ([label, value], index) => ({
      label,
      value,
      color: colors[index % colors.length],
    })
  );

  const chartConfigs = {
    type: "pie3d",
    width: "100%",
    height: "400",
    dataFormat: "json",
    dataSource: {
      chart: {
        caption: "Data Visualization",
        theme: "fusion",
        showPercentValues: "1",
        decimals: "1",
        useDataPlotColorForLabels: "1",
        baseFont: "Inter",
        baseFontSize: "14",
        baseFontColor: "#333333",
        showHoverEffect: "1",
        plotHoverEffect: "1",
        plotFillHoverAlpha: "80",
        showBorder: "0",
        bgColor: "#ffffff",
        showShadow: "1",
        use3DLighting: "1",
        showLegend: "1",
        legendPosition: "right",
        legendBorderAlpha: "0",
        legendShadow: "0",
        legendItemFontSize: "14",
        legendItemFontColor: "#666666",
        enableSmartLabels: "1",
        skipOverlapLabels: "1",
        showLabels: "1",
        showValues: "1",
        showPercentInTooltip: "1",
        toolTipColor: "#ffffff",
        toolTipBorderThickness: "0",
        toolTipBgColor: "#000000",
        toolTipBgAlpha: "80",
        toolTipBorderRadius: "4",
        toolTipPadding: "8",
        // Adjust margins for better spacing
        chartTopMargin: "20",
        chartBottomMargin: "20",
        chartLeftMargin: "20",
        chartRightMargin: "20",
      },
      data: formattedData,
    },
  };

  const Chart = ReactFusioncharts as any;

  return (
    <div className="w-full h-full min-h-[400px] p-4">
      <Chart {...chartConfigs} />
    </div>
  );
};

export default PieChart;
