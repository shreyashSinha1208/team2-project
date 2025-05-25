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

interface BarChartProps {
  label?: string; // Made optional since we'll get it from data
  data: { [key: string]: number }; // This allows direct key-value pairs
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
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

  // Transform the simple data format to FusionCharts format
  const chartData = Object.entries(data).map(([label, value], index) => ({
    label,
    value,
    color: colors[index % colors.length],
  }));

  const chartConfigs = {
    type: "column3d",
    width: "100%",
    height: "400",
    dataFormat: "json",
    dataSource: {
      chart: {
        caption: "Data Visualization",
        xAxisName: "Categories",
        yAxisName: "Values",
        theme: "fusion",
        showValues: "1",
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
        canvasBgColor: "#ffffff",
        canvasBorderAlpha: "0",
        divLineAlpha: "100",
        divLineColor: "#999999",
        divLineThickness: "1",
        divLineIsDashed: "1",
        divLineDashLen: "1",
        divLineGapLen: "1",
        showAlternateHGridColor: "0",
        toolTipColor: "#ffffff",
        toolTipBorderThickness: "0",
        toolTipBgColor: "#000000",
        toolTipBgAlpha: "80",
        toolTipBorderRadius: "4",
        toolTipPadding: "8",
        plotGradientColor: "", // Remove gradient
        usePlotGradientColor: "0", // Disable gradient effect
        // Add spacing between bars
        plotSpacePercent: "50", // Space between bars (0-100)
        // Improve label positioning and styling
        labelDisplay: "ROTATE", // ROTATE, WRAP, STAGGER
        slantLabel: "1", // Slant the labels for better readability
        labelStep: "1", // Show all labels
        rotateLabels: "1",
        placeValuesInside: "0", // Place values outside the bars
        valueFontBold: "1",
        valueFontSize: "12",
        xAxisNamePadding: "20", // Add padding to X-axis name
        yAxisNamePadding: "20", // Add padding to Y-axis name
        xAxisNameFontSize: "14",
        yAxisNameFontSize: "14",
        xAxisNameFontBold: "1",
        yAxisNameFontBold: "1",
        // Adjust margins for better spacing
        chartBottomMargin: "50",
        chartTopMargin: "20",
        chartLeftMargin: "20",
        chartRightMargin: "20",
      },
      data: chartData,
    },
  };

  const Chart = ReactFusioncharts as any;

  return (
    <div className="w-full h-full min-h-[400px] p-4">
      <Chart {...chartConfigs} />
    </div>
  );
};

export default BarChart;
