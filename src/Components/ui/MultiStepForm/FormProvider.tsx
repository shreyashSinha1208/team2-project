"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";

interface FormContextType {
  data: Record<string, any>;
  updateFields: (fields: Record<string, any>) => void;
  resetForm: () => void;
  hasStoredData: boolean;
  overrideAllData: (newData: Record<string, any>) => void; // New function
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function useFormData() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormData must be used within a FormProvider");
  }
  return context;
}

interface FormProviderProps {
  initialData?: Record<string, any>;
  children: (contextValue: FormContextType) => ReactNode;
  formId: string; // Unique identifier for the form to use in localStorage
}

export function FormProvider({
  initialData = {},
  children,
  formId,
}: FormProviderProps) {
  // Use a ref to track if this is the initial render
  const isInitialMount = useRef(true);

  // Try to load data from localStorage first
  const loadStoredData = () => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem(`form-data-${formId}`);
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          return {
            data: parsedData,
            hasStored:
              Object.keys(parsedData).length > 0 &&
              JSON.stringify(parsedData) !== JSON.stringify(initialData),
          };
        } catch (e) {
          console.error("Failed to parse stored form data:", e);
        }
      }
    }
    return { data: initialData, hasStored: false };
  };

  // Get initial state
  const { data: initialLoadedData, hasStored: initialHasStored } =
    loadStoredData();

  // Initialize state
  const [data, setData] = useState<Record<string, any>>(initialLoadedData);
  const [hasStoredData, setHasStoredData] = useState(initialHasStored);

  // Save data to localStorage whenever it changes, but don't update hasStoredData here
  useEffect(() => {
    if (typeof window !== "undefined" && !isInitialMount.current) {
      localStorage.setItem(`form-data-${formId}`, JSON.stringify(data));
    }

    // Mark initial mount as complete after first render
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [data, formId]);

  const updateFields = (fields: Record<string, any>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  // New function to completely override all form data
  const overrideAllData = (newData: Record<string, any>) => {
    console.log("Overriding all form data with:", newData);
    setData(newData);

    // Update localStorage immediately
    if (typeof window !== "undefined") {
      localStorage.setItem(`form-data-${formId}`, JSON.stringify(newData));
    }
  };

  const resetForm = () => {
    setData(initialData);
    setHasStoredData(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem(`form-data-${formId}`);
    }
  };

  const contextValue = {
    data,
    updateFields,
    resetForm,
    hasStoredData,
    overrideAllData,
  };

  return (
    <FormContext.Provider value={contextValue}>
      {children(contextValue)}
    </FormContext.Provider>
  );
}
