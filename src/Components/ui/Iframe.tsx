"use client";
import { LoadingSpinner } from "@/Components/utils/LoadingSpinner";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface IframeProps {
  src: string;
  loadingSize?: string;
  containerClass?: string;
  iframeClass?: string;
  title?: string;
}

const Iframe: React.FC<IframeProps> = ({
  src,
  loadingSize = "w-40 h-40",
  containerClass = "w-full h-full flex items-center justify-center relative",
  iframeClass = "w-full h-full",
  title = "",
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("simulator-container", containerClass)}>
      {!loaded && (
        <div className="flex items-center justify-center bg-white z-10 w-full h-full">
          <LoadingSpinner size={loadingSize} />
        </div>
      )}
      <iframe
        src={src}
        onLoad={() => setLoaded(true)}
        title={title}
        className={cn(iframeClass)}
      />
    </div>
  );
};

export default Iframe;
