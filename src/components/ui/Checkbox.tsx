import React from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps {
  id: string;
  name?: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  name,
  checked,
  onChange,
  label,
  description,
  disabled = false,
  required = false,
  className,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <div className={cn("flex items-start space-x-2", className)}>
      <div className="relative flex items-center justify-center h-6 w-6 mt-0.5">
        <input
          type="checkbox"
          id={id}
          name={name || id}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        />

        <div className="checkbox-custom w-6 h-6 relative">
          <div className="absolute inset-0 border-2 border-blue-500 rounded-md transition-all duration-300"></div>
          <div className="absolute inset-0 bg-blue-500 rounded-sm transform scale-0 transition-transform duration-300"></div>
          <svg
            viewBox="0 0 24 24"
            className="absolute inset-0 stroke-white opacity-0 transition-opacity duration-500"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transformOrigin: "center" }}
          >
            <polyline points="5,12 10,17 19,8"></polyline>
          </svg>
        </div>
      </div>

      {(label || description) && (
        <div>
          {label && (
            <label
              htmlFor={id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
      )}

      <style jsx>{`
        .checkbox-custom svg {
          stroke-dasharray: 30;
          stroke-dashoffset: 15;
        }

        input[type="checkbox"]:checked + .checkbox-custom div:nth-child(2) {
          transform: scale(1);
        }

        input[type="checkbox"]:checked + .checkbox-custom svg {
          opacity: 1;
          animation: checkmark-pop 0.8s ease-out forwards;
        }

        input[type="checkbox"]:hover:not(:checked)
          + .checkbox-custom
          div:first-child {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(7, 144, 232, 0.2);
        }

        input[type="checkbox"]:focus + .checkbox-custom div:first-child {
          box-shadow: 0 0 0 2px rgba(7, 144, 232, 0.3);
        }

        input[type="checkbox"]:disabled + .checkbox-custom div {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @keyframes checkmark-pop {
          0% {
            stroke-dashoffset: 0;
            opacity: 0;
          }
          30% {
            opacity: 1;
            }
            70% {
                stroke-dashoffset: 0;
                transform: scale(1.2);
          }
          85% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            stroke-dashoffset: 10;
          }
        }
      `}</style>
    </div>
  );
};

export { Checkbox };
export type { CheckboxProps };
