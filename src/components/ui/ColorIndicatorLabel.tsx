import React from "react";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

interface ColorIndicatorLabelProps {
  size?: Size;
  squareColor?: string;
  squareRounded?: string;
  text?: string;
  textColor?: string;
  textWeight?: string;
  className?: string;
  reverse?: boolean;
}

const sizeConfig = {
  sm: {
    square: "w-3 h-3",
    text: "text-sm",
    gap: "gap-1",
  },
  md: {
    square: "w-4 h-4",
    text: "text-base",
    gap: "gap-2",
  },
  lg: {
    square: "w-6 h-6",
    text: "text-lg",
    gap: "gap-3",
  },
} as const;

const ColorIndicatorLabel: React.FC<ColorIndicatorLabelProps> = ({
  size = "md",
  squareColor = "bg-blue-400",
  squareRounded = "rounded-sm",
  text = "Text",
  textColor = "text-black dark:text-gray-300",
  textWeight = "font-normal",
  className = "",
  reverse = false,
}) => {
  const { square, text: textSize, gap } = sizeConfig[size];

  const squareElement = (
    <div
      className={cn(
        square,
        squareColor,
        squareRounded,
        "border-2 border-[#b2b2b241]"
      )}
      aria-hidden="true"
    />
  );

  const textElement = (
    <div className={cn(textColor, textSize, textWeight)}>{text}</div>
  );

  return (
    <div className={cn("flex items-center justify-center", gap, className)}>
      {reverse ? (
        <>
          {textElement}
          {squareElement}
        </>
      ) : (
        <>
          {squareElement}
          {textElement}
        </>
      )}
    </div>
  );
};

export default ColorIndicatorLabel;
