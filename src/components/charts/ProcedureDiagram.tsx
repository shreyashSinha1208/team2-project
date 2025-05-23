import React from 'react';
import { motion } from 'framer-motion';

interface ProcedureDiagramProps {
  data: string;
}

function parseSteps(data: string) {
  // Each step is separated by two newlines, title and description by one newline
  return data
    .split(/\n\n+/)
    .map((block) => {
      const [title, ...desc] = block.split('\n');
      return {
        title: title?.trim() || '',
        description: desc.join(' ').trim(),
      };
    })
    .filter((step) => step.title);
}

export default function ProcedureDiagram({ data }: ProcedureDiagramProps) {
  const steps = parseSteps(data);

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center bg-gradient-to-br from-white to-blue-50 rounded-xl p-8 overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center w-full max-w-2xl relative">
        {steps.map((step, idx) => (
          <div key={idx} className="w-full flex flex-col items-center relative">
            {/* Connector line above except for first step */}
            {idx > 0 && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-1 h-6 bg-gradient-to-b from-blue-300 to-blue-100 z-0" />
            )}
            <motion.div
              className={`w-full bg-white rounded-xl shadow-md border-2 ${idx % 2 === 0 ? 'border-blue-400' : 'border-green-400'} p-6 mb-8 relative z-10`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className={`font-bold text-lg ${idx % 2 === 0 ? 'text-blue-600' : 'text-green-600'}`}>{`STEP ${idx + 1}`}</span>
                <span className="font-semibold text-gray-800">{step.title}</span>
              </div>
              <p className="text-gray-600 text-base leading-relaxed">{step.description}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  );
} 