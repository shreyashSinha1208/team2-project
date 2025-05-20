"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { setItems } from "../store/dataSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

import TemplateSidebar from "@/components/dashboard/Sidebar";
import DataInput from "@/components/dashboard/DataInput";
import ChartRenderer from "@/components/dashboard/ChartRenderer";
import FooterToolbar from "@/components/FooterToolbar";

export default function DashboardPage() {
  const [template, setTemplate] = useState<string>("Hierarchy");
  const dispatch = useDispatch();

  // Use this only for templates that are not SWOT
  const [rawData, setRawData] = useState<string>("");

  const handleTemplateChange = (newTemplate: string) => {
    setTemplate(newTemplate);
    // Optional: clear Redux data when switching from SWOT
    // dispatch(clearItems());
  };

  const handleDataGenerated = (data: string) => {
    if (template === "Swot") {
      const lines = data.split('\n').map(line => line.trim()).filter(Boolean);
      dispatch(setItems(lines));
    } else {
      setRawData(data);
    }
  };

  return (
    <div className="flex h-screen">
      <TemplateSidebar
        selected={template}
        onSelect={handleTemplateChange}
        onDataGenerated={handleDataGenerated}
      />

      {template === "Swot" ? (
        <DataInput />
      ) : (
        <DataInput data={rawData} onChange={setRawData} />
      )}

      <div className="flex-1 flex flex-col bg-yellow-50 p-4">
        <div className="flex-1 overflow-auto">
          <ChartRenderer template={template} rawData={rawData} />
        </div>
        <FooterToolbar />
      </div>
    </div>
  );
}
