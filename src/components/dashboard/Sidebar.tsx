// "use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch and useSelector
import { RootState } from "@/app/store/store"; // Import RootState
import {
  setItems,
  setTimelineData,
  setListViewData,
  setFlashcardData,
  setMindfullnessData,
  setBarChartData,
} from "@/app/store/dataSlice"; // Import Redux actions
import { setQnAData } from "@/app/store/dataSlice"; // Import Redux actions

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
  Book,
  BarChart3,
  PieChart,
  CircleDot,
  LineChart,
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
    key: "Swot",
    icon: Layout,
    description: "Strengths, Weaknesses, Opportunities, Threats",
    color: "bg-sky-500",
    gradientFrom: "from-sky-400",
    gradientTo: "to-sky-600",
  },
  {
    key: "Flashcard",
    icon: Book,
    description: "Interactive flashcards with front/back design",
    color: "bg-rose-500",
    gradientFrom: "from-rose-400",
    gradientTo: "to-rose-600",
  },
  {
    key: "Bar Chart",
    icon: BarChart3,
    description: "Visualize data with vertical bars",
    color: "bg-blue-500",
    gradientFrom: "from-blue-400",
    gradientTo: "to-blue-600",
  },
  {
    key: "Pie Chart",
    icon: PieChart,
    description: "Display data as proportional segments",
    color: "bg-purple-500",
    gradientFrom: "from-purple-400",
    gradientTo: "to-purple-600",
  },
  {
    key: "Mindfullness",
    icon: Layout,
    description: "Mindfulness / Brain Break Cards",
    color: "bg-purple-500",
    gradientFrom: "from-sky-400",
    gradientTo: "to-sky-600",
  },
  {
    key: "Line Chart",
    icon: LineChart,
    description: "Track trends over time with connected points",
    color: "bg-teal-500",
    gradientFrom: "from-teal-400",
    gradientTo: "to-teal-600",
  },
  {
    key: "Doughnut Chart",
    icon: CircleDot,
    description: "Display data as a ring with segments",
    color: "bg-pink-500",
    gradientFrom: "from-pink-400",
    gradientTo: "to-pink-600",
  },
  {
    key: "Knob Chart",
    icon: CircleDot,
    description: "Display multiple circular progress indicators",
    color: "bg-orange-500",
    gradientFrom: "from-orange-400",
    gradientTo: "to-orange-600",
  },
  {
    key: "Concept Mapper",
    icon: Zap,
    description: "Create concept maps and mind maps",
    color: "bg-rose-500",
    gradientFrom: "from-rose-400",
    gradientTo: "to-rose-600",
  },
  {
    key: "Procedure Diagram",
    icon: Sparkles,
    description: "Create step-by-step procedure diagrams",
    color: "bg-cyan-500",
    gradientFrom: "from-cyan-400",
    gradientTo: "to-cyan-600",
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
  const flashcardData = useSelector(
    (state: RootState) => state.swot.flashcardData
  );
  const mindfullnessData = useSelector(
    (state: RootState) => state.swot.mindfullnessData
  );
  const qnaReduxData = useSelector((state: RootState) => state.swot.qnaData);

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
      } else if (selected === "Flashcard") {
        setManualInputText(flashcardData);
      } else if (selected === "Mindfullness") {
        setManualInputText(mindfullnessData);
      } else if (selected === "Q&A") {
        const qnaArray = Array.isArray(qnaReduxData) ? qnaReduxData : [];
        setManualInputText(qnaArray.join("\n"));
      } else {
        // For other templates, use the currentRawData passed from DashboardPage
        setManualInputText(currentRawData);
      }
    }
  }, [
    activeTab,
    selected,
    swotItems,
    timelineReduxData,
    listViewReduxData,
    currentRawData,
    flashcardData,
    mindfullnessData,
    qnaReduxData,
  ]);

  // Filtered options based on search input
  const filteredOptions = options.filter(
    (option) =>
      option.key.toLowerCase().includes(filterText.toLowerCase()) ||
      option.description.toLowerCase().includes(filterText.toLowerCase())
  );

  // System prompt changes based on selected template
  const getSystemPrompt = () => {
    switch (selected) {
      case "Bar Chart":
        return `You are a bar chart data generator. When given a topic or category, generate data in the format "key: value" with each pair on a new line. The data should be realistic and meaningful for the given topic. For example:

Norway: 99
United_States: 89
India: 54
Nigeria: 50
South_Africa: 72
Germany: 93
Brazil: 78

Only provide the raw data in the key: value format, with no introduction or explanation. Be precise and concise. Each key should be a category or item name, and each value should be a number between 0 and 100.`;

      case "Pie Chart":
        return `You are a pie chart data generator. When given a topic, generate data in JSON format with labels and datasets. The data should be in the following format:
{
  "labels": ["Category1", "Category2", "Category3", ...],
  "datasets": [{
    "label": "Chart Title",
    "data": [value1, value2, value3, ...],
    "backgroundColor": ["rgba(255, 99, 132, 0.8)", "rgba(54, 162, 235, 0.8)", "rgba(255, 206, 86, 0.8)", ...],
    "borderColor": ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", ...],
    "borderWidth": 1
  }]
}
Only provide the raw JSON data, with no introduction or explanation. Be precise and concise.`;

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
      case "Concept Mapper":
        return `You are a concept mapping data generator. When given a topic, generate a concept map in plain text format using labeled nodes and their directional relationships. Represent nodes with text labels and connections with arrows using the format "Source -> Target". Each relationship must be on a separate line. If a node has no outgoing connections, list it as a single label on a new line. Do not include any titles, explanations, or formatting other than plain text. Be precise and concise. Ensure all leading spaces are trimmed. Example format:

Main Idea
Main Idea -> Sub Idea 1
Main Idea -> Sub Idea 2
Sub Idea 1 -> Detail 1
Sub Idea 1 -> Detail 2
Sub Idea 2
Detail 1
Detail 2
`;
      case "Procedure Diagram":
        return `You are a procedure diagram data generator. When given a topic, generate a step-by-step procedure in plain text format. Each step should be on a new line, and you can use indentation to show sub-steps. Do not include any titles, explanations, or formatting other than plain text. Be precise and concise. Ensure all leading spaces are trimmed. Example format:
Gather Materials
List all tools and items needed to begin the procedure. Ensure availability before starting.

Prepare Workspace
Clean and organize the area. Set up any necessary equipment.

Start the Process
Follow the instructions to begin the task. Double-check settings.

Verify Results
Check output for correctness. Document any errors or inconsistencies.

Cleanup
Shut down all equipment safely and return materials to storage.`;

      case "Doughnut Chart":
        return `You are a doughnut chart data generator. When given a topic, generate data in JSON format with labels and datasets. The data should be in the following format:
{
  "labels": ["Category1", "Category2", "Category3", ...],
  "datasets": [{
    "label": "Chart Title",
    "data": [value1, value2, value3, ...],
    "backgroundColor": ["rgba(255, 99, 132, 0.8)", "rgba(54, 162, 235, 0.8)", "rgba(255, 206, 86, 0.8)", ...],
    "borderColor": ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", ...],
    "borderWidth": 1
  }]
}
Only provide the raw JSON data, with no introduction or explanation. Be precise and concise.`;

      case "Line Chart":
        return `You are a line chart data generator. When given a topic, generate data in JSON format with labels and datasets. The data should be in the following format:
{
  "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  "datasets": [
    {
      "label": "Dataset Name 1",
      "data": [value1, value2, value3, ...],
      "borderColor": "rgb(255, 99, 132)",
      "backgroundColor": "rgba(255, 99, 132, 0.5)"
    },
    {
      "label": "Dataset Name 2",
      "data": [value1, value2, value3, ...],
      "borderColor": "rgb(53, 162, 235)",
      "backgroundColor": "rgba(53, 162, 235, 0.5)"
    }
  ]
}
Only provide the raw JSON data, with no introduction or explanation. Be precise and concise.`;

      case "Knob Chart":
        return `You are a knob chart data generator. When given a topic, generate data in JSON format with labels and datasets. The data should be in the following format:
{
  "labels": ["Category1", "Category2", "Category3", ...],
  "datasets": [{
    "label": "Chart Title",
    "data": [value1, value2, value3, ...],
    "backgroundColor": ["rgba(255, 99, 132, 0.8)", "rgba(54, 162, 235, 0.8)", "rgba(255, 206, 86, 0.8)", ...],
    "borderColor": ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", ...],
    "borderWidth": 1
  }]
}
Only provide the raw JSON data, with no introduction or explanation. Be precise and concise.`;

      case "Flashcard":
        return `You are a flashcard generator. When given a topic, generate a series of flashcards in the format "front:back" with each card on a new line. The front should contain a concise question or concept, and the back should contain a clear, brief explanation. Focus on key concepts and provide 5-10 cards. Only provide the raw data in the front:back format, with no introduction or explanation. Ensure all leading spaces are trimmed. Be precise and concise. Example format:
What is React?:A JavaScript library for building user interfaces
What is JSX?:A syntax extension for JavaScript
What is a Component?:A reusable piece of UI
What is State?:An object that holds data that may change`;

      case "Mindfullness":
        return `You are a mindfulness and wellness card generator. When given a topic related to mental health, stress relief, or wellness, generate a series of mindfulness cards in the format "title:description" with each card on a new line. The title should be a concise mindfulness activity or concept, and the description should provide clear, calming instructions or prompts. Focus on breathing exercises, meditation techniques, grounding exercises, and relaxation methods. Provide 5-10 cards that promote mental wellbeing. Only provide the raw data in the title:description format, with no introduction or explanation. Ensure all leading spaces are trimmed. Be precise and therapeutic. Example format:
Deep Breathing:Breathe in as the circle expands, and out as it contracts. Follow for 5 cycles.
Body Scan:Start from your toes and slowly move attention up through your body, noticing any sensations.
5-4-3-2-1 Grounding:Notice 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.
Mindful Moment:Take a moment to notice your surroundings. What do you see, hear, and feel?
Progressive Relaxation:Tense and release each muscle group, starting from your feet up to your head.`;

      default:
        return "You are a helpful assistant. Provide clear and explanatory answers. Ensure all leading spaces are trimmed and avoid unnecessary details.";
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
      if (aiReply) {
        if (selected === "Swot") {
          const lines = aiReply
            .split("\n")
            .map((line: string) => line.trim())
            .filter(Boolean);
          dispatch(setItems(lines));
        } else if (selected === "Timeline") {
          dispatch(setTimelineData(aiReply));
        } else if (selected === "List") {
          dispatch(setListViewData(aiReply));
        } else if (selected === "Flashcard") {
          dispatch(setFlashcardData(aiReply));
        } else if (selected === "Mindfullness") {
          dispatch(setMindfullnessData(aiReply));
        } else if (selected === "Bar Chart") {
          dispatch(setBarChartData(aiReply));
        }

        // Update manual input text with AI response
        if (
          [
            "Timeline",
            "Q&A",
            "List",
            "Hierarchy",
            "Swot",
            "Procedure Diagram",
            "Concept Mapper",
            "Flashcard",
            "Mindfullness",
            "Bar Chart",
          ].includes(selected) &&
          aiReply &&
          onDataGenerated
        ) {
          onDataGenerated(aiReply);
          // Also update the manual input text with AI response
          setManualInputText(aiReply);
          // Auto-hide the prompt box after successful generation
          setTimeout(() => setShowPrompt(false), 1000);
        }
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
    if (
      [
        "Timeline",
        "Q&A",
        "List",
        "Hierarchy",
        "Swot",
        "Procedure Diagram",
        "Concept Mapper",
        "Flashcard",
        "Mindfullness",
      ].includes(selected)
    ) {
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
      case "Flashcard":
        return "Enter a topic for flashcard generation (e.g., React concepts, JavaScript fundamentals)...";
      case "Mindfullness":
        return "Enter a topic for mindfulness generation (e.g., mindfulness, brain break)...";
      case "Concept Mapper":
        return "Enter a topic for Concept Mapper here (e.g., business expansion, product launch)...";
      case "Procedure Diagram":
        return "Enter a topic for Procedure Diagram here (e.g., business expansion, product launch)...";
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
      case "Flashcard":
        return "Generate Flashcards";
      case "Mindfullness":
        return "Generate Mindfulness";
      case "Concept Mapper":
        return "Generate Concept Map";
      case "Procedure Diagram":
        return "Generate Procedure Diagram";
      default:
        return "Ask AI";
    }
  };

  // Get data input placeholder text based on selected template (for manual input textarea)
  const getDataInputPlaceholder = () => {
    switch (selected) {
      case "Bar Chart":
        return `Data : value`;

      case "Pie Chart":
        return `Data : value`;

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

      case "Flashcard":
        return `Format: front:back description

Example:
What is React?:A JavaScript library for building user interfaces
What is JSX?:A syntax extension for JavaScript
What is a Component?:A reusable piece of UI
What is State?:An object that holds data that may change

Enter your flashcard data above...`;

      //       case "Mindfullness":
      //         return `Format: title:description

      // Example:
      // Deep Breathing:Breathe in as the circle expands, and out as it contracts. Follow for 5 cycles.
      // Body Scan:Start from your toes and slowly move attention up through your body, noticing any sensations.
      // 5-4-3-2-1 Grounding:Notice 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.
      // Mindful Moment:Take a moment to notice your surroundings. What do you see, hear, and feel?
      // Progressive Relaxation:Tense and release each muscle group, starting from your feet up to your head.
      // Loving Kindness:Send positive thoughts to yourself, then to loved ones, then to all beings.
      // Present Awareness:Focus entirely on this moment. What thoughts and feelings arise without judgment?

      // Enter your mindfulness card data above...`;
      case "Doughnut Chart":
        return `Data : value`;

      case "Line Chart":
        return `Data : value`;

      case "Pro":
        return `Enter your advanced data for professional analysis...

You can use any format that suits your analysis needs.`;
      case "Concept Mapper":
        return `Format: Use arrows to show relationships

Example:
Renewable Energy
Renewable Energy -> Solar Power
Renewable Energy -> Wind Energy
Renewable Energy -> Hydropower
Solar Power -> Photovoltaic Cells
Solar Power -> Solar Thermal Systems
Wind Energy -> Turbines
Hydropower -> Dams
Photovoltaic Cells
Solar Thermal Systems
Turbines
Dams

Enter your Concept Mapper data above...`;

      case "Procedure Diagram":
        return `Format: Use line spaces to show blocks
Example:Gather Materials
List all tools and items needed to begin the procedure. Ensure availability before starting.

Prepare Workspace
Clean and organize the area. Set up any necessary equipment.

Start the Process
Follow the instructions to begin the task. Double-check settings.

Verify Results
Check output for correctness. Document any errors or inconsistencies.

Cleanup
Shut down all equipment safely and return materials to storage.

      Enter your Procedure Diagram here...`;
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
      dispatch(setTimelineData(value));
    } else if (selected === "List") {
      dispatch(setListViewData(value));
    } else if (selected === "Flashcard") {
      dispatch(setFlashcardData(value));
    } else if (selected === "Mindfullness") {
      dispatch(setMindfullnessData(value));
    } else if (selected === "Q&A") {
      const qnaLines = value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      dispatch(setQnAData(qnaLines));
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
            <div className="flex-1 px-4 pt-2 pb-6 overflow-y-scroll scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              <div className=" h-[100vh]">
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
                      initial={false}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}
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
                          className={
                            option.key === selected
                              ? "text-white"
                              : "text-white"
                          }
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
                          <span
                            className={`${option.color} text-white text-xs`}
                          >
                            ✓
                          </span>
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
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
                      {loading && (
                        <Loader2 size={16} className="animate-spin" />
                      )}
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
