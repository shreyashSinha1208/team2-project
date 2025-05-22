import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { setTimelineData } from "@/app/store/chartsSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronDown, ChevronUp, Clock } from "lucide-react";

interface Props {
  data?: string;
}

export default function TimelineGraph({ data }: Props) {
  const dispatch = useAppDispatch();
  const timelineData = useAppSelector((state) => state.charts.data.timeline);
  const [expandedItems, setExpandedItems] = useState<number[]>([0]); // First item expanded by default
  
  useEffect(() => {
    if (data) {
      dispatch(setTimelineData(data));
    }
  }, [data, dispatch]);
  
  const displayData = data || timelineData;
  
  const events = displayData
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
    .map((event) => {
      if (!event.includes(":")) {
        return null;
      }
      const [date, ...desc] = event.split(":");
      if (!date?.trim() || desc.length === 0 || !desc.join(":").trim()) {
        return null;
      }
      return {
        date: date.trim(),
        description: desc.join(":").trim(),
      };
    })
    .filter(Boolean) as { date: string; description: string }[];

  const toggleItem = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  if (events.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 bg-gradient-to-br from-white to-violet-50 rounded-xl">
        <div className="text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-violet-300" />
          <p className="text-lg text-violet-500">No timeline events available</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="w-full h-full overflow-auto p-8 bg-gradient-to-br from-white to-violet-50 rounded-xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold mb-8 text-violet-700 text-center flex items-center justify-center gap-2">
          <Clock className="h-6 w-6" />
          Timeline
        </h3>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[24px] top-0 bottom-0 w-1 bg-gradient-to-b from-violet-300 to-violet-500 rounded-full"></div>
          
          {events.map((event, index) => (
            <motion.div 
              key={index} 
              className="mb-6 relative"
              variants={itemVariants}
            >
              {/* Dot */}
              <div className="absolute left-[18px] top-2 w-[14px] h-[14px] rounded-full bg-white p-1 z-10 shadow-md">
                <div className="w-full h-full bg-violet-500 rounded-full"></div>
              </div>

              {/* Card */}
              <div className="ml-12">
                <motion.div 
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-violet-100"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full flex justify-between items-center p-4 text-left bg-gradient-to-r from-violet-100 to-violet-50 hover:from-violet-200 hover:to-violet-100 transition-colors duration-200"
                  >
                    <span className="text-sm font-semibold text-violet-800">
                      {event.date}
                    </span>
                    {expandedItems.includes(index) ? (
                      <ChevronUp className="h-5 w-5 text-violet-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-violet-600 flex-shrink-0" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {expandedItems.includes(index) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 bg-white border-t border-violet-100">
                          <p className="text-gray-700 leading-relaxed">
                            {event.description}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}