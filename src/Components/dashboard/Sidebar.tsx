"use client";

import React, { useState } from "react";
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
}

const options = [
  { key: "Hierarchy", icon: Grid },
  { key: "Timeline", icon: Clock },
  { key: "List", icon: List },
  { key: "Q&A", icon: MessageCircle },
  { key: "Pro", icon: Layout },
];

export default function TemplateSidebar({ selected, onSelect }: Props) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ You can change this prompt as needed
  const systemPrompt = `You are a teacher. Give answers in a explainatory way`;

  const handleAIClick = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setResponse("");
    setError("");

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
              content: systemPrompt,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      const aiReply = data.choices?.[0]?.message?.content;
      setResponse(aiReply || "No response from AI.");
    } catch (err: any) {
      console.error(err);
      setError("Error contacting AI. Please check your API key or try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="w-64 flex flex-col bg-yellow-400 border-r border-black h-screen">
      {/* Top nav */}
      <div className="h-12 flex items-center justify-between px-4 bg-blue-900">
        <h2 className="text-lg font-bold text-white underline">Templates</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPrompt(!showPrompt)}
            className="text-white text-sm underline focus:outline-none"
          >
            Use AI<sup>✨</sup>
          </button>
          <span className="text-white text-sm flex items-center">
            Customize<ChevronDown size={16} className="ml-1" />
          </span>
        </div>
      </div>

      <div className="h-[2px] bg-black" />

      {/* AI Prompt Box */}
      {showPrompt && (
        <div className="px-4 py-2 space-y-2">
          <textarea
            className="w-full p-2 border-2 border-black rounded-lg"
            placeholder="Enter your prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            onClick={handleAIClick}
            className={`bg-blue-900 text-white px-3 py-1 rounded border border-black ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Thinking..." : "Ask AI"}
          </button>

          {error && (
            <div className="p-2 bg-red-100 border border-red-500 rounded text-sm text-red-700">
              {error}
            </div>
          )}

          {response && (
            <div className="p-2 bg-white border border-black rounded text-sm">
              <strong>AI:</strong> {response}
            </div>
          )}
        </div>
      )}

      {/* Dropdown */}
      <div className="px-4 py-2">
        <div className="relative">
          <select
            className="w-full p-2 rounded-lg border-2 border-black bg-white text-black appearance-none"
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

      {/* Icon buttons */}
      <div className="px-4 grid grid-cols-5 gap-2">
        {options.map(({ key, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg
              ${selected === key ? "bg-blue-900 text-white" : "bg-yellow-200 text-black"}
              border-2 border-black hover:bg-yellow-300`}
          >
            <Icon size={24} />
            <span className="mt-1 text-xs">{key}</span>
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-4 px-4">
        <div className="h-2 bg-blue-900 rounded-full w-1/3" />
        <div className="h-2 bg-gray-300 rounded-full mt-1" />
      </div>
    </aside>
  );
}
