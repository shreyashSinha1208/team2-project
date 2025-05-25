import React from "react";

interface ErrorMessageProps {
  title: string;
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ title, message }) => {
  return (
    <div className="w-full p-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-red-600 mb-2">{title}</h3>
        <p className="text-red-500">{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
