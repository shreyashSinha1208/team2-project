"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch and useSelector
import { RootState } from "@/app/store/store"; // Import RootState
import { setItems, setTimelineData, setListViewData } from "@/app/store/dataSlice"; // Import Redux actions

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
  Settings,
  Star,
  Zap,
  FileText,
  Database,
} from "lucide-react";
import { set } from "date-fns";

interface Props {
  selected: string;
  onSelect: (t: string) => void;
  onDataGenerated?: (data: string) => void; // For AI generated data
  onManualDataChange?: (data: string) => void; // New prop for manually typed data in other templates
  currentRawData: string; // New prop to receive current rawData from DashboardPage
}

interface TemplateOption {
  key: string;
  icon: LucideIcon;
  description: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
}

const options: TemplateOption[] = [
  {
    key: "Hierarchy",
    icon: Grid,
    description: "Organize data in parent-child relationships",
    color: "bg-indigo-500",
    gradientFrom: "from-indigo-400",
    gradientTo: "to-indigo-600",
  },
  {
    key: "Timeline",
    icon: Clock,
    description: "Visualize events in chronological order",
    color: "bg-violet-500",
    gradientFrom: "from-violet-400",
    gradientTo: "to-violet-600",
  },
  {
    key: "List",
    icon: List,
    description: "Display data in structured lists with headings",
    color: "bg-emerald-500",
    gradientFrom: "from-emerald-400",
    gradientTo: "to-emerald-600",
  },
  {
    key: "Q&A",
    icon: MessageCircle,
    description: "Present information in question-answer format",
    color: "bg-amber-500",
    gradientFrom: "from-amber-400",
    gradientTo: "to-amber-600",
  },
  {
    key: "Pro",
    icon: Star,
    description: "Advanced visualization and analysis",
    color: "bg-rose-500",
    gradientFrom: "from-rose-400",
    gradientTo: "to-rose-600",
  },
  {
    key: "Swot",
    icon: Layout,
    description: "Strengths, Weaknesses, Opportunities, Threats",
    color: "bg-sky-500",
    gradientFrom: "from-sky-400",
    gradientTo: "to-sky-600",
  },
];

