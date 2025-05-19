import React, { useState, useRef, useId, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import {
  useContainedOutsideClick,
  createStopPropagationHandler,
} from "@/hooks/StopPropagationManager";

interface ExpandedCardContentProps {
  children: ReactNode;
  className?: string;
}

interface ExpandableCardProps {
  children: ReactNode;
  className?: string;
}

const ExpandableCard: React.FC<ExpandableCardProps> = ({
  children,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const expandedCardRef = useRef<HTMLDivElement>(null);
  const id = useId();

  const toggleExpand = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
  };

  // Create a handler that stops propagation
  const closeWithStopPropagation = createStopPropagationHandler(handleClose);

  // Use our custom hook with a higher priority (10) for the expanded card
  // This ensures it gets handled before lower priority components like SlidingPanel
  useContainedOutsideClick(isExpanded, handleClose, expandedCardRef, 10);

  const childrenArray = React.Children.toArray(children);
  const beforeExpandingContent = childrenArray.find(
    (child): child is React.ReactElement =>
      React.isValidElement(child) &&
      child.type === ExpandedCardContentBeforeExpanding
  );
  const expandedContent = childrenArray.find(
    (child): child is React.ReactElement =>
      React.isValidElement(child) && child.type === ExpandedCardContent
  );

  // Base card that's always present
  const baseCard = (
    <motion.div
      layoutId={`expandable-card-${id}`}
      onClick={toggleExpand}
      className={`cursor-pointer rounded-xl shadow-md transition-shadow duration-300 ease-in-out relative hover:shadow-lg overflow-hidden ${className}`}
      style={{ visibility: isExpanded ? "hidden" : "visible" }}
    >
      {beforeExpandingContent}
    </motion.div>
  );

  // Portal content for the expanded state
  const portalContent = isExpanded && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20"
      onClick={closeWithStopPropagation}
    >
      <motion.div
        layoutId={`expandable-card-${id}`}
        ref={expandedCardRef}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {expandedContent}
        <button
          onClick={closeWithStopPropagation}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );

  return (
    <>
      {baseCard}
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>{portalContent}</AnimatePresence>,
          document.body
        )}
    </>
  );
};

const ExpandedCardContent: React.FC<ExpandedCardContentProps> = ({
  children,
  className = "",
}) => (
  <div
    className={`expanded-card-content overflow-auto universal-overlay-scrollbar ${className}`}
  >
    {children}
  </div>
);

const ExpandedCardContentBeforeExpanding: React.FC<
  ExpandedCardContentProps
> = ({ children, className = "" }) => (
  <div className={`expanded-card-content-before-expanding ${className}`}>
    {children}
  </div>
);

export {
  ExpandableCard,
  ExpandedCardContent,
  ExpandedCardContentBeforeExpanding,
};
