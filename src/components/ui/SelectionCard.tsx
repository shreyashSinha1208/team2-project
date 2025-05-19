"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  LucideIcon,
  Plus,
  Library,
  Book,
  Video,
  FileText,
  PenTool,
} from "lucide-react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { Badge } from "@/Components/ui/Badge";

// Define card variants using class-variance-authority
const cardVariants = cva(
  "relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-6 transition-all duration-300 cursor-pointer overflow-hidden group",
  {
    variants: {
      variant: {
        default: "border-gray-200 hover:border-blue-400 hover:bg-blue-50/50",
        primary: "border-blue-200 hover:border-blue-500 hover:bg-blue-50/80",
        secondary:
          "border-purple-200 hover:border-purple-500 hover:bg-purple-50/80",
        success: "border-green-200 hover:border-green-500 hover:bg-green-50/80",
        warning: "border-amber-200 hover:border-amber-500 hover:bg-amber-50/80",
      },
      size: {
        sm: "w-64 h-48",
        md: "w-80 h-64",
        lg: "w-96 h-72",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

// Define icon container variants
const iconContainerVariants = cva(
  "flex items-center justify-center rounded-full p-3 transition-all duration-300",
  {
    variants: {
      variant: {
        default:
          "bg-gray-100 text-gray-600 group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-md",
        primary:
          "bg-blue-100 text-blue-600 group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-md",
        secondary:
          "bg-purple-100 text-purple-600 group-hover:bg-white group-hover:text-purple-600 group-hover:shadow-md",
        success:
          "bg-green-100 text-green-600 group-hover:bg-white group-hover:text-green-600 group-hover:shadow-md",
        warning:
          "bg-amber-100 text-amber-600 group-hover:bg-white group-hover:text-amber-600 group-hover:shadow-md",
      },
      size: {
        sm: "text-lg",
        md: "text-xl",
        lg: "text-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

// Define Card component props interface
interface SelectionCardProps extends VariantProps<typeof cardVariants> {
  title: string;
  icon?: ReactNode;
  recommended?: boolean;
  description?: string;
  onClick?: () => void;
  className?: string;
  badgeText?: string;
  badgeVariant?: "default" | "green" | "blue" | "amber" | "purple";
}

// Course Card Component
const SelectionCard = ({
  title,
  icon: Icon,
  recommended = false,
  description,
  onClick,
  className,
  variant = "default",
  size = "md",
  badgeText,
  badgeVariant = "green",
}: SelectionCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(cardVariants({ variant, size }), className)}
      onClick={onClick}
    >
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
        <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-gradient-to-br from-blue-200 to-purple-200" />
        <div className="absolute -left-10 -bottom-10 w-24 h-24 rounded-full bg-gradient-to-tr from-blue-200 to-green-200" />
      </div>

      {/* Badge */}
      {(recommended || badgeText) && (
        <Badge
          className="absolute top-2 right-2 shadow-sm"
          size={"xs"}
          variant={"yellow"}
        >
          {badgeText || "Recommended"}
        </Badge>
      )}

      {/* Icon */}
      <div className={cn(iconContainerVariants({ variant, size }))}>{Icon}</div>

      {/* Title */}
      <h3
        className={cn(
          "font-medium text-balance text-center transition-colors duration-300",
          {
            "text-gray-600 group-hover:text-blue-700": variant === "default",
            "text-blue-700": variant === "primary",
            "text-purple-700": variant === "secondary",
            "text-green-700": variant === "success",
            "text-amber-700": variant === "warning",
          }
        )}
      >
        {title}
      </h3>

      {/* Description (optional) */}
      {description && (
        <p className="text-xs text-center text-gray-500 group-hover:text-gray-700 mt-1 px-2 line-clamp-2">
          {description}
        </p>
      )}

      {/* Animated hover effect */}
      <div className="absolute inset-0 border-2 border-transparent rounded-xl group-hover:border-dashed transition-all duration-300 opacity-0 group-hover:opacity-10" />
    </motion.div>
  );
};

export default SelectionCard;
