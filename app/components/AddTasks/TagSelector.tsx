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
    <select
      className="bg-gray-100 focus:outline focus:outline-highlight text-text rounded-full"
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
  );
};

export default TagSelector;
