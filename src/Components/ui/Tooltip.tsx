import React, { useState, useRef, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";

/**
 * Tooltip component with support for different positions and dark/light mode
 * Enhanced to work properly within scrolling containers like MultiStepForm
 */

interface TooltipProps {
  /** Content to wrap with the tooltip */
  children: React.ReactNode;

  /** Tooltip content (string or JSX) */
  title: string | ReactNode;

  /** Tooltip position relative to the element */
  position?: "top" | "bottom" | "left" | "right";

  /** Delay before showing tooltip (ms) */
  delay?: number;

  /** Additional classes for the wrapper element */
  className?: string;

  /** Additional classes for the tooltip */
  tooltipClassName?: string;

  /** Allow HTML content in tooltip (must be sanitized) */
  html?: boolean;

  /** Custom color variant */
  variant?: "default" | "info" | "success" | "warning" | "error";

  /** Maximum width for tooltip content */
  maxWidth?: number;
}

const Tooltip = ({
  children,
  title,
  position = "top",
  delay = 200,
  className = "",
  tooltipClassName = "",
  html = false,
  variant = "default",
  maxWidth = 250,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  // Track if we created a container, but don't store it as a ref
  const [tooltipContainer, setTooltipContainer] =
    useState<HTMLDivElement | null>(null);
  let timeoutId: NodeJS.Timeout;

  // Create the tooltip container when component mounts
  useEffect(() => {
    const container = document.createElement("div");
    container.className = "tooltip-container";
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.pointerEvents = "none";
    container.style.zIndex = "9999";
    container.style.overflow = "hidden";
    document.body.appendChild(container);

    setTooltipContainer(container);

    // Clean up when component unmounts
    return () => {
      if (container && document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };
  }, []);

  // Calculate tooltip position relative to its container
  const calculatePosition = () => {
    if (!tooltipRef.current || !targetRef.current) return;

    // Get positioning information
    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const spacing = 8;

    let top = 0;
    let left = 0;

    // Calculate different positions
    switch (position) {
      case "top":
        top = targetRect.top - tooltipRect.height - spacing;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        break;
      case "bottom":
        top = targetRect.bottom + spacing;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        break;
      case "left":
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.left - tooltipRect.width - spacing;
        break;
      case "right":
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.right + spacing;
        break;
    }

    // Apply bounds checking to keep within viewport
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Adjust horizontal position if needed
    if (left < spacing) {
      left = spacing;
    } else if (left + tooltipRect.width > viewport.width - spacing) {
      left = viewport.width - tooltipRect.width - spacing;
    }

    // Adjust vertical position if needed
    if (top < spacing) {
      top = spacing;
    } else if (top + tooltipRect.height > viewport.height - spacing) {
      top = viewport.height - tooltipRect.height - spacing;
    }

    // Apply fixed positioning
    if (tooltipRef.current) {
      tooltipRef.current.style.top = `${top}px`;
      tooltipRef.current.style.left = `${left}px`;
      tooltipRef.current.style.maxWidth = `${maxWidth}px`;
    }
  };

  const handleMouseEnter = () => {
    timeoutId = setTimeout(() => {
      setIsVisible(true);
      // We need to wait for the next frame for the tooltip to be in the DOM
      requestAnimationFrame(() => {
        requestAnimationFrame(calculatePosition);
      });
    }, delay);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutId);
    setIsVisible(false);
  };

  // Recalculate position when visibility changes or window resizes
  useEffect(() => {
    if (isVisible) {
      calculatePosition();

      // Add event listeners for recalculating position
      window.addEventListener("scroll", calculatePosition, true);
      window.addEventListener("resize", calculatePosition);

      // Check for any parent scrolling containers and add listeners
      let parent = targetRef.current?.parentElement;
      while (parent) {
        if (parent.scrollHeight > parent.clientHeight) {
          parent.addEventListener("scroll", calculatePosition);
        }
        parent = parent.parentElement;
      }
    }

    return () => {
      window.removeEventListener("scroll", calculatePosition, true);
      window.removeEventListener("resize", calculatePosition);

      // Remove scroll listeners from parents
      if (targetRef.current) {
        let parent = targetRef.current.parentElement;
        while (parent) {
          parent.removeEventListener("scroll", calculatePosition);
          parent = parent.parentElement;
        }
      }
    };
  }, [isVisible]);

  const getInitialAnimation = () => {
    switch (position) {
      case "top":
        return { y: 10, opacity: 0 };
      case "bottom":
        return { y: -10, opacity: 0 };
      case "left":
        return { x: 10, opacity: 0 };
      case "right":
        return { x: -10, opacity: 0 };
    }
  };

  const getArrowClass = () => {
    // Base positioning classes for each position
    const positionClasses = {
      top: "bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-x-transparent border-b-transparent",
      bottom:
        "top-0 left-1/2 -translate-x-1/2 -translate-y-full border-x-transparent border-t-transparent",
      left: "right-0 top-1/2 translate-x-full -translate-y-1/2 border-y-transparent border-r-transparent",
      right:
        "left-0 top-1/2 -translate-x-full -translate-y-1/2 border-y-transparent border-l-transparent",
    };

    // Color classes based on variant
    const getColorClass = () => {
      switch (variant) {
        case "info":
          return position === "top"
            ? "border-t-blue-50 dark:border-t-blue-900"
            : position === "bottom"
            ? "border-b-blue-50 dark:border-b-blue-900"
            : position === "left"
            ? "border-l-blue-50 dark:border-l-blue-900"
            : "border-r-blue-50 dark:border-r-blue-900";
        case "success":
          return position === "top"
            ? "border-t-green-50 dark:border-t-green-900"
            : position === "bottom"
            ? "border-b-green-50 dark:border-b-green-900"
            : position === "left"
            ? "border-l-green-50 dark:border-l-green-900"
            : "border-r-green-50 dark:border-r-green-900";
        case "warning":
          return position === "top"
            ? "border-t-amber-50 dark:border-t-amber-900"
            : position === "bottom"
            ? "border-b-amber-50 dark:border-b-amber-900"
            : position === "left"
            ? "border-l-amber-50 dark:border-l-amber-900"
            : "border-r-amber-50 dark:border-r-amber-900";
        case "error":
          return position === "top"
            ? "border-t-red-50 dark:border-t-red-900"
            : position === "bottom"
            ? "border-b-red-50 dark:border-b-red-900"
            : position === "left"
            ? "border-l-red-50 dark:border-l-red-900"
            : "border-r-red-50 dark:border-r-red-900";
        default:
          return position === "top"
            ? "border-t-white dark:border-t-gray-800"
            : position === "bottom"
            ? "border-b-white dark:border-b-gray-800"
            : position === "left"
            ? "border-l-white dark:border-l-gray-800"
            : "border-r-white dark:border-r-gray-800";
      }
    };

    return `${positionClasses[position]} ${getColorClass()}`;
  };

  const renderContent = () => {
    if (html && typeof title === "string") {
      const sanitizedHtml = DOMPurify.sanitize(title);
      return (
        <div
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          className="[&>*]:text-gray-800 [&>*]:dark:text-white [&_a]:text-blue-600 [&_a]:dark:text-blue-300 [&_a:hover]:text-blue-800 [&_a:hover]:dark:text-blue-200"
        />
      );
    }
    return title;
  };

  return (
    <div
      ref={targetRef}
      className={cn("inline-block relative", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            className={cn(
              "fixed z-[9999] pointer-events-none",
              tooltipClassName
            )}
            initial={getInitialAnimation()}
            animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            exit={{ ...getInitialAnimation(), scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <div className="relative">
              <motion.div
                className={cn(
                  "px-4 py-2 rounded-lg text-sm shadow-md dark:shadow-lg border pointer-events-none backdrop-blur-sm",
                  variant === "default" &&
                    "bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-200 dark:border-gray-700",
                  variant === "info" &&
                    "bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-100 border-blue-200 dark:border-blue-800",
                  variant === "success" &&
                    "bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-100 border-green-200 dark:border-green-800",
                  variant === "warning" &&
                    "bg-amber-50 dark:bg-amber-900 text-amber-800 dark:text-amber-100 border-amber-200 dark:border-amber-800",
                  variant === "error" &&
                    "bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-100 border-red-200 dark:border-red-800"
                )}
              >
                {renderContent()}
              </motion.div>
              <motion.div
                className={cn("absolute w-0 h-0 border-4", getArrowClass())}
                aria-hidden="true"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
