import { db, Tag } from '../db';

/**
 * The TagsService is responsible for all CRUD operations on the tags table in the database
 *
 * The taskTags table is a join table, which is used to link tasks to their tags
 * The service is used both for creating/updating/deleting tags and for linking
 * tasks to tags
 */
export class TagsService {
  async createTag(userId: string, name: string, color?: string): Promise<Tag> {
    const response = await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, name, color }),
    });
    if (!response.ok) throw new Error('Failed to create tag');
    return response.json();
  }
  async getTagsByUser(userId: string) {
    const tags = await fetch(`/api/tags?userId=${userId}`);
    if (!tags.ok) throw new Error('Failed to fetch tags');
    return tags;
  }

  // NEEDS UPDATING
  async deleteTag(tagId: string) {
    await db.tags.delete(tagId);
    await db.taskTags.where('tagId').equals(tagId).delete();
  }
  async linkTagToTask(tagId: string, taskId: string) {
    await db.taskTags.add({ tagId, taskId });
  }
  async unlinkTagFromTask(tagId: string, taskId: string) {
    await db.taskTags.where('[taskId+tagId]').equals([taskId, tagId]).delete();
  }
  async getTasksByTag(tagId: string) {
    const taskIds = await db.taskTags
      .where('tagId')
      .equals(tagId)
      .toArray()
      .then((taskIds) => taskIds.map((task) => task.taskId));

    return db.tasks.bulkGet(taskIds);
  }
}
