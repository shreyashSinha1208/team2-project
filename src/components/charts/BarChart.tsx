"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import { ChartJsData } from "@/components/types";

interface Props {
  data: ChartJsData;
}

export default function BarChart({ data }: Props) {
  return <Bar data={data} options={{ maintainAspectRatio: false }} />;
}
