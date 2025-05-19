"use client";

import React from "react";
import { Pie } from "react-chartjs-2";
import { ChartJsData } from "@/components/types";

interface Props {
  data: ChartJsData;
}

export default function PieChart({ data }: Props) {
  return  <>
  <h1>qws</h1>< Pie data={data} options={{ maintainAspectRatio: false }} />;

  </>}
