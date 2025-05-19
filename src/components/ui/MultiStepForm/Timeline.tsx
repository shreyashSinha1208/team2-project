import React from "react";
import { motion } from "framer-motion";
import { FormStepSchema } from "./types";

interface TimelineProps {
  steps: FormStepSchema[];
  currentStepIndex: number;
}

export function Timeline({ steps, currentStepIndex }: TimelineProps) {
  // Helper function to determine the state of a step
  const getStepState = (index: number) => {
    if (index < currentStepIndex) return "completed";
    if (index === currentStepIndex) return "current";
    return "upcoming";
  };

  // Default icon for each step if not provided
  const getDefaultIcon = (index: number, state: string) => {
    if (state === "completed") {
      return (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      );
    }

    return <span className="font-medium text-lg">{index + 1}</span>;
  };

  // Container animation for the entire timeline
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  // Animation for each step
  const stepVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Animation for the connecting line
  const lineVariants = {
    hidden: { height: 0 },
    visible: {
      height: 64,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="sticky top-0 p-6 h-full overflow-auto">
      <motion.h2
        className="text-lg font-medium text-gray-700 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Your Progress
      </motion.h2>

      <motion.div
        className="space-y-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {steps.map((formStep, index) => {
          const stepState = getStepState(index);
          return (
            <motion.div
              key={formStep.id}
              className="relative"
              variants={stepVariants}
            >
              {/* Connecting line with animation */}
              {index < steps.length - 1 && (
                <>
                  <motion.div
                    className="absolute left-5 top-8 w-0.5 h-16 bg-gray-300"
                    variants={lineVariants}
                  />
                  {stepState === "completed" && (
                    <motion.div
                      className="absolute left-5 top-8 w-0.5 bg-emerald-500 z-10"
                      initial={{ height: 0 }}
                      animate={{ height: 64 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.3,
                        ease: "easeOut",
                      }}
                    />
                  )}
                </>
              )}

              {/* Step icon and text with pulsing animation for current step */}
              <div className="flex items-start py-2">
                <motion.div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10
                    ${
                      stepState === "completed"
                        ? "bg-emerald-500 text-white"
                        : stepState === "current"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  animate={
                    stepState === "current"
                      ? {
                          scale: [1, 1.05, 1],
                          boxShadow: [
                            "0 0 0 0 rgba(59, 130, 246, 0)",
                            "0 0 0 4px rgba(59, 130, 246, 0.3)",
                            "0 0 0 0 rgba(59, 130, 246, 0)",
                          ],
                        }
                      : {}
                  }
                  transition={
                    stepState === "current"
                      ? {
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "loop",
                        }
                      : {}
                  }
                >
                  {stepState === "completed"
                    ? getDefaultIcon(index, "completed")
                    : formStep.icon || getDefaultIcon(index, stepState)}
                </motion.div>

                <div className="ml-4">
                  <motion.p
                    className={`font-medium ${
                      stepState === "current"
                        ? "text-blue-600"
                        : stepState === "completed"
                        ? "text-emerald-600"
                        : "text-gray-500"
                    }`}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {formStep.title}
                  </motion.p>
                  {formStep.description && (
                    <motion.p
                      className="text-sm text-gray-500 hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      {formStep.description}
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
