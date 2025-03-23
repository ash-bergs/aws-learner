import React, { type JSX, useState } from "react";
import { useTagStore } from "@/lib/store/tag";
import { buildTagPath, getAllDescendantTagIds } from "@/lib/helpers/tag-tree";
import TagItem from "./TasksToolbar.tsx/TagItem";

type NestedTagTreeProps = {
  selectedTagIds: Set<string>;
  setSelectedTagIds: (ids: Set<string>) => void;
  onClearExpanded?: (callback: () => void) => void;
};

const NestedTagTree: React.FC<NestedTagTreeProps> = ({
  selectedTagIds,
  setSelectedTagIds,
  onClearExpanded,
}) => {
  const { flatTags } = useTagStore();
  const [expandedTagIds, setExpandedTagIds] = useState<Set<string>>(new Set());

  const topLevelTags = flatTags.filter((tag) => !tag.parentId);
  // Expose the reset logic to parent
  React.useEffect(() => {
    if (onClearExpanded) {
      onClearExpanded(() => {
        setExpandedTagIds(new Set());
      });
    }
  }, [onClearExpanded]);
  const toggleTag = (tagId: string) => {
    const newSet = new Set(selectedTagIds);
    // Build full path from this tag to its root
    const path = buildTagPath(tagId, flatTags);

    // 🕵️‍♀️ Case 1: The tag is already selected (we're clicking again to deselect)
    if (newSet.has(tagId)) {
      // Get all the descendants of this tag - add to deselected set
      const allDescendants = getAllDescendantTagIds(tagId, flatTags);
      // Add the tag itself to the deselected set
      allDescendants.push(tagId);
      // Remove all the descendants from the deselected set
      allDescendants.forEach((id) => newSet.delete(id));

      // Collapse any expanded descendants
      setExpandedTagIds((prev) => {
        const next = new Set(prev);
        allDescendants.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      // 🕵️‍♀️ Case 2: The tag is not selected (we're clicking to select)
      newSet.add(tagId);
      setExpandedTagIds((prev) => {
        const next = new Set(prev);
        path.forEach((id) => next.add(id));
        return next;
      });
    }

    setSelectedTagIds(newSet);
  };

  const renderChildrenRecursively = (parentId: string): JSX.Element | null => {
    const children = flatTags.filter((tag) => tag.parentId === parentId);

    if (children.length === 0 || !expandedTagIds.has(parentId)) return null;

    return (
      <div key={parentId} className="pl-4">
        <p className="text-xs font-semibold text-text/80 mb-1">
          {flatTags.find((t) => t.id === parentId)?.name}
        </p>
        <div className="flex flex-wrap gap-2 mb-2">
          {children.map((child) => (
            <TagItem
              key={child.id}
              tag={child}
              active={selectedTagIds.has(child.id)}
              handleTagChange={() => toggleTag(child.id)}
            />
          ))}
        </div>
        {children.map((child) => renderChildrenRecursively(child.id))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Top-level parent tags */}
      <div className="flex flex-wrap gap-2">
        {topLevelTags.map((tag) => (
          <TagItem
            key={tag.id}
            tag={tag}
            active={selectedTagIds.has(tag.id)}
            handleTagChange={() => toggleTag(tag.id)}
          />
        ))}
      </div>

      {/* Recursively render selected/expanded children for each top-level parent */}
      {topLevelTags.map((parent) => renderChildrenRecursively(parent.id))}
    </div>
  );
};

export default NestedTagTree;
