"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { setListViewData } from "@/app/store/dataSlice";
import { ChevronDown, ChevronRight, Plus, X, Trash2, FolderPlus } from "lucide-react";

export default function ListView() {
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.swot.listViewData);

  const [newHeading, setNewHeading] = useState("");
  const [newItem, setNewItem] = useState("");
  const [expandedSections, setExpandedSections] = useState<{ [key: number]: boolean }>({});
  const [newItemsForSection, setNewItemsForSection] = useState<{ [key: number]: string }>({});
  const [showAddItemInput, setShowAddItemInput] = useState<{ [key: number]: boolean }>({});

  // Parse data into sections
  type Section = { title?: string; items: string[] };
  const sections: Section[] = [];
  let currentSection: Section | null = null;

  data.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (trimmed.startsWith("Heading ")) {
      if (currentSection) sections.push(currentSection);
      const headingText = trimmed.replace("Heading ", "").replace(/\.$/, "").trim();
      currentSection = { title: headingText, items: [] };
    } else if (currentSection) {
      currentSection.items.push(trimmed);
    }
  });
  if (currentSection) sections.push(currentSection);

  // Toggle section expand/collapse
  const toggleSection = (index: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Toggle show/hide input field for adding sub-item
  const toggleAddItemInput = (index: number) => {
    setShowAddItemInput((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
    if (showAddItemInput[index]) {
      setNewItemsForSection((prev) => ({ ...prev, [index]: "" }));
    }
  };

  // Add new section with item
  const handleAddSection = () => {
    if (!newHeading.trim() || !newItem.trim()) return;
    const headingLine = `Heading ${newHeading.trim()}.`;
    const updatedData = `${data.trim()}\n${headingLine}\n${newItem.trim()}`;
    dispatch(setListViewData(updatedData));
    setNewHeading("");
    setNewItem("");
  };

  // Add new item inside existing section
  const handleAddItemToSection = (sectionIndex: number) => {
    const newItemText = newItemsForSection[sectionIndex]?.trim();
    if (!newItemText) return;

    const updatedSections = [...sections];
    updatedSections[sectionIndex].items.push(newItemText);

    const newData = updatedSections
      .map((section) => [`Heading ${section.title}.`, ...section.items])
      .flat()
      .join("\n");

    dispatch(setListViewData(newData));
    setNewItemsForSection((prev) => ({ ...prev, [sectionIndex]: "" }));
    setShowAddItemInput((prev) => ({ ...prev, [sectionIndex]: false }));
  };

  // Delete a single item from a section
  const handleDeleteItem = (sectionIndex: number, itemIndex: number) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].items.splice(itemIndex, 1);
    const newData = updatedSections
      .map((section) => [`Heading ${section.title}.`, ...section.items])
      .flat()
      .join("\n");
    dispatch(setListViewData(newData));
  };

  return (
    <div className="min-h-screen border dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-[#0790e8] bg-clip-text text-transparent mb-2">
            Smart Lists
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Organize your thoughts, track your progress
          </p>
        </div>

        {/* Main Content */}
        <div className=" dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border dark:border-slate-700/50 overflow-hidden">
          
          {sections.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#0790e8] dark:from-blue-900 dark:to-indigo-900 rounded-full flex items-center justify-center">
                <FolderPlus className="w-8 h-8 bg-[#0790e8] dark:text-blue-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                No lists yet. Create your first one below!
              </p>
            </div>
          )}

          {sections.map((section, sectionIndex) => {
            const isExpanded = expandedSections[sectionIndex] ?? true;
            const showInput = showAddItemInput[sectionIndex] ?? false;

            return (
              <div
                key={`section-${sectionIndex}`}
                className=" dark:border-slate-700/50 "
              >
                {/* Section Header */}
                <div className="p-6 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <button
                        onClick={() => toggleSection(sectionIndex)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors duration-200"
                        aria-label={isExpanded ? "Collapse section" : "Expand section"}
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                          {section.title}
                        </h3>
                       
                      </div>
                    </div>

                    <button
                      onClick={() => toggleAddItemInput(sectionIndex)}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        showInput
                          ? 'bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400'
                          : 'bg-blue-100 hover:bg-blue-200 text-[#0790e8] dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400'
                      }`}
                      aria-label={showInput ? "Cancel add item" : "Add item"}
                    >
                      {showInput ? (
                        <X className="w-5 h-5" />
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Add Item Input */}
                  {showInput && (
                    <div className="mt-4 ml-10 animate-in slide-in-from-top-2 duration-200">
                      <div className="flex space-x-3">
                        <input
                          type="text"
                          placeholder="Add a new item..."
                          value={newItemsForSection[sectionIndex] || ""}
                          onChange={(e) =>
                            setNewItemsForSection((prev) => ({
                              ...prev,
                              [sectionIndex]: e.target.value,
                            }))
                          }
                          className="flex-1 px-4 py-2 bg-white dark:bg-slate-700 border dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                          autoFocus
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddItemToSection(sectionIndex);
                            }
                          }}
                        />
                        <button
                          onClick={() => handleAddItemToSection(sectionIndex)}
                          className="px-6 py-2 bg-gradient-to-r bg-[#0790e8] text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section Items */}
                {isExpanded && (
                  <div className="px-6 pb-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="ml-10 space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <div
                          key={`item-${itemIndex}`}
                          className="group flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-700/30 rounded-lg hover:bg-slate-100/70 dark:hover:bg-slate-600/40 transition-all duration-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-[#0790e8] rounded-full"></div>
                            <span className="text-slate-700 dark:text-slate-300">{item}</span>
                          </div>
                          
                          <button
                            onClick={() => handleDeleteItem(sectionIndex, itemIndex)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
                            aria-label="Delete Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add New Section */}
        <div className="mt-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border dark:border-slate-700/50 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-lg">
              <FolderPlus className="w-6 h-6 text-[#0790e8] dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                Create New List
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Add a new section with your first item
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder="List name (e.g., Shopping List)"
              value={newHeading}
              onChange={(e) => setNewHeading(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            />
            <input
              type="text"
              placeholder="First item (e.g., Milk and eggs)"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddSection();
                }
              }}
            />
            <button
              onClick={handleAddSection}
              disabled={!newHeading.trim() || !newItem.trim()}
              className="w-full py-3 bg-[#0790e8] text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium"
            >
              Create List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}