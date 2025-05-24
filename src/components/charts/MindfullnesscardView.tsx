"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { setMindfullnessData } from "@/app/store/dataSlice";
import { motion } from "framer-motion";

const MindfulnessCards = () => {
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.swot.mindfullnessData);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingTimer, setBreathingTimer] = useState(30);
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Parse mindfulness data into array of {title, description} objects
  const cards = React.useMemo(() => {
    if (!data) return [];
    return data
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [title, description] = line.split(":");
        return {
          title: title?.trim() || "",
          description: description?.trim() || "",
        };
      })
      .filter((card) => card.title && card.description);
  }, [data]);

  // Reset card index when data changes
  useEffect(() => {
    setCurrentCardIndex(0);
    setIsBreathingActive(false);
    setIsEditing(false);
  }, [data]);

  // Breathing timer effect
  useEffect(() => {
    let interval;
    if (isBreathingActive && breathingTimer > 0) {
      interval = setInterval(() => {
        setBreathingTimer(prev => prev - 1);
      }, 1000);
    } else if (breathingTimer === 0) {
      setIsBreathingActive(false);
      setBreathingTimer(30);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive, breathingTimer]);

  // Breathing phase cycle effect
  useEffect(() => {
    let phaseInterval;
    if (isBreathingActive) {
      phaseInterval = setInterval(() => {
        setBreathingPhase(prev => prev === 'inhale' ? 'exhale' : 'inhale');
      }, 4000); // 4 seconds per phase
    }
    return () => clearInterval(phaseInterval);
  }, [isBreathingActive]);

  const handleNext = () => {
    if (isBreathingActive || isEditing) return;
    setCurrentCardIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrevious = () => {
    if (isBreathingActive || isEditing) return;
    setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditTitle(cards[currentCardIndex].title);
    setEditDescription(cards[currentCardIndex].description);
    setIsBreathingActive(false); // Stop breathing exercise if active
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim() || !editDescription.trim()) return;
    
    // Create updated cards array
    const updatedCards = [...cards];
    updatedCards[currentCardIndex] = {
      title: editTitle.trim(),
      description: editDescription.trim()
    };
    
    // Convert back to string format for Redux store
    const updatedData = updatedCards
      .map(card => `${card.title}:${card.description}`)
      .join('\n');
    
    // Dispatch the updated data to Redux
    dispatch(setMindfullnessData(updatedData));
    
    // Reset edit state
    setIsEditing(false);
    setEditTitle("");
    setEditDescription("");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle("");
    setEditDescription("");
  };

  const startBreathing = () => {
    setIsBreathingActive(true);
    setBreathingTimer(30);
    setBreathingPhase('inhale');
  };

  const stopBreathing = () => {
    setIsBreathingActive(false);
    setBreathingTimer(30);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 text-lg">No mindfulness cards available.</p>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-700">
            Mindfulness Cards
          </h2>
          <p className="text-gray-600 mt-2">
            Card {currentCardIndex + 1} of {cards.length}
          </p>
        </div>

        <div className="relative">
          <motion.div
            className="w-full h-[450px] rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center border-2 bg-gradient-to-br from-blue-100 to-cyan-100 border-blue-200 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={currentCardIndex}
            transition={{ duration: 0.5 }}
          >
            {isEditing ? (
              <div className="w-full space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                  />
                </div>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
              <h3 className="text-3xl font-bold text-blue-700 mb-3">
                {currentCard.title}
              </h3>
              <p className="text-lg text-gray-700 mb-6 max-w-md">
                {currentCard.description}
              </p>

              {/* Breathing Circle Animation */}
              <div className="relative flex flex-col items-center mb-4">
                <motion.div
                  className="w-32 h-32 rounded-full shadow-lg flex items-center justify-center"
                  style={{
                    background: isBreathingActive 
                      ? 'linear-gradient(135deg, #06b6d4, #3b82f6)'
                      : 'linear-gradient(135deg, #0891b2, #2563eb)'
                  }}
                  animate={isBreathingActive ? {
                    scale: breathingPhase === 'inhale' ? 1.4 : 0.8,
                    opacity: breathingPhase === 'inhale' ? 0.7 : 1,
                  } : { 
                    scale: 1, 
                    opacity: 1 
                  }}
                  transition={{ 
                    duration: 4, 
                    ease: "easeInOut",
                  }}
                >
                  {/* Inner breathing indicator */}
                  <motion.div
                    className="w-16 h-16 bg-white bg-opacity-30 rounded-full"
                    animate={isBreathingActive ? {
                      scale: breathingPhase === 'inhale' ? 1.2 : 0.6,
                    } : { scale: 1 }}
                    transition={{ 
                      duration: 4, 
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
                
                {isBreathingActive && (
                  <motion.p 
                    className="text-xl font-semibold text-blue-700 mt-3"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {breathingPhase === 'inhale' ? 'Breathe In' : 'Breathe Out'}
                  </motion.p>
                )}
              </div>

              {/* Timer */}
              <div className="text-3xl font-mono font-bold text-cyan-600 mb-4">
                {formatTime(breathingTimer)}
              </div>

              {/* Control Buttons */}
              <div className="flex space-x-4">
                {!isBreathingActive ? (
                  <button
                    onClick={startBreathing}
                    className="px-8 py-3 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition-colors font-semibold shadow-lg"
                  >
                    Start Breathing
                  </button>
                ) : (
                  <button
                    onClick={stopBreathing}
                    className="px-8 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors font-semibold shadow-lg"
                  >
                    Stop
                  </button>
                )}
              </div>

                {/* Edit button */}
                <button
                  onClick={handleEdit}
                  className="absolute top-4 right-4 p-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </>
            )}
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={isBreathingActive || isEditing}
            className={`p-3 rounded-full transition-all ${
              isBreathingActive || isEditing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg border-2 border-blue-200'
            }`}
            title="Previous card"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={handleNext}
            disabled={isBreathingActive || isEditing}
            className={`p-3 rounded-full transition-all ${
              isBreathingActive || isEditing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg border-2 border-blue-200'
            }`}
            title="Next card"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Card indicator dots */}
        <div className="flex justify-center space-x-2 mt-6">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => !isBreathingActive && !isEditing && setCurrentCardIndex(index)}
              disabled={isBreathingActive || isEditing}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentCardIndex 
                  ? 'bg-blue-600 scale-125' 
                  : 'bg-blue-200 hover:bg-blue-300'
              } ${(isBreathingActive || isEditing) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MindfulnessCards;