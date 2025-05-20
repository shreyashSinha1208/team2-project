"use client";
import { useState, useEffect } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MoveDown, Wand2 } from "lucide-react";
import TemplateSidebar from "@/components/dashboard/Sidebar";
import DataInput from "@/components/dashboard/DataInput";
import ChartRenderer from "@/components/dashboard/ChartRenderer";
import FooterToolbar from "@/components/FooterToolbar";

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

export default function DashboardPage() {
  const [template, setTemplate] = useState<string>("Hierarchy");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDataInputVisible, setIsDataInputVisible] = useState(true);
  const [activeView, setActiveView] = useState<"data" | "chart">("chart");
  const [animateChart, setAnimateChart] = useState(false);
  const dispatch = useDispatch();
  
  // Use this only for templates that are not SWOT
  const [rawData, setRawData] = useState<string>("");

  const handleTemplateChange = (newTemplate: string) => {
    setTemplate(newTemplate);
    // Animate the chart when template changes
    setAnimateChart(true);
    setTimeout(() => setAnimateChart(false), 1000);
  };

  const handleDataGenerated = (data: string) => {
    // Show a brief animation when data is generated
    setAnimateChart(true);
    setTimeout(() => setAnimateChart(false), 1000);
    
    if (template === "Swot") {
      const lines = data.split('\n').map(line => line.trim()).filter(Boolean);
      dispatch(setItems(lines));
    } else {
      setRawData(data);
    }
    
    // Automatically switch to chart view when data is generated
    setActiveView("chart");
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Toggle data input visibility on mobile
  const toggleDataInput = () => {
    setIsDataInputVisible(!isDataInputVisible);
  };

  // Effect for initial animation
  useEffect(() => {
    setAnimateChart(true);
    setTimeout(() => setAnimateChart(false), 1000);
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-blue-50 to-yellow-50">
      {/* Mobile Toolbar */}
      <div className="md:hidden flex justify-between items-center p-2 bg-blue-900 text-white">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-blue-800 hover:bg-blue-700 transition-colors"
        >
          {sidebarOpen ? "✕" : "☰"} Templates
        </button>
        
        <div className="font-bold text-lg">
          {template} Dashboard
        </div>
        
        <button 
          onClick={() => setActiveView(activeView === "data" ? "chart" : "data")}
          className="p-2 rounded-lg bg-blue-800 hover:bg-blue-700 transition-colors"
        >
          {activeView === "data" ? "📊 View" : "✏️ Edit"}
        </button>
      </div>

      {/* Sidebar with animation */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 768) && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="z-20 absolute md:relative md:block h-full"
          >
            <TemplateSidebar
              selected={template}
              onSelect={handleTemplateChange}
              onDataGenerated={handleDataGenerated}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-full">
        {/* Data Input Section - Hidden on mobile when viewing chart */}
                <AnimatePresence>
                  {(isDataInputVisible && (activeView === "data" || window.innerWidth >= 768)) && (
                    <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 shadow-lg h-full"
        >

              {template === "Swot" ? (
                <DataInput />
              ) : (
                <DataInput data={rawData} onChange={setRawData} />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chart Visualization Section */}
        <motion.div 
          className="flex-1 flex flex-col bg-white rounded-lg m-2 shadow-xl overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ minHeight: "calc(100vh - 16px)" }}
        >
          {/* Chart Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-3 text-white rounded-t-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Sparkles size={20} className="text-yellow-300" />
                {template} Visualization
              </h2>
              
              <div className="hidden md:flex space-x-2">
                <button 
                  onClick={() => setAnimateChart(true)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded-md transition-colors text-sm"
                >
                  <Wand2 size={14} /> Animate
                </button>
                
                <button className="flex items-center gap-1 px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded-md transition-colors text-sm">
                  <MoveDown size={14} /> Export
                </button>
              </div>
            </div>
          </div>
          
          {/* Chart Content */}
          <motion.div 
            className="flex-1 p-4 overflow-auto"
            animate={animateChart ? { scale: [0.9, 1.02, 1] } : {}}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <ChartRenderer template={template} rawData={rawData} />
          </motion.div>
          
          {/* Chart Footer */}
          <FooterToolbar />
        </motion.div>
      </div>
      
      {/* Mobile Data/Chart Toggle Button */}
      <div className="md:hidden fixed bottom-16 right-4 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveView(activeView === "data" ? "chart" : "data")}
          className="w-14 h-14 rounded-full bg-blue-800 text-white shadow-lg flex items-center justify-center"
        >
          {activeView === "data" ? "📊" : "✏️"}
        </motion.button>
      </div>
    </div>
  );
}