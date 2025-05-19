import React from "react";
import { FormFieldSchema } from "./types";
import { useFormData } from "./FormProvider";

interface FormBuilderFieldProps {
  field: FormFieldSchema;
}

export function FormBuilderField({ field }: FormBuilderFieldProps) {
  const { data, updateFields } = useFormData();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    updateFields({ [field.name]: e.target.value });
  };

  const commonProps = {
    id: field.name,
    name: field.name,
    required: field.required,
    autoFocus: field.autoFocus,
    placeholder: field.placeholder,
    value: data[field.name] || "",
    onChange: handleChange,
    className:
      "w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm",
  };

  switch (field.type) {
    case "select":
      return (
        <div className="space-y-1">
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-gray-700"
          >
            {field.label}
          </label>
          <select {...commonProps}>
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    case "textarea":
      return (
        <div className="space-y-1">
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-gray-700"
          >
            {field.label}
          </label>
          <textarea {...commonProps} rows={4} />
        </div>
      );
    default:
      return (
        <div className="space-y-1">
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-gray-700"
          >
            {field.label}
          </label>
          <input
            {...commonProps}
            type={field.type}
            min={field.type === "number" ? field.min : undefined}
            max={field.type === "number" ? field.max : undefined}
          />
        </div>
      );
  }
}
