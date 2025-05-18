"use client";
import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagsInputProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  editTag?: boolean;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export interface TagsInputRef {
  checkAndAddPendingTag: () => boolean;
  hasInput: () => boolean;
}

export const TagsInput = forwardRef<TagsInputRef, TagsInputProps>(
  (
    {
      tags,
      setTags,
      editTag = true,
      placeholder = "Add a Tag...",
      required = false,
      className="",
    },
    ref
  ) => {
    const [input, setInput] = useState("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const editInputRef = useRef<HTMLInputElement>(null);

    const addTag = (trimmedInput: string) => {
      if (trimmedInput && !tags.includes(trimmedInput)) {
        setTags([...tags, trimmedInput]);
        setInput("");
        return true;
      }
      return false;
    };

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      checkAndAddPendingTag: () => {
        const trimmedInput = input.trim();
        return addTag(trimmedInput);
      },
      hasInput: () => input.trim().length > 0,
    }));

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const trimmedInput = input.trim();
      if ((e.key === "Enter" || e.key === ",") && trimmedInput) {
        e.preventDefault();
        addTag(trimmedInput);
      }
    };

    const handleButtonClick = () => {
      const trimmedInput = input.trim();
      addTag(trimmedInput);
    };

    const handleRemoveTag = (tag: string) => {
      setTags(tags.filter((t) => t !== tag));
      if (editingIndex !== null) {
        setEditingIndex(null);
      }
    };

    const handleEditTag = (index: number) => {
      if (editTag) {
        setInput(tags[index]);
        setEditingIndex(index);
        setTimeout(() => editInputRef.current?.focus(), 0);
      }
    };

    const handleBlur = () => {
      if (editingIndex !== null) {
        const updatedTags = [...tags];
        const trimmedInput = input.trim();
        if (trimmedInput) {
          updatedTags[editingIndex] = trimmedInput;
        } else {
          updatedTags.splice(editingIndex, 1);
        }
        setTags(updatedTags);
        setEditingIndex(null);
      }
      setInput("");
    };

    useEffect(() => {
      if (editInputRef.current) {
        editInputRef.current.style.width = `${input.length + 1}ch`;
      }
    }, [input]);

    return (
      <div className={cn("flex flex-wrap items-center gap-2 p-2 border-2 rounded-md focus-within:border-blue-500 bg-background", className)}>
        {tags.map((tag, index) => (
          <div key={tag} className="relative">
            {editTag && editingIndex === index ? (
              <input
                ref={editInputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleAddTag}
                onBlur={handleBlur}
                className="px-2 py-1 text-sm border rounded outline-none"
                placeholder="Edit tag..."
                style={{ width: `${input.length + 1 * 1.2}px` }}
                autoFocus
              />
            ) : (
              <span
                onClick={() => handleEditTag(index)}
                className="flex items-center gap-2 px-1 pl-2 py-1 text-sm font-medium text-white bg-blue-500 rounded cursor-pointer hover:bg-blue-600"
              >
                {tag}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveTag(tag);
                  }}
                  className="text-white hover:text-gray-300 px-1 focus:outline-none bg-background rounded"
                >
                  &times;
                </button>
              </span>
            )}
          </div>
        ))}
        <div className="flex items-center gap-2 flex-grow min-w-[150px]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleAddTag}
            className={`flex-grow px-2 py-1 text-sm border-none outline-none bg-background rounded-md ${
              editingIndex !== null ? "opacity-0" : "opacity-100"
            }`}
            placeholder={placeholder}
          />
          {input.trim() && (
            <button
              type="button"
              onClick={handleButtonClick}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              aria-label="Add tag"
            >
              <Plus className="h-5 w-5 text-blue-500" />
            </button>
          )}
        </div>
      </div>
    );
  }
);
