import React from "react";
import { FormStepSchema } from "./types";
import { FormBuilderField } from "./FormBuilderField";
import { motion } from "framer-motion";

interface FormStepProps {
  step: FormStepSchema;
}

export function FormStep({ step }: FormStepProps) {
  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-xl font-semibold text-gray-800 mb-1"
        variants={itemVariants}
      >
        {step.title}
      </motion.h2>

      {step.description && (
        <motion.p className="text-gray-600 mb-6" variants={itemVariants}>
          {step.description}
        </motion.p>
      )}

      <motion.div
        className="grid grid-cols-1 gap-6"
        variants={containerVariants}
      >
        {(step.fields ?? []).map((field) => (
          <motion.div key={field.name} variants={itemVariants}>
            <FormBuilderField field={field} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
