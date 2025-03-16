import { db, TaskWithTags } from '@/lib/db';
import type { ServiceResponse } from '@/lib/services';

/**
 * Fetches all tasks for a given user, along with their tags
 *
 * The function first fetches the tasks for the user, then fetches the
 * associated tags, and finally enriches the tasks with the tags.
 *
 * @param {string} userId The id of the user for which to fetch tasks
 * @returns {Promise<TaskWithTags[]>} A promise resolving to an array of tasks
 * with their associated tags
 */
export async function getAllTasks(
  userId: string
): Promise<ServiceResponse<TaskWithTags[]>> {
  try {
    // Fetch tasks by user id
    const tasks = await db.tasks
      .where('userId')
      .equals(userId)
      .filter((task) => task.syncStatus !== 'deleted')
      .toArray();
    // If we have no tasks we can return now
    if (tasks.length === 0) {
      return { success: true, data: [] };
    }
    // We have tasks - do they have tags?
    const taskTags = await db.taskTags
      .where('taskId')
      .anyOf(tasks.map((task) => task.id))
      .toArray();
    // No tags we can return now with the tasks
    if (taskTags.length === 0) {
      return {
        success: true,
        data: tasks.map((task) => ({ ...task, taskTags: [] })),
      };
    }
    // We've found tasks, and they have tags
    const tags = await db.tags.bulkGet(
      taskTags.map((taskTag) => taskTag.tagId)
    );
    // Enrich the tasks with their tags
    const enrichedTasks = tasks.map((task) => ({
      ...task,
      taskTags: taskTags
        .filter((tt) => tt.taskId === task.id)
        .map((tt) => ({
          taskId: tt.taskId,
          tagId: tt.tagId,
          tag: tags.find((tag) => tag?.id === tt.tagId) || null,
        })),
    }));
    return { success: true, data: enrichedTasks };
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return { success: false, error: 'Failed to fetch tasks' };
  }
}
