"use client";

import React from "react";
import { TreeNode, ChartJsData } from "@/components/types";
import HierarchyTree from "@/components/charts/HierarchyTree";
import BarChart from "@/components/charts/BarChart";
import PieChart from "@/components/charts/PieChart";
import LineChart from "@/components/charts/LineChart";
import ListView from "@/components/charts/ListView";
import QnAView from "@/components/charts/QnAView";
// …import other chart components

interface Props {
  template: string;
  rawData: string;
}

export default function ChartRenderer({ template, rawData }: Props) {
  // simplest parsing:
  let listItems = rawData.split("\n").filter(Boolean);
  let json: any;
  try {
    json = JSON.parse(rawData);
  } catch {
    json = null;
  }

  switch (template) {
    case "Hierarchy":
      return json ? (
        <HierarchyTree data={json as TreeNode} />
      ) : (
        <p>Invalid JSON Tree</p>
      );

    case "Bar Chart":
      // assume json is ChartJsData
      return json ? (
        <BarChart data={json as ChartJsData} />
      ) : (
        <p>Invalid Bar Data</p>
      );

    case "Pie Chart":
      return json ? (
        <PieChart data={json as ChartJsData} />
      ) : (
        <p>Invalid Pie Data</p>
      );

    case "Line Chart":
      return <LineChart rawData={rawData} />;

    case "List":
      return <ListView items={listItems} />;

    case "Q&A":
      return <QnAView items={listItems} />;

    // …other templates…

    default:
      return <p className="text-center text-gray-500">Select a template</p>;
  }
}
