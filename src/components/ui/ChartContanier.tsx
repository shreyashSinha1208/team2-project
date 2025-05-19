import React from "react";
import { cn } from "@/lib/utils";
interface ChartContanierProps {
  children: React.ReactNode;
  className?: string;
}

const ChartContanier: React.FC<ChartContanierProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 p-6 rounded-xl relative ",
        className
      )}
    >
      <span className="w-[250px] h-[30px] bg-white dark:bg-gray-800 absolute bottom-6 left-6 z-[10000]"></span>
      {children}
    </div>
  );
};

export default ChartContanier;
