import React from 'react';
import { Tag } from '@/lib/db';
import { COLORS } from '@/utils/constants';

type TagSortingProps = {
  selectedTagIds: string[];
  handleTagChange: (tagId: string) => void;
  tag: Tag;
};

/**
 * A component to render a single tag item.
 *
 * The component renders a button for the tag with the name of the tag and
 * a background color based on the color of the tag. If the tag is the current
 * tag, it renders a border around the tag.
 *
 * @param {TagSortingProps} props - The props for the component.
 */
const TagItem = ({ tag, selectedTagIds, handleTagChange }: TagSortingProps) => {
  const isSelected = selectedTagIds.includes(tag.id);
  const bgColor = tag.color
    ? COLORS.find((color) => color.name === tag.color)?.class
    : 'bg-note';
  const textColor = tag.color
    ? COLORS.find((color) => color.name === tag.color)?.text
    : 'text-text';
  return (
    <button
      key={tag.id}
      className={`
                p-2 rounded-full font-medium shadow ${bgColor} ${textColor} ${
        isSelected
          ? 'border-2 border-highlight font-bold'
          : 'border-2 border-transparent'
      }`}
      onClick={() => handleTagChange(tag.id)}
    >
      {tag.name}
    </button>
  );
};

export default TagItem;

// TODO: it would be nice to see a count of the tasks that belong to the tag
