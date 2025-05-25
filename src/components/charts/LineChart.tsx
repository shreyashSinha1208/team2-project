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

  // Initialize FusionCharts with ReactFusioncharts
  ReactFusioncharts.fcRoot(FusionCharts, Charts, FusionTheme);
}

// Default data - simple format
const defaultData = {
  Affordable: [140, 125, 120, 110, 105, 105, 115, 130, 145, 155, 160, 170],
  Luxury: [135, 120, 140, 133, 106, 106, 126, 140, 150, 160, 170, 180],
  SuperLuxury: [125, 135, 145, 155, 166, 166, 176, 150, 165, 170, 185, 190],
};

interface LineChartProps {
  data?: {
    [key: string]: number[];
  };
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  // Ensure we have data by using default if none provided
  const chartData = data && Object.keys(data).length > 0 ? data : defaultData;

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const categories = [
    {
      category: months.map((month) => ({ label: month })),
    },
  ];

  const colors = {
    Affordable: "#FF0000",
    Luxury: "#800000",
    SuperLuxury: "#4D0000",
  };

  const dataset = Object.entries(chartData).map(([key, values]) => ({
    seriesname: key.replace(/([A-Z])/g, " $1").trim(), // Add spaces before capital letters
    color: colors[key as keyof typeof colors] || "#FF0000",
    anchorBgColor: colors[key as keyof typeof colors] || "#FF0000",
    anchorBorderColor: colors[key as keyof typeof colors] || "#FF0000",
    data: values.map((value) => ({
      value: value.toString(),
    })),
  }));

  const chartConfigs = {
    type: "line",
    width: "100%",
    height: "400",
    dataFormat: "json",
    dataSource: {
      chart: {
        caption:
          "Monthly Sales Distribution Across Product Segments (Affordable, Luxury, Super Luxury)",
        xAxisName: "",
        yAxisName: "",
        theme: "fusion",
        labelDisplay: "normal",
        showValues: "0",
        drawAnchors: "1",
        anchorRadius: "4",
        anchorBorderThickness: "2",
        lineThickness: "2",
        connectNullData: "1",
        bgColor: "#FFFAF0",
        bgAlpha: "100",
        showBorder: "0",
        showCanvasBorder: "0",
        showAlternateHGridColor: "0",
        divLineColor: "#cccccc",
        divLineThickness: "1",
        divLineAlpha: "30",
        numVDivLines: "5",
        legendPosition: "top",
        legendBgAlpha: "0",
        legendBorderAlpha: "0",
        drawCustomLegendIcon: "1",
        legendIconBorderThickness: "2",
        legendIconBorderColor: "#666666",
        plotToolText: "<b>$seriesName</b><br>$label: $value",
        showHoverEffect: "1",
        plotHoverEffect: "1",
        plotFillHoverAlpha: "50",
        toolTipBgColor: "#000000",
        toolTipPadding: "8",
        toolTipBorderRadius: "4",
        toolTipBorderAlpha: "0",
        yAxisMaxValue: "200",
        yAxisMinValue: "100",
        numberSuffix: "",
        adjustDiv: "1",
        yAxisValuesPadding: "10",
        labelPadding: "10",
        baseFont: "Inter",
        baseFontSize: "12",
        baseFontColor: "#333333",
        outCnvBaseFont: "Inter",
        outCnvBaseFontSize: "12",
        outCnvBaseFontColor: "#333333",
      },
      categories,
      dataset,
    },
  };

  const Chart = ReactFusioncharts as any;
  return (
    <div className="bg-[#FFFAF0] p-4 rounded-lg">
      <Chart {...chartConfigs} />
    </div>
  );
};

export default LineChart;
