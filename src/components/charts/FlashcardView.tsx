"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { setFlashcardData } from "@/app/store/dataSlice";
import { motion, AnimatePresence } from "framer-motion";

const FlashcardView = () => {
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.swot.flashcardData);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFront, setEditFront] = useState("");
  const [editBack, setEditBack] = useState("");

  // Parse flashcard data into array of {front, back} objects
  const cards = React.useMemo(() => {
    return data
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [front, back] = line.split(":");
        return {
          front: front?.trim() || "",
          back: back?.trim() || "",
        };
      })
      .filter((card) => card.front && card.back);
  }, [data]);

  // Reset card index when data changes
  useEffect(() => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setIsEditing(false);
    console.log('Flashcard data updated:', data); // Debug log
  }, [data]);

  // Debug effect to monitor cards array changes
  useEffect(() => {
    console.log('Cards array updated:', cards.length, 'cards');
  }, [cards]);

  const handleNext = () => {
    if (isEditing) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % cards.length);
    }, 300);
  };

  const handlePrevious = () => {
    if (isEditing) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 300);
  };

  const handleFlip = () => {
    if (isEditing) return;
    setIsFlipped(!isFlipped);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditFront(cards[currentCardIndex].front);
    setEditBack(cards[currentCardIndex].back);
  };

  const handleSaveEdit = () => {
    if (!editFront.trim() || !editBack.trim()) return;
    
    // Create updated cards array
    const updatedCards = [...cards];
    updatedCards[currentCardIndex] = {
      front: editFront.trim(),
      back: editBack.trim()
    };
    
    // Convert back to string format for Redux store
    const updatedData = updatedCards
      .map(card => `${card.front}:${card.back}`)
      .join('\n');
    
    // Dispatch the updated data to Redux
    dispatch(setFlashcardData(updatedData));
    
    // Reset edit state
    setIsEditing(false);
    setEditFront("");
    setEditBack("");
    setIsFlipped(false); // Reset flip to show front side
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFront("");
    setEditBack("");
    setIsFlipped(false); // Reset flip to show front side
  };

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 text-lg">No flashcards available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-700"> Flashcards</h2>
          <p className="text-gray-600 mt-2">
            Card {currentCardIndex + 1} of {cards.length}
          </p>
        </div>

        <div className="perspective-1000 relative h-[300px] w-full cursor-pointer">
          <motion.div
            className="w-full h-full relative preserve-3d transition-transform duration-500"
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 500, damping: 30 }}
            onClick={handleFlip}
          >
            {/* Front of card */}
            <div className="absolute w-full h-full backface-hidden">
              <div className="w-full h-full bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center border-2 border-blue-200 relative">
                {/* Edit button */}
                <button
                  onClick={handleEdit}
                  className="absolute top-4 right-4 w-8 h-8 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center text-sm font-bold z-10"
                  title="Edit card"
                >
                  ✏️
                </button>
                
                {isEditing ? (
                  <div className="w-full space-y-4" onClick={(e) => e.stopPropagation()}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Front (Question):
                      </label>
                      <textarea
                        value={editFront}
                        onChange={(e) => setEditFront(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none text-lg mt-[3vh] overflow-y-auto"
                        rows={3}
                        placeholder="Enter question..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Back (Answer):
                      </label>
                      <textarea
                        value={editBack}
                        onChange={(e) => setEditBack(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none text-lg overflow-y-auto"
                        rows={3}
                        placeholder="Enter answer..."
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
                  <p className="text-2xl font-semibold text-gray-800 text-center">
                    {cards[currentCardIndex].front}
                  </p>
                )}
              </div>
            </div>

            {/* Back of card */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180">
              <div className="w-full h-full bg-blue-50 rounded-2xl shadow-lg p-8 flex items-center justify-center border-2 border-blue-200 relative">
                {/* Edit button */}
                <button
                  onClick={handleEdit}
                  className="absolute top-4 right-4 w-8 h-8 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center text-sm font-bold z-10"
                  title="Edit card"
                >
                  ✏️
                </button>
                
                {isEditing ? (
                  <div className="w-full space-y-4" onClick={(e) => e.stopPropagation()}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Front (Question):
                      </label>
                      <textarea
                        value={editFront}
                        onChange={(e) => setEditFront(e.target.value)}
                        className="w-full p-3 border border-gray-300  overflow-y-scroll  rounded-lg resize-none text-lg"
                        rows={3}
                        placeholder="Enter question..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Back (Answer):
                      </label>
                      <textarea
                        value={editBack}
                        onChange={(e) => setEditBack(e.target.value)}
                        className="w-full p-3 border border-gray-300  rounded-lg resize-none text-lg"
                        rows={3}
                        placeholder="Enter answer..."
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
                  <p className="text-xl text-gray-700 text-center">
                    {cards[currentCardIndex].back}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={handlePrevious}
            disabled={isEditing}
            className={`px-6 py-2 rounded-lg transition ${
              isEditing 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={isEditing}
            className={`px-6 py-2 rounded-lg transition ${
              isEditing 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Next
          </button>
        </div>
      </div>

      <style jsx global>{`
        @media (forced-colors: active) {
          .perspective-1000 {
            forced-color-adjust: none;
          }
          .preserve-3d {
            forced-color-adjust: none;
          }
          .backface-hidden {
            forced-color-adjust: none;
          }
          .rotate-y-180 {
            forced-color-adjust: none;
          }
          button {
            forced-color-adjust: none;
          }
        }

        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default FlashcardView;