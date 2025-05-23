import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowDown, Sparkles } from 'lucide-react';

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

// Sample data for demonstration
const sampleData = `Setup Environment
Configure your development environment with the necessary tools and dependencies

Initialize Project
Create a new project structure and install required packages

Design Architecture
Plan the system architecture and define component relationships

Implement Core Features
Build the main functionality and integrate key components

Testing & Validation
Perform comprehensive testing and validate all requirements

Deployment
Deploy the application to production environment`;

export default function ProcedureDiagram({ data = sampleData }: ProcedureDiagramProps) {
  const steps = parseSteps(data);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const stepVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  const getGradient = (idx: number) => {
    const gradients = [
      'from-violet-500 to-purple-600',
      'from-blue-500 to-cyan-600',
      'from-emerald-500 to-teal-600',
      'from-orange-500 to-red-600',
      'from-pink-500 to-rose-600',
      'from-indigo-500 to-blue-600'
    ];
    return gradients[idx % gradients.length];
  };

  const getAccentColor = (idx: number) => {
    const colors = [
      'border-violet-200 shadow-violet-100',
      'border-blue-200 shadow-blue-100',
      'border-emerald-200 shadow-emerald-100',
      'border-orange-200 shadow-orange-100',
      'border-pink-200 shadow-pink-100',
      'border-indigo-200 shadow-indigo-100'
    ];
    return colors[idx % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-8">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Procedure Flow
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-xl text-gray-600 font-light">
            Follow these steps to achieve your goals
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-300 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-300 rounded-full blur-3xl"></div>
          </div>

          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              {/* Connector */}
              {idx < steps.length - 1 && (
                <motion.div 
                  className="absolute left-1/2 transform -translate-x-1/2 z-0"
                  style={{ top: '100%', height: '4rem' }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.3 + idx * 0.2, duration: 0.5 }}
                >
                  <div className="w-1 h-full bg-gradient-to-b from-gray-300 to-gray-400 mx-auto"></div>
                  <motion.div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, delay: idx * 0.3 }}
                  >
                    <ArrowDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </motion.div>
              )}

              <motion.div
                variants={stepVariants}
                className="relative z-10 mb-16"
              >
                <div className="flex items-start gap-6">
                  {/* Step Number Circle */}
                  <motion.div 
                    className={`flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r ${getGradient(idx)} flex items-center justify-center shadow-2xl relative overflow-hidden`}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6, type: "spring" }}
                  >
                    <div className="absolute inset-0 bg-white opacity-20 rounded-full blur-sm"></div>
                    <span className="text-white font-bold text-xl relative z-10">
                      {idx + 1}
                    </span>
                  </motion.div>

                  {/* Content Card */}
                  <motion.div 
                    className={`flex-1 bg-white/80 backdrop-blur-xl rounded-2xl p-8 border ${getAccentColor(idx)} shadow-xl relative overflow-hidden`}
                    whileHover={{ 
                      scale: 1.02,
                      backgroundColor: "rgba(255, 255, 255, 0.9)"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Glassmorphism overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl"></div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <CheckCircle className={`w-6 h-6 text-emerald-400`} />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-lg leading-relaxed font-light">
                        {step.description}
                      </p>
                    </div>

                    {/* Decorative corner accent */}
                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${getGradient(idx)} opacity-20 rounded-bl-full`}></div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Completion Badge */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: steps.length * 0.2 + 0.5, duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-full shadow-lg font-semibold text-lg">
            <CheckCircle className="w-6 h-6" />
            Process Complete
            <Sparkles className="w-6 h-6" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}