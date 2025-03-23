import { db, Tag } from "../db";
import { v4 as uuidv4 } from "uuid";
import type { ServiceResponse } from "@/lib/services";

// Define the shape of the tree - like:
// { id: "1", name: "Work", color: "red", children: [{ id: "2", name: "Work", color: "red", children: [] }] }
export interface TagNode extends Tag {
  children: TagNode[];
}

// Recursively build a tree structure from the tags
function buildTagTree(tags: Tag[], parentId?: string | null): TagNode[] {
  return tags
    .filter((tag) => tag.parentId === parentId)
    .map((tag) => ({
      ...tag,
      children: buildTagTree(tags, tag.id),
    }));
}

/**
 * The TagsService is responsible for all CRUD operations on the tags table in the database
 *
 * The taskTags table is a join table, which is used to link tasks to their tags
 * The service is used both for creating/updating/deleting tags and for linking
 * tasks to tags
 */
export class TagsService {
  async createTag(
    userId: string,
    name: string,
    color?: string,
    parentId?: string
  ): Promise<ServiceResponse<Tag>> {
    try {
      const newTagId = uuidv4();
      const newTag: Tag = {
        id: newTagId,
        name,
        color,
        userId,
        parentId,
      };
      await db.tags.add(newTag);
      return { success: true, data: newTag };
    } catch (error) {
      console.error("Failed to create tag:", error);
      return { success: false, error: "Failed to create tag" };
    }
  }
  async getTagsByUser(
    userId: string
  ): Promise<ServiceResponse<{ tags: TagNode[]; flatTags: Tag[] }>> {
    try {
      const tags = await db.tags.where("userId").equals(userId).toArray();
      const tagTree = buildTagTree(tags);
      return { success: true, data: { tags: tagTree, flatTags: tags } };
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      return { success: false, error: "Failed to fetch tags" };
    }
  }

  // All of these are unused, but need to be implemented
  async deleteTag(tagId: string): Promise<ServiceResponse<boolean>> {
    try {
      await db.tags.delete(tagId);
      await db.taskTags.where("tagId").equals(tagId).delete();
      return { success: true, data: true };
    } catch (error) {
      console.error("Failed to delete tag:", error);
      return { success: false, error: "Failed to delete tag" };
    }
  }
  async linkTagToTask(
    tagId: string,
    taskId: string
  ): Promise<ServiceResponse<boolean>> {
    try {
      await db.taskTags.add({ tagId, taskId });
      return { success: true, data: true };
    } catch (error) {
      console.error("Failed to link tag to task:", error);
      return { success: false, error: "Failed to link tag to task" };
    }
  }
  async unlinkTagFromTask(
    tagId: string,
    taskId: string
  ): Promise<ServiceResponse<boolean>> {
    try {
      await db.taskTags
        .where("[taskId+tagId]")
        .equals([taskId, tagId])
        .delete();
      return { success: true, data: true };
    } catch (error) {
      console.error("Failed to unlink tag from task:", error);
      return { success: false, error: "Failed to unlink tag from task" };
    }
  }
}
