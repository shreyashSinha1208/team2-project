import React from "react";
import { useEffect, useRef, useState } from "react";
interface Props {
  data: string;
}
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "motion/react";

export default function TimelineGraph({ data }: Props) {
  const timelineEntries = data
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((event) => {
      // Check if event contains colon
      if (!event.includes(":")) {
        return null; // invalid format, skip rendering later
      }
      const [year, ...descParts] = event.split(":");
      if (
        !year?.trim() ||
        descParts.length === 0 ||
        !descParts.join(":").trim()
      ) {
        return null; // invalid data, skip
      }
      return {
        title: year.trim(),
        content: (
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg border-[1px] border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-300">
            <p className="text-neutral-700 dark:text-neutral-300">
              {descParts.join(":").trim()}
            </p>
          </div>
        ),
      };
    })
    .filter(Boolean);

  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  if (timelineEntries.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No valid timeline data found
      </div>
    );
  }

  return (
    <div
      className="w-full bg-white dark:bg-neutral-950 md:px-10"
      ref={containerRef}
    >
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {/* Timeline vertical connector line */}
        <div
          className="absolute md:left-8 left-8 top-0 h-full w-[2px] bg-gray-300
 dark:bg-[linear-gradient(to_bottom,transparent_0%,#4b5563_10%,#4b5563_90%,transparent_100%)]"
        ></div>

        {timelineEntries.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-24 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              {/* Timeline dot */}
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center z-10">
                <div className="h-4 w-4 rounded-full bg-black border-black dark:border-black p-2" />
              </div>

              <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-neutral-500 dark:text-neutral-500">
                {item && item.title}
              </h3>
            </div>
            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500">
                {item && item.title}
              </h3>
              {item && item.content}
            </div>
          </div>
        ))}

        {/* Animated progress line */}
        {/* <div
          style={{ height: `${height}px` }}
          className="absolute md:left-8 left-8 top-0 w-[2px] overflow-hidden
  bg-gradient-to-b from-transparent via-neutral-200 to-transparent
  dark:via-neutral-700 
  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] 
  bg-gradient-to-t from-purple-500 via-blue-500 to-transparent 
  rounded-full"
          />
        </div> */}
      </div>
    </div>
  );
}
