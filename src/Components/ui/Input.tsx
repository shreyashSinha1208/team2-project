import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  FocusEvent,
} from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  name?: string;
  placeholder?: string;
  isFocus?: boolean;
  disabled?: boolean;
  label?: string;
  error?: string;
  labelClassName?: string;
  focusedLabelClassName?: string;
  containerClassName?: string;
  errorClassName?: string;
  focusColor?: string;
  borderColor?: string;
  backgroundColor?: string;
  darkBackgroundColor?: string;
  padding?: string;
  width?: string;
  transitionDuration?: string;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  startIcon?: React.ReactNode;
  iconClassName?: string;
}

const Input: React.FC<InputProps> = ({
  type = "text",
  value = "",
  onChange = () => {},
  required = false,
  name = "",
  placeholder = "",
  isFocus = false,
  disabled = false,
  label = "Label",
  error = "",
  className = "",
  labelClassName = "w-auto",
  focusedLabelClassName = "",
  containerClassName = "",
  errorClassName = "",
  focusColor = "#0790e8",
  borderColor = "currentColor",
  backgroundColor = "white",
  darkBackgroundColor = "",
  padding = "0.5rem",
  width = "full",
  transitionDuration = "300",
  onFocus = () => {},
  onBlur = () => {},
  startIcon,
  iconClassName = "",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(isFocus);
  const [hasDefaultValue, setHasDefaultValue] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Check for default browser values on mount and value changes
  useEffect(() => {
    const checkDefaultValue = () => {
      if (inputRef.current) {
        // Check if the input has a value, including browser defaults
        const hasValue =
          inputRef.current.value !== "" ||
          value !== "" ||
          type === "date" ||
          type === "time" ||
          type === "datetime-local";
        setHasDefaultValue(hasValue);
        if (hasValue) {
          setIsFocused(true);
        }
      }
    };

    checkDefaultValue();
  }, [value, type]);

  useEffect(() => {
    if (isFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocus]);

  const handleFocus = (e: FocusEvent<HTMLInputElement>): void => {
    setIsFocused(true);
    onFocus(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>): void => {
    const hasValue = e.target.value !== "" || hasDefaultValue;
    setIsFocused(hasValue);
    onBlur(e);
  };

  // Determine if label should be elevated
  const shouldElevateLabel = isFocused || value !== "" || hasDefaultValue;

  return (
    <div
      className={cn(
        "relative my-2 text-gray-600",
        {
          "w-full": width === "full",
          [`w-${width}`]: width !== "full",
        },
        containerClassName
      )}
    >
      <div className="relative">
        {startIcon && (
          <div
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none",
              iconClassName
            )}
          >
            {startIcon}
          </div>
        )}
        <input
          ref={inputRef}
          type={type}
          required={required}
          value={value}
          onChange={(e) => {
            onChange(e);
            setHasDefaultValue(e.target.value !== "");
          }}
          name={name}
          disabled={disabled}
          className={cn(
            "w-full p-2",
            "border-2 rounded-lg border-opacity-50",
            "outline-none duration-300",
            "dark:bg-gray-900 dark:text-gray-100",

            {
              "border-blue-500": isFocused && !error,
              "border-gray-300": !isFocused && !error,
              "border-red-500": error,
              "pl-10": startIcon,
            },
            className
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        <label
          className={cn(
            "absolute",
            "flex items-center justify-center",
            "text-sm",
            "transform",
            "text-opacity-80",
            "px-1",
            "pointer-events-none",
            "transition-all",
            {
              [`duration-${transitionDuration}`]: transitionDuration,
            },
            {
              "top-[-7px] text-xs": shouldElevateLabel,
              "top-1/2 -translate-y-1/2": !shouldElevateLabel,
              [`bg-${backgroundColor}`]: shouldElevateLabel,
              [`dark:bg-gray-800`]: shouldElevateLabel,
              "w-auto": shouldElevateLabel,
              "text-blue-500": isFocused && !error,
              "text-red-500": error,
              "left-10": startIcon,
              "left-2": !startIcon,
            },
            labelClassName,
            shouldElevateLabel && focusedLabelClassName
          )}
        >
          {label !== "Label" ? label : placeholder}
        </label>
      </div>
      {error && (
        <p className={cn("text-red-500 text-sm mt-1", errorClassName)}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
