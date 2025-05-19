import React from "react";

interface Props {
  data: string;
}

export default function TimelineGraph({ data }: Props) {
  const events = data
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
    .map((event) => {
      // Check if event contains colon
      if (!event.includes(":")) {
        return null; // invalid format, skip rendering later
      }
      const [date, ...desc] = event.split(":");
      if (!date?.trim() || desc.length === 0 || !desc.join(":").trim()) {
        return null; // invalid data, skip
      }
      return {
        date: date.trim(),
        description: desc.join(":").trim(), // Handle multiple colons in description
      };
    })
    .filter(Boolean) as { date: string; description: string }[]; // filter out nulls

  if (events.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        Timeline
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Timeline</h3>
      <div className="relative border-l-4 border-blue-500 pl-8">
        {events.map((event, index) => (
          <div key={index} className="mb-10 relative group">
            {/* Dot */}
            <span className="absolute w-4 h-4 bg-blue-500 rounded-full left-[-10px] top-2 border-4 border-white shadow group-hover:scale-110 transition-transform"></span>

            {/* Card */}
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <p className="text-sm text-blue-800 font-semibold">{event.date}</p>
              <p className="text-gray-700 mt-1">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
