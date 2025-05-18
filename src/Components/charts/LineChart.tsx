"use client";

import React from "react";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import ReactFC from "react-fusioncharts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

interface Props {
  rawData: string;
}

export default function LineChart({ rawData }: Props) {
  const parsedData = rawData
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.includes(":"))
    .map(line => {
      const [label, value] = line.split(":");
      return {
        label: label.trim(),
        value: value.trim()
      };
    });

  const chartConfigs = {
    type: "line",
    width: "100%",
    height: 400,
    dataFormat: "json",
    dataSource: {
      chart: {
        caption: "Line Chart",
        xAxisName: "Label",
        yAxisName: "Value",
        theme: "fusion",
      },
      data: parsedData,
    }
  };

  return <ReactFC {...chartConfigs} />;
}
