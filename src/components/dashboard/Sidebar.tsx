"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Grid,
  Clock,
  List,
  MessageCircle,
  Layout,
  ChevronDown,
  X,
  Send,
  Sparkles,
  Loader2,
  LucideIcon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
} from "lucide-react";

interface Props {
  selected: string;
  onSelect: (t: string) => void;
  onDataGenerated?: (data: string) => void;
}

interface TemplateOption {
  key: string;
  icon: LucideIcon;
  description: string;
  color: string;
}

const options: TemplateOption[] = [
  { 
    key: "Hierarchy", 
    icon: Grid, 
    description: "Organize data in parent-child relationships", 
    color: "from-blue-400 to-blue-600" 
  },
  { 
    key: "Timeline", 
    icon: Clock, 
    description: "Visualize events in chronological order", 
    color: "from-purple-400 to-purple-600" 
  },
  { 
    key: "List", 
    icon: List, 
    description: "Display data in structured lists with headings", 
    color: "from-green-400 to-green-600" 
  },
  { 
    key: "Q&A", 
    icon: MessageCircle, 
    description: "Present information in question-answer format", 
    color: "from-amber-400 to-amber-600" 
  },
  { 
    key: "Pro", 
    icon: Layout, 
    description: "Advanced visualization and analysis", 
    color: "from-red-400 to-red-600" 
  },
  { 
    key: "Swot", 
    icon: Layout, 
    description: "Strengths, Weaknesses, Opportunities, Threats", 
    color: "from-indigo-400 to-indigo-600" 
  },
];

