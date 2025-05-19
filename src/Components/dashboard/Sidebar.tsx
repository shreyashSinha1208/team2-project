"use client";

import React, { useState, useEffect } from "react";
import {
  Grid,
  Clock,
  List,
  MessageCircle,
  Layout,
  ChevronDown,
} from "lucide-react";

interface Props {
  selected: string;
  onSelect: (t: string) => void;
  onDataGenerated?: (data: string) => void;
}

const options = [
  { key: "Hierarchy", icon: Grid },
  { key: "Timeline", icon: Clock },
  { key: "List", icon: List },
  { key: "Q&A", icon: MessageCircle },
  { key: "Pro", icon: Layout },
  { key: "Swot", icon: Layout },
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

      // Pass the generated data to parent component if we're in a templated mode
      if (
        ["Timeline", "Q&A", "List", "Hierarchy", "Swot"].includes(selected) &&
        aiReply &&
        onDataGenerated
      ) {
        onDataGenerated(aiReply);
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

  return (
    <aside className="w-64 flex flex-col bg-yellow-400 border-r border-black h-screen overflow-y-auto">
      {/* Top nav */}
      <div className="h-12 flex items-center justify-between px-4 bg-blue-900">
        <h2 className="text-lg font-bold text-white underline">Templates</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPrompt(!showPrompt)}
            className="text-white text-sm underline hover:text-yellow-200 transition"
          >
            Use AI<sup>✨</sup>
          </button>
        </div>
      </div>

      <div className="h-[2px] bg-black" />

      {/* AI Prompt Box */}
      {showPrompt && (
        <div className="px-4 py-3 space-y-2">
          <textarea
            className="w-full p-2 border-2 border-black rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-700"
            placeholder={
              selected === "Timeline"
                ? "Enter a historical topic (e.g., ww2, cold war)..."
                : selected === "Q&A"
                ? "Enter a topic for Q&A generation (e.g., climate change, nutrition)..."
                : selected === "List"
                ? "Enter a topic for list generation (e.g., healthy foods, programming languages)..."
                : selected === "Hierarchy"
                ? "Enter a topic for hierarchy generation (e.g., animal classification, company structure)..."
                : "Enter your prompt..."
            }
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            onClick={handleAIClick}
            className={`w-full bg-blue-900 text-white px-3 py-2 rounded-lg border border-black font-semibold hover:bg-blue-800 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading
              ? "Generating..."
              : selected === "Timeline"
              ? "Generate Timeline"
              : selected === "Q&A"
              ? "Generate Q&A"
              : selected === "List"
              ? "Generate List"
              : selected === "Hierarchy"
              ? "Generate Hierarchy"
              : "Ask AI"}
          </button>

          {error && (
            <div className="p-2 bg-red-100 border border-red-500 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {/* {response && (
            <div className="p-2 bg-white border border-black rounded-lg text-sm text-black max-h-60 overflow-y-auto">
              {selected === "Timeline" ? (
                <>
                  <strong>Timeline Generated:</strong>
                  <pre className="whitespace-pre-wrap">{response}</pre>
                </>
              ) : (
                <>
                  <strong>AI:</strong> {response}
                </>
              )}
            </div>
          )} */}
        </div>
      )}

      {/* Dropdown */}
      <div className="px-4 pt-4 pb-6">
        <label className="text-sm font-semibold mb-1 block text-black">
          Filter by Category
        </label>
        <div className="relative">
          <select
            className="w-full p-2 rounded-lg border-2 border-black bg-white text-black appearance-none focus:outline-none focus:ring-2 focus:ring-blue-700"
            value={selected}
            onChange={(e) => onSelect(e.target.value)}
          >
            <option>All</option>
            {options.map((o) => (
              <option key={o.key}>{o.key}</option>
            ))}
          </select>
          <ChevronDown
            size={20}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black"
          />
        </div>
      </div>

      {/* Icon buttons - horizontal scroll */}
      <div className="px-4 py-2 mx-2 overflow-x-auto">
        <div className="flex space-x-4 pb-4">
          {options.map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`min-w-[100px] flex-shrink-0 flex flex-col items-center justify-center p-4 rounded-xl
          ${
            selected === key
              ? "bg-blue-900 text-white scale-105"
              : "bg-yellow-200 text-black"
          }
          border-2 border-black hover:bg-yellow-300 transition-all`}
            >
              <Icon size={32} />
              <span className="mt-2 text-sm font-semibold">{key}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
