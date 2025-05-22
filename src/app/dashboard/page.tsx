"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setItems, setTimelineData } from "../store/dataSlice"; 
import { Inter } from "next/font/google";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", 
  display: "swap",
});

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
import {
  Sparkles,
  MoveDown,
  Wand2,
  Menu,
  X,
  LayoutDashboard,
  Zap,
  ArrowUpRight,
  ListFilter,
  BarChart3,
  Settings,
  LucideIcon, 
} from "lucide-react";
import TemplateSidebar from "@/components/dashboard/Sidebar";
import ChartRenderer from "@/components/dashboard/ChartRenderer";

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

interface NavItem {
  name: string;
  icon: LucideIcon;
  active?: boolean;
}

export default function DashboardPage() {
  const [template, setTemplate] = useState<string>("Hierarchy");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [animateChart, setAnimateChart] = useState(false);
  const dispatch = useDispatch();


  const [mounted, setMounted] = useState(false);

  const [isLargeScreen, setIsLargeScreen] = useState(false);

  const [rawData, setRawData] = useState<string>("");


  const navItems: NavItem[] = [
    { name: "Dashboard", icon: LayoutDashboard, active: true },
    { name: "Analytics", icon: BarChart3 },
    { name: "Templates", icon: ListFilter },
    { name: "Settings", icon: Settings }
  ];


  const handleTemplateChange = (newTemplate: string) => {
    setTemplate(newTemplate);
    setAnimateChart(true);
    setTimeout(() => setAnimateChart(false), 1000);
  };

  const handleDataGenerated = (data: string) => {
    setAnimateChart(true);
    setTimeout(() => setAnimateChart(false), 1000);

    if (template === "Swot") {
      const lines = data.split('\n').map(line => line.trim()).filter(Boolean);
      dispatch(setItems(lines));
    } else if (template === "Timeline") { 
      dispatch(setTimelineData(data)); 
    }
    else {
      setRawData(data); 
    }
   
  };

  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };


  useEffect(() => {
    setMounted(true); 

    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    handleResize(); 

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

 
  useEffect(() => {
    if (mounted) {
      setAnimateChart(true);
      setTimeout(() => setAnimateChart(false), 1200);
    }
  }, [mounted]); 

  const getTemplateColors = () => {
    switch (template) {
      case "Hierarchy":
        return {
          gradient: "from-indigo-400 to-indigo-600",
          accent: "bg-indigo-500",
          text: "text-indigo-500",
          border: "border-indigo-500",
          hoverBg: "hover:bg-indigo-100",
          lightBg: "bg-indigo-50"
        };
      case "Timeline":
        return {
          gradient: "from-violet-400 to-violet-600",
          accent: "bg-violet-500",
          text: "text-violet-500",
          border: "border-violet-500",
          hoverBg: "hover:bg-violet-100",
          lightBg: "bg-violet-50"
        };
      case "List":
        return {
          gradient: "from-emerald-400 to-emerald-600",
          accent: "bg-emerald-500",
          text: "text-emerald-500",
          border: "border-emerald-500",
          hoverBg: "hover:bg-emerald-100",
          lightBg: "bg-emerald-50"
        };
      case "Q&A":
        return {
          gradient: "from-amber-400 to-amber-600",
          accent: "bg-amber-500",
          text: "text-amber-500",
          border: "border-amber-500",
          hoverBg: "hover:bg-amber-100",
          lightBg: "bg-amber-50"
        };
      case "Pro":
        return {
          gradient: "from-rose-400 to-rose-600",
          accent: "bg-rose-500",
          text: "text-rose-500",
          border: "border-rose-500",
          hoverBg: "hover:bg-rose-100",
          lightBg: "bg-rose-50"
        };
      case "Swot":
        return {
          gradient: "from-sky-400 to-sky-600",
          accent: "bg-sky-500",
          text: "text-sky-500",
          border: "border-sky-500",
          hoverBg: "hover:bg-sky-100",
          lightBg: "bg-sky-50"
        };
      default: 
        return {
          gradient: "from-blue-400 to-blue-600",
          accent: "bg-blue-500",
          text: "text-blue-500",
          border: "border-blue-500",
          hoverBg: "hover:bg-blue-100",
          lightBg: "bg-blue-50"
        };
    }
  };

  const colors = getTemplateColors();


  return (
    <div className={`flex flex-col md:flex-row h-screen bg-slate-100 {inter.className}`}>
     
      <div className="hidden md:flex flex-col items-center w-16 bg-slate-900 border-r border-slate-800 py-6 space-y-8 shadow-xl z-30">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br bg-[#0790E8] flex items-center justify-center shadow-lg">
          <Zap size={20} className="text-white" />
        </div>

        <div className="flex flex-col gap-4 items-center">
          {navItems.map((item, index) => (
            <button
              key={index}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200
                ${item.active
                  ? 'bg-slate-700 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
              title={item.name} 
            >
              <item.icon size={20} />
            </button>
          ))}
        </div>
      </div>
      <div className="md:hidden flex justify-between items-center p-4 bg-slate-900 text-white shadow-lg z-20">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="font-semibold text-lg flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${colors.accent}`}></div> {/* Slightly larger dot */}
          {template}
        </div>
      </div>

      
      <AnimatePresence>
       
        {(sidebarOpen || (mounted && isLargeScreen)) && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="z-20 absolute md:relative md:block h-full shadow-2xl" // Added shadow
          >
            <TemplateSidebar
              selected={template}
              onSelect={handleTemplateChange}
              onDataGenerated={handleDataGenerated}
              onManualDataChange={setRawData} 
              currentRawData={rawData} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      
      <div className="flex-1 flex flex-col overflow-hidden h-full"> 
      
        <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
          <motion.div
            className="flex-1 flex flex-col bg-white rounded-xl shadow-lg overflow-hidden relative border border-slate-200"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
          >
           
            <div className={`bg-gradient-to-r ${colors.gradient} p-4 text-white rounded-t-xl flex justify-between items-center shadow-md`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm shadow-inner">
                  <Sparkles size={22} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    {template} Visualization
                  </h2>
                  <p className="text-sm text-white/80">Interactive data insights</p>
                </div>
              </div>

              <div className="hidden md:flex space-x-3">
                <button
                  onClick={() => setAnimateChart(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors text-sm font-medium"
                >
                  <Wand2 size={16} /> Animate
                </button>

               
              </div>
            </div>

           
            <motion.div
              className="flex-1 p-6 overflow-auto bg-white relative" 
              animate={animateChart ? {
                scale: [0.95, 1.02, 1],
                opacity: [0.5, 1]
              } : {}}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
            
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium flex items-center gap-1.5 border border-slate-200">
               
              </div>

            
              <ChartRenderer template={template} rawData={rawData} />
            </motion.div>

            
            <div className="border-t border-slate-100 p-4 bg-slate-50 flex justify-between items-center rounded-b-xl text-sm">
             
             
            </div>
          </motion.div>
        </div>
      </div>

  
    </div>
  );
}