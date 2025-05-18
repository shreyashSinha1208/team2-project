import React from "react";
import { cn } from "@/lib/utils";

interface CustomLayoutProps {
  children?: React.ReactNode;
  containerClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

interface LayoutComponents {
  Header: React.FC<{ className?: string; children: React.ReactNode }>;
  Body: React.FC<{ className?: string; children: React.ReactNode }>;
  Footer: React.FC<{ className?: string; children: React.ReactNode }>;
}

const CustomLayout: React.FC<CustomLayoutProps> & LayoutComponents = ({
  children,
  containerClassName,
  headerClassName,
  bodyClassName,
  footerClassName,
}) => {
  const childrenArray = React.Children.toArray(children);

  const headerChild = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === CustomLayout.Header
  );

  const bodyChild = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === CustomLayout.Body
  );

  const footerChild = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === CustomLayout.Footer
  );

  return (
    <div
      className={cn(
        "flex flex-col w-full h-full",
        "bg-gray-50 dark:bg-gray-900",
        "transition-colors duration-200",
        containerClassName
      )}
    >
      {headerChild && (
        <div
          className={cn(
            "h-auto",
            "bg-white dark:bg-gray-800",
            "border-b dark:border-gray-700",
            "transition-colors duration-200",
            headerClassName
          )}
        >
          {headerChild}
        </div>
      )}
      {bodyChild && (
        <div
          className={cn(
            "flex-1",
            "overflow-y-auto",
            "scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600",
            "scrollbar-track-transparent",
            bodyClassName
          )}
        >
          {bodyChild}
        </div>
      )}
      {footerChild && (
        <div
          className={cn(
            "h-auto",
            "bg-white dark:bg-gray-800",
            "border-t dark:border-gray-700",
            "transition-colors duration-200",
            "shadow-lg",
            footerClassName
          )}
        >
          {footerChild}
        </div>
      )}
    </div>
  );
};

CustomLayout.Header = ({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={cn("w-full", "transition-colors duration-200", className)}>
      {children}
    </div>
  );
};

CustomLayout.Body = ({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "w-full h-full",
        "transition-colors duration-200",
        className
      )}
    >
      {children}
    </div>
  );
};

CustomLayout.Footer = ({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={cn("w-full", "transition-colors duration-200", className)}>
      {children}
    </div>
  );
};

export default CustomLayout;
