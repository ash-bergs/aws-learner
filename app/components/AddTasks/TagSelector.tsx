'use client';

import React from 'react';
import { useTagStore } from '@/lib/store/tag';
const TagSelector = ({
  selectedTag,
  onTagSelect,
}: {
  selectedTag: string;
  onTagSelect: (tag: string) => void;
}) => {
  const { tags } = useTagStore();

  if (tags.length === 0) return null;

  return (
    <div className="relative w-min">
      <select
        name="select task tag"
        aria-label="Select a tag for the task"
        id="tag"
        className="bg-background border focus:outline text-text font-semibold text-sm focus:outline-highlight rounded-full appearance-none px-2 py-1 pr-6"
        value={selectedTag}
        onChange={(e) => onTagSelect(e.target.value)}
      >
        <option value="">Select a Tag</option>
        {tags.map((tag) => (
          <option key={tag.id} value={tag.id}>
            {tag.name}
          </option>
        ))}
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
