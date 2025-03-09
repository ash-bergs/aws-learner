import { db, Tag } from '../db';
import { v4 as uuidv4 } from 'uuid';
import type { ServiceResponse } from '@/lib/services';
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
    color?: string
  ): Promise<ServiceResponse<Tag>> {
    try {
      const newTagId = uuidv4();
      const newTag: Tag = {
        id: newTagId,
        name,
        color,
        userId,
      };
      await db.tags.add(newTag);
      return { success: true, data: newTag };
    } catch (error) {
      console.error('Failed to create tag:', error);
      return { success: false, error: 'Failed to create tag' };
    }
  }
  async getTagsByUser(userId: string): Promise<ServiceResponse<Tag[]>> {
    try {
      const tags = await db.tags.where('userId').equals(userId).toArray();
      return { success: true, data: tags };
    } catch (error) {
      console.error('Failed to fetch tags:', error);
      return { success: false, error: 'Failed to fetch tags' };
    }
  }

  // All of these are unused, but need to be implemented
  async deleteTag(tagId: string): Promise<ServiceResponse<boolean>> {
    try {
      await db.tags.delete(tagId);
      await db.taskTags.where('tagId').equals(tagId).delete();
      return { success: true, data: true };
    } catch (error) {
      console.error('Failed to delete tag:', error);
      return { success: false, error: 'Failed to delete tag' };
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
      console.error('Failed to link tag to task:', error);
      return { success: false, error: 'Failed to link tag to task' };
    }
  }
  async unlinkTagFromTask(
    tagId: string,
    taskId: string
  ): Promise<ServiceResponse<boolean>> {
    try {
      await db.taskTags
        .where('[taskId+tagId]')
        .equals([taskId, tagId])
        .delete();
      return { success: true, data: true };
    } catch (error) {
      console.error('Failed to unlink tag from task:', error);
      return { success: false, error: 'Failed to unlink tag from task' };
    }
  }
}
