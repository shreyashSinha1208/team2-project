"use client";

import React, {
  FormEvent,
  useState,
  useEffect,
  ReactNode,
  ReactElement,
} from "react";
import { FormSchema, FormStepSchema } from "./types";
import { useMultiStepForm } from "./useMultiStepForm";
import { FormStep } from "./FormStep";
import { FormProvider } from "./FormProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Timeline } from "./Timeline";
import ConfirmationModal from "@/Components/ui/ConfirmationModal";

// Extended interface to support component-based steps
interface ExtendedFormStepSchema extends FormStepSchema {
  component?: React.ComponentType<any>;
}

// Define the props that will be passed to children
interface FormAIAssistantProps {
  onAiUpdate?: () => void;
  overrideAllData?: (data: Record<string, any>) => void;
  formId?: string;
}

interface DynamicMultiStepFormProps extends Omit<FormSchema, "steps"> {
  steps: ExtendedFormStepSchema[];
  formId: string; // Unique identifier for the form
  isSubmitting?: boolean; // Flag to indicate if form is submitting
  children?: ReactNode; // Support for nested children (AI Assistant)
}

export default function DynamicMultiStepForm({
  steps,
  onSubmit,
  initialData = {},
  submitButtonText = "Submit",
  backButtonText = "Back",
  nextButtonText = "Next",
  formId = "default-form", // Default form ID if not provided
  isSubmitting = false, // Default not submitting
  children, // Accept children for AI Assistant
}: DynamicMultiStepFormProps) {
  // State for controlling the confirmation modal
  const [showModal, setShowModal] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  return (
    <FormProvider initialData={initialData} formId={formId}>
      {({ data, updateFields, resetForm, hasStoredData, overrideAllData }) => {
        // Create form steps with access to data and updateFields
        const formSteps = steps.map((step) => {
          // If the step has a component, use that
          if (step.component) {
            const StepComponent = step.component;
            return (
              <div key={step.id} className="step-component-wrapper">
                <StepComponent data={data} updateFields={updateFields} />
              </div>
            );
          }
          // Otherwise, use the regular FormStep component for field-based steps
          return <FormStep key={step.id} step={step} />;
        });

        // Initialize the multi-step form hook with our dynamic steps
        const {
          currentStepIndex,
          step,
          isFirstStep,
          isLastStep,
          back,
          next,
          direction,
          goTo,
        } = useMultiStepForm(formSteps, formId);

        // Function to validate the current step fields
        const validateStep = (data: Record<string, any>, stepIndex: number) => {
          const errors: Record<string, string> = {};
          const currentStep = steps[stepIndex];

          // Only validate fields if they exist
          if (currentStep.fields) {
            currentStep.fields.forEach((field) => {
              // Check required fields
              if (
                field.required &&
                (!data[field.name] || String(data[field.name]).trim() === "")
              ) {
                errors[field.name] = `${field.label} is required`;
              }

              // Validate number fields
              if (field.type === "number" && data[field.name]) {
                const value = Number(data[field.name]);

                if (field.min !== undefined && value < field.min) {
                  errors[
                    field.name
                  ] = `${field.label} must be at least ${field.min}`;
                }

                if (field.max !== undefined && value > field.max) {
                  errors[
                    field.name
                  ] = `${field.label} must be at most ${field.max}`;
                }
              }

              // Validate email fields
              if (field.type === "email" && data[field.name]) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(data[field.name])) {
                  errors[field.name] = `${field.label} must be a valid email`;
                }
              }
            });
          }

          // If step has a component, assume it's valid (component should handle its own validation)
          setFormErrors(errors);
          return Object.keys(errors).length === 0;
        };

        const handleSubmit = (e: FormEvent) => {
          e.preventDefault();

          // Don't allow submission while already submitting
          if (isSubmitting) {
            return;
          }

          // Validate current step
          if (!validateStep(data, currentStepIndex)) {
            return; // Don't proceed if validation fails
          }

          if (!isLastStep) {
            next();
            return;
          }

          // Final submission
          onSubmit(data);

          // Clear saved data after successful submission
          if (typeof window !== "undefined") {
            localStorage.removeItem(`form-data-${formId}`);
          }
        };

        // Show modal only once on initial render if there's stored data
        useEffect(() => {
          // Only show the modal if we have stored data
          if (hasStoredData) {
            setShowModal(true);
          }
        }, []); // Empty dependency array ensures this only runs once on mount

        // Handler for continuing with saved data
        const handleContinueWithSavedData = () => {
          setShowModal(false);
          // We already loaded the data, check for URL step param
          const urlParams = new URLSearchParams(window.location.search);
          const stepParam = urlParams.get(`step-${formId}`);
          if (stepParam !== null) {
            const stepIndex = parseInt(stepParam, 10);
            if (
              !isNaN(stepIndex) &&
              stepIndex >= 0 &&
              stepIndex < steps.length
            ) {
              goTo(stepIndex);
            }
          }
        };

        // Handler for starting fresh
        const handleStartFresh = () => {
          resetForm();
          setShowModal(false);
          goTo(0); // Go to first step
        };

        // Improved animation variants for the form step content
        const pageVariants = {
          enter: (direction: number) => ({
            opacity: 0,
            transform: `translateX(${direction > 0 ? "40px" : "-40px"})`,
          }),
          center: {
            opacity: 1,
            transform: "translateX(0px)",
          },
          exit: (direction: number) => ({
            opacity: 0,
            transform: `translateX(${direction < 0 ? "40px" : "-40px"})`,
          }),
        };

        // More refined transition for smoother animations
        const pageTransition = {
          type: "tween", // Using tween instead of spring to avoid overshooting
          ease: [0.25, 0.1, 0.25, 1], // Cubic bezier for smooth acceleration and deceleration
          duration: 0.4, // Slightly shorter duration for better feel
        };

        return (
          <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200 h-full">
            {/* Confirmation Modal for saved data */}
            <ConfirmationModal
              isOpen={showModal}
              title="Resume Your Progress"
              message="We found your previously saved progress. Would you like to continue where you left off?"
              confirmText="Continue"
              cancelText="Start Fresh"
              onConfirm={handleContinueWithSavedData}
              onCancel={handleStartFresh}
              confirmButtonClassName="bg-blue-600 hover:bg-blue-700"
            />

            {/* Render AI Assistant button before the main form */}
            {children && (
              <div className="w-full max-w-4xl mx-auto p-6 flex justify-end">
                {/* Clone the children and pass them the form context */}
                {React.Children.map(children, (child) => {
                  if (React.isValidElement(child)) {
                    // Create properly typed props for the cloned element
                    const formProps: FormAIAssistantProps = {
                      overrideAllData,
                      formId,
                    };

                    // This cast is necessary to make TypeScript happy
                    return React.cloneElement(
                      child as ReactElement<FormAIAssistantProps>,
                      formProps
                    );
                  }
                  return child;
                })}
              </div>
            )}

            <div className="flex flex-col md:flex-row h-full">
              {/* Timeline section */}
              <div className="md:w-[20%] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-r border-gray-200 h-full overflow-auto">
                <Timeline steps={steps} currentStepIndex={currentStepIndex} />
              </div>

              {/* Form content section */}
              <div className="md:w-[80%] h-full overflow-hidden flex flex-col">
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                  {/* Wrapper with overflow hidden to prevent horizontal scrollbar */}
                  <div className="relative flex-1 overflow-hidden">
                    <AnimatePresence
                      custom={direction}
                      initial={false}
                      mode="wait"
                    >
                      <motion.div
                        key={currentStepIndex}
                        custom={direction}
                        variants={pageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={pageTransition}
                        className="absolute inset-0 p-6 overflow-y-auto"
                        style={{ willChange: "transform, opacity" }} // Improve animation performance
                      >
                        <div className="min-h-[300px]">
                          {step}

                          {/* Display validation errors */}
                          {Object.keys(formErrors).length > 0 && (
                            <motion.div
                              className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              <h3 className="text-sm font-medium text-red-800">
                                Please fix the following errors:
                              </h3>
                              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                                {Object.values(formErrors).map(
                                  (error, index) => (
                                    <li key={index}>{error}</li>
                                  )
                                )}
                              </ul>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <motion.div
                    className="flex justify-end space-x-4 border-t border-gray-200 p-2 bg-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {!isFirstStep && (
                      <motion.button
                        type="button"
                        onClick={back}
                        disabled={isSubmitting}
                        className={`px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm ${
                          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        whileHover={
                          !isSubmitting
                            ? {
                                scale: 1.02,
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                              }
                            : {}
                        }
                        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                      >
                        {backButtonText}
                      </motion.button>
                    )}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-4 py-2 rounded-md text-sm font-medium text-white shadow-sm
                        ${
                          isLastStep
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 focus:ring-emerald-500"
                            : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:ring-blue-500"
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors
                        ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                      whileHover={
                        !isSubmitting
                          ? {
                              scale: 1.02,
                              boxShadow:
                                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                            }
                          : {}
                      }
                      whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {isLastStep ? "Creating..." : "Continuing..."}
                        </div>
                      ) : (
                        <>{isLastStep ? submitButtonText : nextButtonText}</>
                      )}
                    </motion.button>
                  </motion.div>
                </form>
              </div>
            </div>
          </div>
        );
      }}
    </FormProvider>
  );
}