export default function TemplateSidebar({
  selected,
  onSelect,
  onDataGenerated,
}: Props) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState<TemplateOption | null>(null);

  // Filtered options based on search input
  const filteredOptions = options.filter(option => 
    option.key.toLowerCase().includes(filterText.toLowerCase()) ||
    option.description.toLowerCase().includes(filterText.toLowerCase())
  );

  // System prompt changes based on selected template
  const getSystemPrompt = () => {
    switch (selected) {
      case "Timeline":
        return `You are a historical timeline data generator. When given a historical topic, generate a timeline of key events in the format "year:event" with each event on a new line. Focus on the most significant events, and provide around 10-20 entries for a comprehensive but manageable timeline. Only provide the raw data in the year:event format, with no introduction or explanation.`;
      case "Q&A":
        return `You are a Q&A data generator. When given a topic, generate a series of questions and answers in the format "question?:answer" with each Q&A pair on a new line. Focus on the most important aspects of the topic, and provide around 5-10 Q&A pairs. Only provide the raw data in the question?:answer format, with no introduction or explanation.`;
      case "List":
        return `You are a list data generator. When given a topic, organize information into a structured list with headings and items. Format each heading line as "heading X" where X can be any text, followed by list items on separate lines. Use multiple headings to organize different aspects of the topic. Only provide the raw data in this format, with no introduction or explanation. Use Heading 1
hello
bello
Heading 2 format(heading text should be present before the actual heading)`;
      case "Hierarchy":
        return `You are a hierarchy data generator. When given a topic, create a hierarchical structure of concepts using indentation to show parent-child relationships. Items at the same indentation level have the same parent. Each level of indentation should use two additional spaces. Only provide the raw hierarchical data with proper indentation, with no introduction or explanation.`;
      case "Swot":
        return `You are a list data generator with 4 title [Strengths,Weekness,Opportunities,Threats]. When given a topic, create list on the 4 title above. Provide all the 4 title above, followed by list items with numbers on separate lines. Only provide the raw data in this format, with no introduction or explanation.`;
      default:
        return `You are a teacher. Give answers in an explanatory way`;
    }
  };

  const handleAIClick = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setResponse("");
    setError("");

    try {
      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [
              {
                role: "system",
                content: getSystemPrompt(),
              },
              {
                role: "user",
                content: prompt,
              },
            ],
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      const aiReply = data.choices?.[0]?.message?.content;
      setResponse(aiReply || "No response from AI.");

      // Success animation with confetti-like effect (visual feedback only)
      // This could be replaced with an actual confetti library like react-confetti

      // Pass the generated data to parent component if we're in a templated mode
      if (
        ["Timeline", "Q&A", "List", "Hierarchy", "Swot"].includes(selected) &&
        aiReply &&
        onDataGenerated
      ) {
        onDataGenerated(aiReply);
        // Auto-hide the prompt box after successful generation
        setTimeout(() => setShowPrompt(false), 1000);
      }
    } catch (err: any) {
      console.error(err);
      setError(
        "Error contacting AI. Please check your API key or try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // Auto-open the prompt box when certain templates are selected
  useEffect(() => {
    if (["Timeline", "Q&A", "List", "Hierarchy", "Swot"].includes(selected)) {
      setShowPrompt(true);
    }
  }, [selected]);

  // Get placeholder text based on selected template
  const getPlaceholderText = () => {
    switch (selected) {
      case "Timeline":
        return "Enter a historical topic (e.g., World War II, Industrial Revolution)...";
      case "Q&A":
        return "Enter a topic for Q&A generation (e.g., climate change, nutrition)...";
      case "List":
        return "Enter a topic for list generation (e.g., healthy foods, programming languages)...";
      case "Hierarchy":
        return "Enter a topic for hierarchy generation (e.g., animal classification, company structure)...";
      case "Swot":
        return "Enter a topic for SWOT analysis (e.g., business expansion, product launch)...";
      default:
        return "Enter your prompt...";
    }
  };

  // Get button text based on selected template
  const getButtonText = () => {
    if (loading) {
      return "Generating...";
    }
    
    switch (selected) {
      case "Timeline":
        return "Generate Timeline";
      case "Q&A":
        return "Generate Q&A";
      case "List":
        return "Generate List";
      case "Hierarchy":
        return "Generate Hierarchy";
      case "Swot":
        return "Generate SWOT Analysis";
      default:
        return "Ask AI";
    }
  };

  return (
    <motion.aside
      initial={{ width: 256 }}
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`${isCollapsed ? "w-16" : "w-64"} flex flex-col bg-gradient-to-b from-gray-900 to-blue-900 h-screen overflow-hidden relative`}
    >
      {/* Collapse toggle button */}
      <motion.button
        className="absolute top-2 right-2 z-10 text-white bg-blue-700 hover:bg-blue-600 rounded-full p-1"
        onClick={() => setIsCollapsed(!isCollapsed)}
        whileTap={{ scale: 0.9 }}
      >
        {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
      </motion.button>

      {/* Top nav */}
      <motion.div
        className="h-16 flex items-center justify-between px-4 border-b border-blue-800"
        layout
      >
        <motion.h2
          className="text-lg font-bold text-white"
          animate={{ opacity: isCollapsed ? 0 : 1 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500">
            Templates
          </span>
        </motion.h2>
        
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center space-x-2"
            >
              <motion.button
                onClick={() => setShowPrompt(!showPrompt)}
                className="flex items-center gap-1 text-yellow-300 text-sm hover:text-yellow-200 transition px-2 py-1 rounded-md border border-yellow-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles size={14} />
                Use AI
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* AI Prompt Box with smooth transition */}
      <AnimatePresence>
        {showPrompt && !isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 space-y-2 bg-blue-800 bg-opacity-30 border-b border-blue-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-yellow-300 flex items-center gap-1">
                  <Sparkles size={12} />
                  AI Assistant
                </span>
                <button
                  onClick={() => setShowPrompt(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="relative">
                <textarea
                  className="w-full p-3 border border-blue-700 rounded-lg bg-blue-950 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                  placeholder={getPlaceholderText()}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                />
                <motion.button
                  onClick={handleAIClick}
                  className="absolute bottom-2 right-2 bg-yellow-500 text-blue-900 rounded-full p-1.5 hover:bg-yellow-400"
                  disabled={loading}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </motion.button>
              </div>
              
              <motion.button
                onClick={handleAIClick}
                className={`w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white px-3 py-2 rounded-lg border border-blue-700 font-medium hover:from-blue-500 hover:to-blue-700 transition ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading && (
                  <Loader2 size={16} className="inline mr-2 animate-spin" />
                )}
                {getButtonText()}
              </motion.button>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-2 bg-red-900 border border-red-700 rounded-lg text-sm text-red-200"
                >
                  {error}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search / Filter */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 pt-4 pb-2"
          >
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-blue-700 bg-blue-950 text-white placeholder-blue-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Template options */}
      <div className={`flex-1 ${isCollapsed ? "px-1 py-2" : "px-4 py-4"} overflow-y-auto scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-transparent`}>
        <div className={`grid ${isCollapsed ? "" : "grid-cols-2"} gap-3`}>
          {filteredOptions.map((option) => (
            <motion.button
              key={option.key}
              onClick={() => onSelect(option.key)}
              className={`relative flex ${isCollapsed ? "flex-col" : option.key === selected ? "flex-row" : "flex-col"} items-center justify-center p-3 rounded-xl
                border ${option.key === selected ? "border-yellow-400" : "border-blue-700"}
                ${option.key === selected 
                  ? `bg-gradient-to-br ${option.color} shadow-lg` 
                  : "bg-blue-950 hover:bg-blue-900"} 
                transition-all duration-300`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onMouseEnter={() => {
                setTooltipContent(option);
                setShowTooltip(true);
              }}
              onMouseLeave={() => {
                setShowTooltip(false);
              }}
            >
              <option.icon size={isCollapsed ? 20 : 24} className={`${option.key === selected ? "text-white" : "text-blue-300"}`} />
              
              {(!isCollapsed || option.key === selected) && (
                <motion.span 
                  className={`${isCollapsed ? "hidden" : "block"} ${option.key === selected ? "mt-1 text-white" : "mt-2 text-blue-200"} text-sm font-medium`}
                  layout
                >
                  {option.key}
                </motion.span>
              )}
              
              {option.key === selected && (
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  layoutId="selectedDot"
                >
                  <span className="text-blue-900 text-xs">✓</span>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Template tooltip */}
      <AnimatePresence>
        {showTooltip && tooltipContent && !isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-4 left-4 right-4 bg-blue-950 border border-blue-700 rounded-lg p-3 shadow-xl z-50"
          >
            <h3 className="font-medium text-yellow-300 mb-1">{tooltipContent.key}</h3>
            <p className="text-sm text-blue-200">{tooltipContent.description}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current template indicator (when collapsed) */}
      {isCollapsed && (
        <div className="px-1 pb-4 text-center">
          <motion.div 
            className="text-xs text-white bg-blue-800 p-1 rounded-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {selected.substring(0, 1)}
          </motion.div>
        </div>
      )}
    </motion.aside>
  );
}