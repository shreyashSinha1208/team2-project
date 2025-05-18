"use client";

import React from "react";
import { Line } from "react-chartjs-2";
import { ChartJsData } from "@/components/types";

interface Props {
  data: ChartJsData;
}

export default function LineChart({ data }: Props) {
  return <Line data={data} options={{ maintainAspectRatio: false }} />;
}
