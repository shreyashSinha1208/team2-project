"use client";

import React, { useState } from "react";
import {
  MessageCircle,
  CornerDownRight,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { addQnAItem, editQnAItem, deleteQnAItem } from "@/app/store/dataSlice";

const QnAView: React.FC = () => {
  const dispatch = useDispatch();
  const qnaItems = useSelector((state: RootState) => state.swot.qnaData);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedQuestion, setEditedQuestion] = useState("");
  const [editedAnswer, setEditedAnswer] = useState("");

  const handleAdd = () => {
    if (question.trim() && answer.trim()) {
      dispatch(addQnAItem(`${question.trim()}:${answer.trim()}`));
      setQuestion("");
      setAnswer("");
    }
  };

  const handleEdit = (index: number, line: string) => {
    const [q, a] = line.split(":");
    setEditIndex(index);
    setEditedQuestion(q.trim());
    setEditedAnswer(a.trim());
  };

  const handleSaveEdit = (index: number) => {
    if (editedQuestion.trim() && editedAnswer.trim()) {
      dispatch(
        editQnAItem({
          index,
          newValue: `${editedQuestion.trim()}:${editedAnswer.trim()}`,
        })
      );
      setEditIndex(null);
    }
  };

  const handleDelete = (index: number) => {
    dispatch(deleteQnAItem(index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">
            Q&A Knowledge Base
          </h1>
          <p className="text-gray-600 text-lg">
            Build your comprehensive question and answer collection
          </p>
        </div>

        {/* Input Form */}
        <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Add New Q&A
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your question..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Answer
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                rows={3}
                placeholder="Enter your answer..."
              />
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Q&A
            </button>
          </div>
        </div>

        {/* Q&A List */}
        {qnaItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <CornerDownRight className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Q&A Items Yet
            </h3>
            <p className="text-gray-500">
              Add your first question and answer using the form above.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {qnaItems.map((line: string, i: number) => {
              if (!line.includes(":")) return null;

              const [q, a, ...rest] = line.split(":");
              if (!q?.trim() || !a?.trim() || rest.length > 0) return null;

              const isEditing = editIndex === i;

              return (
                <div
                  key={i}
                  className={`bg-white rounded-lg border transition-all duration-300 ${
                    isEditing ? "border-blue-500" : "border-gray-200"
                  }`}
                >
                  <div className="p-4">
                    {isEditing ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={editedQuestion}
                          onChange={(e) => setEditedQuestion(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                          value={editedAnswer}
                          onChange={(e) => setEditedAnswer(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                          rows={3}
                        />
                        <button
                          onClick={() => handleSaveEdit(i)}
                          className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-all duration-200"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Save Changes
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-base font-semibold text-gray-800 leading-relaxed">
                              {q.trim()}
                            </h3>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(i, line)}
                              className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-all duration-200"
                            >
                              <Edit3 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(i)}
                              className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-all duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-700 leading-relaxed">
                            {a.trim()}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default QnAView;
