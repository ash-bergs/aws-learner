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

  return (
    <>
      <label htmlFor="tag" className="sr-only">
        Select a tag for the task
      </label>
      <select
        name="select task tag"
        id="tag"
        className="bg-gray-100 focus:outline text-text-secondary text-sm focus:outline-highlight rounded-full"
        value={selectedTag}
        onChange={(e) => onTagSelect(e.target.value)}
      >
        <option value="" disabled>
          Tag
        </option>
        {tags.map((tag) => (
          <option key={tag.id} value={tag.name}>
            {tag.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default TagSelector;