export default function TemplateSidebar({
  selected,
  onSelect,
  onDataGenerated,
  onManualDataChange, // New prop
  currentRawData, // New prop
}: Props) {
  const dispatch = useDispatch();
  const swotItems = useSelector((state: RootState) => state.swot.items);
  const timelineReduxData = useSelector(
    (state: RootState) => state.swot.timelineData
  );
  const listViewReduxData = useSelector(
    (state: RootState) => state.swot.listViewData
  );

  const [showPrompt, setShowPrompt] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState<TemplateOption | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"templates" | "data">("templates");

  // Local state for the manual data input textarea
  const [manualInputText, setManualInputText] = useState<string>("");

  // Effect to synchronize manualInputText with Redux state or currentRawData
  useEffect(() => {
    if (activeTab === "data") {
      if (selected === "Swot") {
        setManualInputText(swotItems.join("\n"));
      } else if (selected === "Timeline") {
        setManualInputText(timelineReduxData);
      } else if (selected === "List") {
        setManualInputText(listViewReduxData);
      }
      else {
        // For other templates, use the currentRawData passed from DashboardPage
        setManualInputText(currentRawData);
      }
    }
  }, [activeTab, selected, swotItems, timelineReduxData, listViewReduxData, currentRawData]);

  // Filtered options based on search input
  const filteredOptions = options.filter(
    (option) =>
      option.key.toLowerCase().includes(filterText.toLowerCase()) ||
      option.description.toLowerCase().includes(filterText.toLowerCase())
  );

  // System prompt changes based on selected template
  const getSystemPrompt = () => {
    switch (selected) {
      case "Timeline":
        return `You are a historical timeline data generator. When given a historical topic, generate a timeline of key events in the format "year:event" with each event on a new line. Focus on the most significant events, and provide around 10-20 entries for a comprehensive but manageable timeline. Only provide the raw data in the year:event format, with no introduction or explanation. Ensure all leading spaces are trimmed. Be precise and concise. Example format:
1945:World War II ended
1969:First human landed on the Moon`;

      case "Q&A":
        return `You are a Q&A data generator. When given a topic, generate a series of questions and answers in the format "question?:answer" with each Q&A pair on a new line. Focus on the most important aspects of the topic, and provide around 5-10 Q&A pairs. Only provide the raw data in the question?:answer format, with no introduction or explanation. Ensure all leading spaces are trimmed. Be precise and concise. Example format:
What are you?:I am a bird
Where do you live?:In the sky`;

      case "List":
        return `You are a list data generator. When given a topic, organize information into a structured list with headings and items. Format each heading line as "Heading X" where X is the heading text, followed by list items on separate lines. Use multiple headings to organize different aspects of the topic. Only provide the raw data in this format, with no introduction or explanation. Ensure all leading spaces are trimmed. Be precise and concise. Example format:
Heading Animals.
Cat
Dog
Elephant
Heading Birds.
Sparrow
Eagle`;

      case "Hierarchy":
        return `You are a hierarchy data generator. When given a topic, create a hierarchical structure of concepts using indentation to show parent-child relationships. Items at the same indentation level have the same parent. Each level of indentation should use two additional spaces. Only provide the raw hierarchical data with proper indentation, with no introduction or explanation. Ensure all leading spaces are trimmed except indentation for structure. Be precise and concise. Example format:
Animal
  Mammal
    Dog
    Cat
  Bird
    Sparrow
    Eagle`;

      case "Swot":
        return `You are a list data generator with 4 titles: [Strengths, Weaknesses, Opportunities, Threats]. When given a topic, create a list under each of the 4 titles. Provide all four titles, each followed by numbered list items on separate lines. Only provide the raw data in this format, with no introduction or explanation. Ensure all leading spaces are trimmed. Be precise and concise. Example format:
Strengths
1. High efficiency
2. Strong team

Weaknesses
1. Limited budget
2. Small market share

Opportunities
1. Growing demand
2. New markets

Threats
1. Competitors
2. Economic downturn`;

      default:
        return `You are a teacher. Provide clear and explanatory answers. Ensure all leading spaces are trimmed and avoid unnecessary details.`;
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

      // Pass the generated data to parent component if we're in a templated mode
      if (
        ["Timeline", "Q&A", "List", "Hierarchy", "Swot"].includes(selected) &&
        aiReply &&
        onDataGenerated
      ) {
        onDataGenerated(aiReply);
        // Also update the manual input text with AI response
        setManualInputText(aiReply);
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
  // This useEffect might be less relevant now that AI is in Data tab,
  // but keeping it for now in case there's a specific flow intended.
  useEffect(() => {
    if (["Timeline", "Q&A", "List", "Hierarchy", "Swot"].includes(selected)) {
      // You might want to setActiveTab("data") here if the intent is to always
      // switch to data tab when a templated chart is selected.
      // setShowPrompt(true); // This would auto-open the AI prompt box
    }
  }, [selected]);

  // Get placeholder text based on selected template (for AI prompt)
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

  // Get button text based on selected template (for AI generate button)
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

  // Get data input placeholder text based on selected template (for manual input textarea)
  const getDataInputPlaceholder = () => {
    switch (selected) {
      case "Timeline":
        return `Format: year:event description

Example:
1945:World War II ended
1969:First human landed on the Moon
1989:Berlin Wall fell
2001:September 11 attacks occurred
2008:Global financial crisis began

Enter your timeline data above...`;

      case "Q&A":
        return `Format: question?:answer

Example:
What is photosynthesis?:The process by which plants convert light into energy
How do birds fly?:By flapping their wings to create lift and thrust
Why is the sky blue?:Due to scattering of light by molecules in the atmosphere
When did dinosaurs live?:Primarily during the Mesozoic Era, 252-66 million years ago

Enter your Q&A pairs above...`;

      case "List":
        return `Format: Heading followed by items

Example:
Heading Fruits.
Apple
Banana
Orange
Mango
Heading Vegetables.
Carrot
Broccoli
Spinach
Tomato

Enter your list data above...`;

      case "Hierarchy":
        return `Format: Use indentation (2 spaces per level) to show parent-child relationships

Example:
Technology
  Software
    Web Development
      HTML
      CSS
      JavaScript
    Mobile Development
      iOS
      Android
  Hardware
    Processors
    Memory

Enter your hierarchy data above...`;

      case "Swot":
        return `Format: Four sections with numbered items

Strengths
1. High efficiency
2. Strong team
3. Good reputation

Weaknesses
1. Limited budget
2. Small market share
3. Outdated technology

Opportunities
1. Growing demand
2. New markets
3. Strategic partnerships

Threats
1. Strong competitors
2. Economic downturn
3. Regulatory changes

Enter your SWOT analysis above...`;

      case "Pro":
        return `Enter your advanced data for professional analysis...

You can use any format that suits your analysis needs.`;

      default:
        return `Enter your data here...

The format will depend on your selected template.`;
    }
  };

  // Find the selected option
  const selectedOption =
    options.find((option) => option.key === selected) || options[0];

  // Handle data input change for the textarea in Data Input tab
  const handleManualInputChange = (value: string) => {
    setManualInputText(value); // Update local state immediately

    if (selected === "Swot") {
      const lines = value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      dispatch(setItems(lines));
    } else if (selected === "Timeline") {
      dispatch(setTimelineData(value))
    } else if (selected === "List") {
      dispatch(setListViewData(value));
    } else if (onManualDataChange) {
      // For other templates, pass the value up to DashboardPage
      onManualDataChange(value);
    }
  };

  return (
    <motion.aside
      initial={{ width: 320 }}
      animate={{ width: isCollapsed ? 80 : 320 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`${
        isCollapsed ? "w-20" : "w-80"
      } flex flex-col bg-slate-950 h-screen overflow-hidden relative border-r border-slate-800 shadow-xl`}
    >
      {/* Gradient overlay at the top */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-indigo-900/30 to-transparent pointer-events-none z-0"></div>

      {/* Collapse toggle button */}
      <motion.button
        className="absolute top-4 right-4 z-10 text-white bg-slate-800 hover:bg-slate-700 rounded-full p-2 shadow-lg"
        onClick={() => setIsCollapsed(!isCollapsed)}
        whileTap={{ scale: 0.9 }}
      >
        {isCollapsed ? (
          <PanelLeftOpen size={18} />
        ) : (
          <PanelLeftClose size={18} />
        )}
      </motion.button>

      {/* Top nav */}
      <motion.div
        className="h-20 flex items-center px-6 border-b border-slate-800/80 relative z-10"
        layout
      >
        <motion.div
          className="flex items-center space-x-3"
          animate={{ opacity: isCollapsed ? 0 : 1 }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br bg-[#0790e8] shadow-md">
            <Zap size={22} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Dashboard
          </h2>
        </motion.div>
      </motion.div>

      {/* Tab Navigation */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 pt-4 pb-2"
          >
            <div className="flex bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
              <button
                onClick={() => setActiveTab("templates")}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === "templates"
                    ? "bg-[#0790E8] text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <FileText size={16} />
                Templates
              </button>
              <button
                onClick={() => setActiveTab("data")}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === "data"
                    ? "bg-[#0790E8] text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <Database size={16} />
                Data Input
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content based on active tab */}
      <AnimatePresence mode="wait">
        {activeTab === "templates" && !isCollapsed && (
          <motion.div
            key="templates"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Search / Filter */}
            <div className="px-6 pt-4 pb-2">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-700/80 bg-slate-800/50 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Template categories label */}
            <div className="px-6 pt-4 pb-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Available Templates
                </h3>
                <Settings size={14} className="text-slate-500" />
              </div>
            </div>

            {/* Template options */}
            <div className="flex-1 px-4 pt-2 pb-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              <div className="grid grid-cols-2 gap-3">
                {filteredOptions.map((option) => (
                  <motion.button
                    key={option.key}
                    onClick={() => onSelect(option.key)}
                    className={`relative flex ${
                      option.key === selected ? "flex-row" : "flex-col"
                    } items-center justify-center p-4 rounded-xl
                      ${
                        option.key === selected
                          ? `bg-gradient-to-br ${option.gradientFrom} ${option.gradientTo} shadow-lg shadow-${option.color}/20`
                          : "bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60"
                      } 
                      transition-all duration-300`}
                    whileHover={{
                      scale: 1.03,
                      boxShadow:
                        option.key !== selected
                          ? "0 4px 12px rgba(0, 0, 0, 0.1)"
                          : "",
                    }}
                    whileTap={{ scale: 0.97 }}
                    onMouseEnter={() => {
                      setTooltipContent(option);
                      setShowTooltip(true);
                    }}
                    onMouseLeave={() => {
                      setShowTooltip(false);
                    }}
                  >
                    <div
                      className={`${
                        option.key === selected ? "" : option.color
                      } ${
                        option.key !== selected ? "p-2 rounded-lg mb-2" : ""
                      }`}
                    >
                      <option.icon
                        size={26}
                        className={`${
                          option.key === selected ? "text-white" : "text-white"
                        }`}
                      />
                    </div>

                    <motion.span
                      className={`${
                        option.key === selected
                          ? "text-white font-medium ml-3"
                          : "mt-2 text-slate-200 font-medium"
                      } text-sm`}
                      layout
                    >
                      {option.key}
                    </motion.span>

                    {option.key === selected && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        layoutId="selectedDot"
                      >
                        <span className={`${option.color} text-white text-xs`}>
                          ✓
                        </span>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "data" && !isCollapsed && (
          <motion.div
            key="data"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Data Input Header */}
            <div className="px-6 pt-4 pb-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Data Input - {selected} Format
                </h3>
                <Database size={14} className="text-slate-500" />
              </div>
            </div>

            {/* AI Action Button */}
            <div className="px-4 pt-3 pb-3">
              <motion.button
                onClick={() => setShowPrompt(!showPrompt)}
                className="px-4 py-3 flex items-center justify-center gap-2 bg-gradient-to-r bg-[#0790e8] text-white rounded-xl shadow-lg shadow-indigo-900/30 font-medium transition-all w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles size={18} className="text-white" />
                <span>Generate with AI</span>
              </motion.button>
            </div>

            {/* AI Prompt Box */}
            <AnimatePresence>
              {showPrompt && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-4 space-y-3 bg-slate-900/80 mx-4 rounded-xl border border-slate-800 shadow-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-indigo-300 flex items-center gap-2">
                        <Sparkles size={14} className="text-indigo-400" />
                        AI Assistant
                      </span>
                      <button
                        onClick={() => setShowPrompt(false)}
                        className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="relative">
                      <textarea
                        className="w-full p-3 border border-slate-700 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none"
                        placeholder={getPlaceholderText()}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={3}
                      />
                      <motion.button
                        onClick={handleAIClick}
                        className="absolute bottom-2 right-2 bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-500"
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
                      className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r ${
                        selectedOption.gradientFrom
                      } ${
                        selectedOption.gradientTo
                      } text-white px-4 py-3 rounded-lg font-medium shadow-md shadow-slate-900/40 ${
                        loading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                    >
                      {loading && <Loader2 size={16} className="animate-spin" />}
                      {getButtonText()}
                    </motion.button>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-sm text-red-200"
                      >
                        {error}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Data Input Textarea */}
            <div className="flex-1 px-4 pt-2 pb-6 overflow-hidden">
              <div className="h-full bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">
                <textarea
                  className="w-full h-full resize-none bg-transparent text-white placeholder-slate-400 focus:outline-none text-sm leading-relaxed"
                  value={manualInputText} // Use local state
                  onChange={(e) => handleManualInputChange(e.target.value)} // Handle changes
                  placeholder={getDataInputPlaceholder()}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed state content */}
      {isCollapsed && (
        <div className="flex-1 flex flex-col items-center justify-center py-4">
          <div className="space-y-4">
            {options.slice(0, 3).map((option) => (
              <motion.button
                key={option.key}
                onClick={() => onSelect(option.key)}
                className={`p-3 rounded-xl ${
                  option.key === selected
                    ? `bg-gradient-to-br ${option.gradientFrom} ${option.gradientTo}`
                    : "bg-slate-800/60 hover:bg-slate-800"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <option.icon size={20} className="text-white" />
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Template tooltip */}
      <AnimatePresence>
        {showTooltip && tooltipContent && !isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-6 left-4 right-4 bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-2xl z-50"
          >
            <div
              className={`h-1.5 w-12 ${tooltipContent.color} rounded-full mb-2`}
            ></div>
            <h3 className="font-semibold text-white mb-1">
              {tooltipContent.key}
            </h3>
            <p className="text-sm text-slate-300">
              {tooltipContent.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
