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

  // Parse flashcard data into array of {front, back} objects
  const cards = data
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

  // Reset card index when data changes
  useEffect(() => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [data]);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % cards.length);
    }, 300);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 300);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
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
              <div className="w-full h-full bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center border-2 border-blue-200">
                <p className="text-2xl font-semibold text-gray-800 text-center">
                  {cards[currentCardIndex].front}
                </p>
              </div>
            </div>

            {/* Back of card */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180">
              <div className="w-full h-full bg-blue-50 rounded-2xl shadow-lg p-8 flex items-center justify-center border-2 border-blue-200">
                <p className="text-xl text-gray-700 text-center">
                  {cards[currentCardIndex].back}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={handlePrevious}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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