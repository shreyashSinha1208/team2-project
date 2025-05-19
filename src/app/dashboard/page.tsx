"use client";

import { useState } from "react";

// register Chart.js modules:
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
import DataInput       from "@/components/dashboard/DataInput";
import ChartRenderer from "@/components/dashboard/ChartRenderer";
import ZoomControls    from "@/components/dashboard/ZoomControls";
import FooterToolbar   from "@/components/FooterToolbar";

export default function DashboardPage() {

  const [template, setTemplate] = useState<string>("Hierarchy");
  const [rawData, setRawData]   = useState<string>("");

  return (
    <div className="flex h-screen">
      <TemplateSidebar selected={template} onSelect={setTemplate} />
      <DataInput data={rawData} onChange={setRawData} />
      <div className="flex-1 flex flex-col bg-yellow-50 p-4">
        {/* <ZoomControls /> */}
        <div className="flex-1 overflow-auto">
          <ChartRenderer template={template} rawData={rawData} />
        </div>
        <FooterToolbar />
      </div>
    </div>
  );
}
