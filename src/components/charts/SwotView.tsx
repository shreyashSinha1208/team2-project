import React from 'react';

interface Props {
  items: string[];
}

const SwotView = ({ items }: Props) => {
  const swotMap: Record<string, string[]> = {
    Strengths: [],
    Weaknesses: [],
    Opportunities: [],
    Threats: [],
  };

  let currentCategory: keyof typeof swotMap | null = null;

  items.forEach((item) => {
    const trimmed = item.trim();
    if (['Strengths', 'Weaknesses', 'Opportunities', 'Threats'].includes(trimmed)) {
      currentCategory = trimmed as keyof typeof swotMap;
    } else if (currentCategory) {
      swotMap[currentCategory].push(trimmed.replace(/^\d+\.\s*/, '')); // Remove "1. ", "2. " etc.
    }
  });

  const categoryStyles: Record<string, string> = {
    Strengths: 'bg-green-100',
    Weaknesses: 'bg-red-100',
    Opportunities: 'bg-blue-100',
    Threats: 'bg-yellow-100',
  };

  return (
    <div className="max-w-5xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {(['Strengths', 'Weaknesses', 'Opportunities', 'Threats'] as const).map((category) => (
        <div
          key={category}
          className={`rounded-xl shadow p-4 ${categoryStyles[category]} border border-gray-300`}
        >
          <h2 className="text-lg font-bold mb-2 bg-gray-800 text-white p-2 rounded">{category}</h2>
          <ul className="list-disc list-inside space-y-1">
            {swotMap[category].map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SwotView;
