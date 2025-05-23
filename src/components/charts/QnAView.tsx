import React, { useState } from "react";
import { MessageCircle, CornerDownRight, Plus, Edit3, Trash2, CheckCircle } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { addQnAItem, editQnAItem, deleteQnAItem } from "@/app/store/dataSlice";

export default function QnAView() {
  const dispatch = useDispatch();
  const qnaItems = useSelector((state: any) => state.swot.qnaData);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleSubmit = () => {
    if (!question.trim() || !answer.trim()) return;

    const item = `${question.trim()}:${answer.trim()}`;

    if (editIndex !== null) {
      dispatch(editQnAItem({ index: editIndex, newValue: item }));
      setEditIndex(null);
    } else {
      dispatch(addQnAItem(item));
    }

    setQuestion("");
    setAnswer("");
  };

  const handleEdit = (index: number, line: string) => {
    const [q, a] = line.split(":");
    setQuestion(q || "");
    setAnswer(a || "");
    setEditIndex(index);
  };

  const handleDelete = (index: number) => {
    dispatch(deleteQnAItem(index));
    if (editIndex === index) {
      setEditIndex(null);
      setQuestion("");
      setAnswer("");
    }
  };

  const handleCancel = () => {
    setQuestion("");
    setAnswer("");
    setEditIndex(null);
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

        {/* Q&A List */}
        {qnaItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No questions yet
            </h3>
            <p className="text-gray-500">
              Start building your knowledge base by adding your first Q&A pair above.
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
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-white" />
                      </div>
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
                          <Edit3 className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(i)}
                          className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-all duration-200"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                        <CornerDownRight className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700 leading-relaxed">
                          {a.trim()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Input Form */}
        <div className="bg-white rounded-lg p-6 mt-8 mb-8 border border-gray-200">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Question
                </label>
                <input
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 text-gray-800 placeholder-gray-400"
                  placeholder="What would you like to know?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Answer
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 text-gray-800 placeholder-gray-400 resize-none"
                  placeholder="Provide a comprehensive answer..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={!question.trim() || !answer.trim()}
              >
                {editIndex !== null ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Update Q&A
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Add Q&A
                  </>
                )}
              </button>

              {editIndex !== null && (
                <button
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all duration-300"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
