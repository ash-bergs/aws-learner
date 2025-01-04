import { db, Tag } from '../db';

/**
 * The TagsService is responsible for all CRUD operations on the tags table in the database
 *
 * The taskTags table is a join table, which is used to link tasks to their tags
 * The service is used both for creating/updating/deleting tags and for linking
 * tasks to tags
 */
export class TagsService {
  // create tag
  async createTag(userId: string, name: string, color?: string): Promise<Tag> {
    // check if tag already exists
    const existingTag = await db.tags.where('name').equals(name).first();
    if (existingTag) {
      return existingTag;
    }

    const id = crypto.randomUUID();
    const tag = {
      id,
      name,
      color,
      userId,
    };

    const newTag = await db.tags.add(tag);
    const newTagWithId = await db.tags.get(newTag);
    if (!newTagWithId) throw new Error('Tag not found');
    return newTagWithId;
  }
  async getTagsByUser(userId: string) {
    const tags = await db.tags.where('userId').equals(userId).toArray();
    return tags;
  }
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
