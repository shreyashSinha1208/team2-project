import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { setTimelineData } from "@/app/store/dataSlice";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "framer-motion";

export default function TimelineGraph() {
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.swot.timelineData);

  // State for adding new entries
  const [newEntryYear, setNewEntryYear] = useState('');
  const [newEntryDescription, setNewEntryDescription] = useState('');

  // Parse timeline entries from the Redux data string
  const timelineEntries = data
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((event, index) => {
      if (!event.includes(":")) {
        // If format is invalid, return null to filter out later
        return null;
      }
      const [year, ...descParts] = event.split(":");
      const description = descParts.join(":").trim();

      if (!year?.trim() || !description) {
        return null; // Skip if year or description is empty after splitting
      }
      return {
        id: `timeline-item-${index}`, // Unique ID for React keys
        year: year.trim(),
        description: description,
      };
    })
    .filter(Boolean); // Filter out any null entries from invalid format

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

  // Function to handle changes to an individual timeline entry's description
  const handleDescriptionChange = (index: number, newDescription: string) => {
    const updatedEntries = timelineEntries.map((entry, idx) => {
      if (idx === index) {
        return { ...entry, description: newDescription };
      }
      return entry;
    });

    // Reconstruct the full data string from the updated entries
    const newRawData = updatedEntries
      .map((entry) => `${entry.year}: ${entry.description}`)
      .join("\n");

    dispatch(setTimelineData(newRawData));
  };

  // Function to handle changes to an individual timeline entry's year
  const handleYearChange = (index: number, newYear: string) => {
    const updatedEntries = timelineEntries.map((entry, idx) => {
      if (idx === index) {
        return { ...entry, year: newYear };
      }
      return entry;
    });

    // Reconstruct the full data string from the updated entries
    const newRawData = updatedEntries
      .map((entry) => `${entry.year}: ${entry.description}`)
      .join("\n");

    dispatch(setTimelineData(newRawData));
  };

  // Function to add a new timeline entry
  const handleAddEntry = () => {
    if (newEntryYear.trim() && newEntryDescription.trim()) {
      const newEntryLine = `${newEntryYear.trim()}: ${newEntryDescription.trim()}`;
      // Append the new entry to the existing data, adding a newline if data already exists
      const updatedData = data.trim() === '' ? newEntryLine : `${data}\n${newEntryLine}`;
      dispatch(setTimelineData(updatedData));
      setNewEntryYear('');
      setNewEntryDescription('');
    }
  };

  // Function to delete a timeline entry
  const handleDeleteEntry = (indexToDelete: number) => {
    const updatedEntries = timelineEntries.filter((_, idx) => idx !== indexToDelete);
    const newRawData = updatedEntries
      .map((entry) => `${entry.year}: ${entry.description}`)
      .join("\n");
    dispatch(setTimelineData(newRawData));
  };

  // Render message and input for adding new entry if no valid timeline data exists
  if (timelineEntries.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 max-w-xl mx-auto">
        <p className="mb-4">No valid timeline data found. Add your first entry!</p>
        <div className="flex flex-col gap-4 p-4 border rounded-md bg-white dark:bg-neutral-900 shadow-md">
          <input
            type="text"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-neutral-200"
            placeholder="Year (e.g., 1990)"
            value={newEntryYear}
            onChange={(e) => setNewEntryYear(e.target.value)}
          />
          <textarea
            className="w-full h-24 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-neutral-200"
            placeholder="Description of event"
            value={newEntryDescription}
            onChange={(e) => setNewEntryDescription(e.target.value)}
          />
          <button
            onClick={handleAddEntry}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md"
          >
            Add Entry
          </button>
        </div>
        {data.trim() !== "" && (
          <p className="mt-4 text-sm text-red-500">
            Current data might be malformed. Please ensure each line is "Year: Description".
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className="w-full bg-white dark:bg-neutral-950 md:px-10"
      ref={containerRef}
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Interactive Timeline
        </h1>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {/* Timeline vertical connector line */}
        <div
          className="absolute md:left-8 left-8 top-0 h-full w-[2px] bg-gray-300
 dark:bg-[linear-gradient(to_bottom,transparent_0%,#4b5563_10%,#4b5563_90%,transparent_100%)]"
        ></div>

        {timelineEntries.map((item, index) => (
          <div
            key={item.id} // Use item.id for key
            className="flex justify-start pt-10 md:pt-24 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              {/* Timeline dot */}
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center z-10">
                <div className="h-4 w-4 rounded-full bg-black border-black dark:border-black p-2" />
              </div>

              <input
                type="text"
                className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-neutral-500 dark:text-neutral-500 bg-transparent border-b border-transparent focus:border-gray-400 transition-colors w-full"
                value={item.year}
                onChange={(e) => handleYearChange(index, e.target.value)}
              />
            </div>
            <div className="relative pl-20 pr-4 md:pl-4 w-full flex flex-col">
              <input
                type="text"
                className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500 bg-transparent border-b border-transparent focus:border-gray-400 transition-colors w-full"
                value={item.year}
                onChange={(e) => handleYearChange(index, e.target.value)}
              />
              <textarea
                className="bg-white dark:bg-neutral-900 p-6 rounded-lg border-[1px] border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-300 w-full resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-neutral-300"
                value={item.description}
                onChange={(e) => handleDescriptionChange(index, e.target.value)}
              />
              <button
                onClick={() => handleDeleteEntry(index)}
                className="mt-2 self-end px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors shadow-sm text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {/* Section for adding new entries */}
        <div className="max-w-xl mx-auto mt-10 p-6 border rounded-2xl bg-white dark:bg-neutral-900 shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">Add New Timeline Entry</h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-neutral-200"
              placeholder="Year (e.g., 2023)"
              value={newEntryYear}
              onChange={(e) => setNewEntryYear(e.target.value)}
            />
            <textarea
              className="w-full h-24 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-neutral-200 resize-y"
              placeholder="Description of event"
              value={newEntryDescription}
              onChange={(e) => setNewEntryDescription(e.target.value)}
            />
            <button
              onClick={handleAddEntry}
              className="px-6 py-3 bg-gradient-to-r from-violet-400 to-violet-600 text-white rounded-md hover:from-violet-500 hover:to-violet-700 transition-colors shadow-md"
            >
              Add Entry
            </button>
          </div>
        </div>

        {/* Animated progress line - uncomment if you want to use Framer Motion's scroll progress animation */}
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