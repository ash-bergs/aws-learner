import React from 'react';
import { Tag } from '@/lib/db';

type TagSortingProps = {
  currentTagId: string | null;
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
const TagItem = ({ tag, currentTagId, handleTagChange }: TagSortingProps) => {
  return (
    <button
      key={tag.id}
      className={`
                px-2 py-2 text-sm font-bold rounded rounded-full bg-primary hover:bg-secondary text-white ${
                  currentTagId === tag.id
                    ? 'border-2 border-highlight bg-secondary'
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
