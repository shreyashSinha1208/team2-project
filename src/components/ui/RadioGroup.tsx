import React from "react";
import { cn } from "@/lib/utils";

interface RadioOption {
  id: string;
  label: string;
  value: string;
  description?: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  orientation?: "horizontal" | "vertical";
  label?: string;
  description?: string;
  error?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  defaultValue,
  value,
  onChange,
  className,
  disabled = false,
  required = false,
  orientation = "vertical",
  label,
  description,
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <div className="space-y-1">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}

      <div
        className={cn(
          "space-y-3",
          orientation === "horizontal" && "flex flex-row space-y-0 space-x-4"
        )}
      >
        {options.map((option) => (
          <div key={option.id} className="flex items-start space-x-2">
            <div className="relative flex items-center justify-center h-6 w-6">
              <input
                type="radio"
                id={option.id}
                name={name}
                value={option.value}
                defaultChecked={defaultValue === option.value}
                checked={value === option.value}
                onChange={handleChange}
                disabled={disabled}
                required={required}
                className="absolute w-full h-full opacity-0 cursor-pointer z-10"
              />
              <svg viewBox="0 0 35.6 35.6" className="w-6 h-6">
                {/* Background circle */}
                <circle
                  cx="17.8"
                  cy="17.8"
                  r="17.8"
                  className="fill-blue-200 transition-all duration-1000 ease-in-out"
                />

                {/* Outer ring - animated on checked */}
                <circle
                  cx="17.8"
                  cy="17.8"
                  r="14.37"
                  className="fill-none stroke-white stroke-2 transition-all duration-1000 ease-in-out"
                  strokeDasharray="100"
                  strokeDashoffset="100"
                  style={{
                    strokeDashoffset: value === option.value ? "0" : "100",
                  }}
                />

                {/* Tick mark - appears when checked (instead of center circle) */}
                <polyline
                  points="11.78 18.12 15.55 22.23 25.17 12.87"
                  className="fill-none stroke-white stroke-2 stroke-round strokeLinejoin-round transition-all duration-1000 ease-in-out"
                  strokeDasharray="22"
                  strokeDashoffset="22"
                  style={{
                    strokeDashoffset: value === option.value ? "0" : "22",
                  }}
                />
              </svg>
            </div>
            <div>
              <label
                htmlFor={option.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {option.label}
              </label>
              {option.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {option.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className="text-sm font-medium text-red-500 dark:text-red-400">
          {error}
        </p>
      )}

      {/* Add the required CSS for the transitions */}
      <style jsx>{`
        input[type="radio"]:checked + svg circle:nth-child(1) {
          fill: #0790e8;
        }

        input[type="radio"]:hover:not(:checked) + svg circle:nth-child(1) {
          fill: #90cdf4;
        }

        input[type="radio"]:checked + svg circle:nth-child(2) {
          stroke-dashoffset: 0;
        }

        input[type="radio"]:checked + svg polyline {
          stroke-dashoffset: 0;
        }

        input[type="radio"]:hover + svg polyline {
          stroke-dashoffset: 0;
        }
      `}</style>
    </div>
  );
};

export { RadioGroup };
export type { RadioGroupProps, RadioOption };
