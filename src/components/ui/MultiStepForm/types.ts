import { ReactNode } from "react";

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "select"
  | "textarea"
  | "tel"
  | "date"
  | "button";

export interface FormFieldSchema {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  autoFocus?: boolean;
  min?: number;
  max?: number;
  placeholder?: string;
  options?: { value: string; label: string }[]; // For select fields
  disabled?: boolean;
  className?: string;
  variant?: string; // For button styling
  size?: string; // For button sizing
  onClick?: () => void; // For button click handlers
}

export interface FormStepSchema {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  fields?: FormFieldSchema[]; // Changed to optional
  component?: React.ComponentType<any>; // Added support for component-based steps
}

export interface FormSchema {
  steps: FormStepSchema[];
  onSubmit: (data: Record<string, any>) => void;
  initialData?: Record<string, any>;
  submitButtonText?: string;
  backButtonText?: string;
  nextButtonText?: string;
}
