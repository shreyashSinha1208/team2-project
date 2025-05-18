import React from "react";
import { cn } from "@/lib/utils";

type AvatarSize = "xs" | "sm" | "md" | "lg";
type AvatarVariant = "default" | "present" | "absent";

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
  bgColor?: string;
  textColor?: string;
  variant?: AvatarVariant;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "",
  name = "",
  size = "md",
  className = "",
  bgColor,
  textColor,
  variant = "default",
}) => {
  // Size variants configuration
  const sizeClasses: Record<AvatarSize, string> = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-lg",
  };

  // Variant styles configuration
  const variantClasses: Record<AvatarVariant, string> = {
    default: "bg-blue-500 text-white",
    present: "bg-green-200 text-green-700",
    absent: "bg-red-200 text-red-700",
  };

  // Get initials from name
  const getInitials = (name: string): string => {
    const words = name.trim().split(" ");
    if (words.length === 1) {
      // For single word, take first two letters
      return name.slice(0, 2).toUpperCase();
    }
    // For multiple words, take first letter of each word
    return words
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle image error
  const onImageError = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    const target = e.target as HTMLImageElement;
    target.style.display = "none";
    const nextElement = target.nextElementSibling as HTMLDivElement;
    if (nextElement) {
      nextElement.style.display = "flex";
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden flex items-center justify-center",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      style={
        bgColor || textColor
          ? {
              backgroundColor: bgColor,
              color: textColor,
            }
          : undefined
      }
    >
      {src && (
        <img
          src={src}
          alt={alt}
          onError={onImageError}
          className="w-full h-full object-cover"
        />
      )}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center",
          !src ? "flex" : "hidden"
        )}
      >
        {name ? getInitials(name) : ""}
      </div>
    </div>
  );
};

export default Avatar;
