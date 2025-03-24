"use client";

import React, { type JSX } from "react";
import { useTagStore } from "@/lib/store/tag";
import { TagNode } from "@/lib/services/tags";

const TagSelector = ({
  selectedTag,
  onTagSelect,
}: {
  selectedTag: string;
  onTagSelect: (tag: string) => void;
}) => {
  const { tags } = useTagStore();
  if (!tags.length) return null;

  // Recursive function to flatten tree with indentation
  const renderOptions = (nodes: TagNode[], depth = 0): JSX.Element[] => {
    return nodes.flatMap((node) => {
      const indent = "—".repeat(depth); // visual indent
      const option = (
        <option key={node.id} value={node.id}>
          {indent} {node.name}
        </option>
      );
      const children = renderOptions(node.children, depth + 1);
      return [option, ...children];
    });
  };

  return (
    <div className="relative w-min">
      <select
        name="select task tag"
        aria-label="Select a tag for the task"
        id="tag"
        className="bg-background focus:outline text-text font-semibold text-sm focus:outline-highlight rounded-full appearance-none px-2 py-1 pr-6"
        value={selectedTag}
        onChange={(e) => onTagSelect(e.target.value)}
      >
        <option value="">Select a Tag</option>
        {renderOptions(tags)}
      </select>
      <div className="absolute inset-y-0 right-2 text-text flex items-center pointer-events-none">
        <svg
          className="w-4 h-4 text-text"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default TagSelector;
