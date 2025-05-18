import React, { useEffect, useState } from "react";

interface TypewriterEffectSmoothProps {
  text: string;
  className?: string;
}

const TypewriterEffectSmooth: React.FC<TypewriterEffectSmoothProps> = ({
  text = "", // Default to an empty string if text is not provided
  className,
}) => {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    setDisplayedText(""); // Reset displayed text on text change
    setIndex(0); // Reset index on text change
  }, [text]);

  useEffect(() => {
    if (text && index < text.length) {
      // Check if text is defined
      const timeoutId = setTimeout(() => {
        setDisplayedText((prevText) => prevText + text[index]);
        setIndex((prevIndex) => prevIndex + 1);
      }, 30); // Adjust typing speed here
      return () => clearTimeout(timeoutId);
    }
  }, [index, text]);

  return <p className={className}>{displayedText}</p>;
};

export default TypewriterEffectSmooth;
