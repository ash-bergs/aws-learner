import { TagNode } from "@/lib/services/tags";
import React, { useState } from "react";
import TagItem from "./TasksToolbar.tsx/TagItem";
import { useTagStore } from "@/lib/store/tag";
import { buildTagPath, isPrefix, removeFromSet } from "@/lib/helpers/tag-tree";
type NestedTagListProps = {
  selectedPath: string[];
  setSelectedPath: React.Dispatch<React.SetStateAction<string[]>>;
};

const NestedTagList: React.FC<NestedTagListProps> = ({
  selectedPath,
  setSelectedPath,
}) => {
  const { tags, flatTags } = useTagStore();
  const [expandedTagIds, setExpandedTagIds] = useState<Set<string>>(new Set());

  const renderTags = (tags: TagNode[], depth = 0) => {
    return tags.map((tag) => (
      <div key={tag.id + tag.name}>
        <TagItem
          tag={tag}
          handleTagChange={() => {
            // Build the current path
            const newPath = buildTagPath(tag.id, flatTags);

            // Is this tag already part of the selected path?
            // If so where in the path is it?
            if (isPrefix(newPath, selectedPath)) {
              // remove the current tag from the path
              const truncatedPath = selectedPath.slice(0, newPath.length - 1);
              setSelectedPath(truncatedPath);
              setExpandedTagIds((prev) =>
                removeFromSet(prev, selectedPath.slice(newPath.length - 1))
              );
            } else {
              // add this tag to the path
              setSelectedPath(newPath);
              setExpandedTagIds(new Set(newPath));
            }
          }}
          active={selectedPath.includes(tag.id)}
        />
        {/** If this tag is the selected tag - render the tags that fall under it */}
        {expandedTagIds.has(tag.id) && tag.children.length > 0 && (
          <div>{renderTags(tag.children, depth + 1)}</div>
        )}
      </div>
    ));
  };
  return <div>{renderTags(tags)}</div>;
};

export default NestedTagList;
