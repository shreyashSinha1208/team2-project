"use client";

import React from "react";
import { MessageCircle, CornerDownRight } from "lucide-react";

interface Props {
  items: string[];
}

export default function QnAView({ items }: Props) {
  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-8">
          📝 Q&A Questionnaire
        </h2>

        {items.length === 0 && (
          <p className="text-center text-gray-400 text-lg">
            No questions available.
          </p>
        )}

        <dl className="space-y-6">
          {items.map((line, i) => {
            if (!line.includes(":")) {
              return <div key={i} className="min-h-[50px]"></div>;
            }

            const [q, a, ...rest] = line.split(":");

            if (!q?.trim() || !a?.trim() || rest.length > 0) {
              return <div key={i} className="min-h-[50px]"></div>;
            }

            return (
              <div
                key={i}
                className="group transition border border-gray-200 bg-blue-50 rounded-xl p-6"
              >
                <dt className="flex items-center text-blue-900 text-base font-semibold mb-1">
                  <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
                  {q.trim()}
                </dt>
                <dd className="ml-7 flex items-start text-gray-800 leading-relaxed">
                  <CornerDownRight className="w-4 h-4 mt-1 mr-2 text-blue-400" />
                  {a.trim()}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
}
