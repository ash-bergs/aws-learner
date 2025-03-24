import type { Tag } from "@/lib/db";

/**
 * Builds an array of tag ids from a given tagId up to the root
 *
 * @param tagId - The ID of the tag to start from
 * @param flatTags - The array of all tags
 * @returns An array of tag ids representing the path from the given tag to the root
 */
export const buildTagPath = (tagId: string, flatTags: Tag[]): string[] => {
  const path: string[] = [];

  let current = flatTags.find((tag) => tag.id === tagId);

  while (current) {
    // add to the beginning
    path.unshift(current.id);
    // is the top level, stop
    if (!current.parentId) break;
    current = flatTags.find((tag) => tag.id === current?.parentId);
  }
  return path;
};

/** Helper functions to make the tag updating easier to read */
export function isPrefix(pathA: string[], pathB: string[]) {
  return (
    pathB.length >= pathA.length && // if pathB is longer than pathA, it can't be a prefix
    pathB.slice(0, pathA.length).every((id, index) => id === pathA[index])
  ); // If the first n elements are the same
}

export function removeFromSet(set: Set<string>, values: string[]) {
  const next = new Set(set);
  for (const value of values) next.delete(value);
  return next;
}

/**
 * Recursively retrieves all descendant tag IDs for a given parent tag ID.
 *
 * This function traverses a flat list of tags to find all tags that are
 * descendants of the specified parent tag. It recursively collects the IDs
 * of all children tags and their descendants.
 *
 * @param parentId - The ID of the parent tag from which to start the search.
 * @param flatTags - An array of all tags in a flat structure.
 * @returns An array of tag IDs representing all descendants of the specified parent tag.
 */
export function getAllDescendantTagIds(
  parentId: string,
  flatTags: Tag[]
): string[] {
  const descendants: string[] = [];

  const collect = (id: string) => {
    // Look for all the children of this tagId
    const children = flatTags.filter((tag) => tag.parentId === id);
    for (const child of children) {
      // For every child look for its children
      descendants.push(child.id);
      // Do this until there are no more children
      collect(child.id);
    }
  };

  collect(parentId);
  return descendants;
}
