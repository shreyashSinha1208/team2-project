"use client";

import React from "react";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

// Initialize FusionCharts only on client side
if (typeof window !== "undefined") {
  try {
    // Disable credits label
    FusionCharts.options.creditLabel = false;
    // Initialize core FusionCharts with basic charts
    ReactFusioncharts.fcRoot(FusionCharts, Charts, FusionTheme);
  } catch (error) {
    console.error("Error initializing FusionCharts:", error);
  }
}

interface BarChartProps {
  data: { [key: string]: number };
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  // Validate data
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="w-full h-full min-h-[400px] p-4 bg-white rounded-lg shadow-sm flex items-center justify-center">
        <p className="text-gray-500">No data available to display</p>
      </div>
    );
  }

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
        plotSpacePercent: "50",
        labelDisplay: "ROTATE",
        slantLabel: "1",
        labelStep: "1",
        rotateLabels: "1",
        placeValuesInside: "0",
        valueFontBold: "1",
        valueFontSize: "12",
        xAxisNamePadding: "20",
        yAxisNamePadding: "20",
        xAxisNameFontSize: "14",
        yAxisNameFontSize: "14",
        xAxisNameFontBold: "1",
        yAxisNameFontBold: "1",
        chartBottomMargin: "50",
        chartTopMargin: "20",
        chartLeftMargin: "20",
        chartRightMargin: "20",
      },
      data: chartData,
    },
  };

  try {
    const Chart = ReactFusioncharts as any;
    return (
      <div className="w-full h-full min-h-[400px] p-4 bg-white rounded-lg shadow-sm">
        <Chart {...chartConfigs} />
      </div>
    );
  } catch (error) {
    console.error("Error rendering chart:", error);
    return (
      <div className="w-full h-full min-h-[400px] p-4 bg-white rounded-lg shadow-sm flex items-center justify-center">
        <p className="text-red-500">Error rendering chart</p>
      </div>
    );
  }
};

export default BarChart;
