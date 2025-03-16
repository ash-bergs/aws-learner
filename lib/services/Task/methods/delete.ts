import { db } from '@/lib/db';
import type { ServiceResponse } from '@/lib/services';

export async function deleteTask(
  id: string
): Promise<ServiceResponse<boolean>> {
  try {
    // TODO: update this, but we need to add Tags to syncing
    // Delete related taskTags first to maintain data integrity
    await db.taskTags.where('taskId').equals(id).delete();

    // // Delete the task
    // await db.tasks.where('id').equals(id).delete();

    // Mark items for deletion until synced with RDS
    // TODO: Unless user has opted-out of data-sharing/syncing, then we can do the above
    await db.tasks.update(id, { syncStatus: 'deleted' });
    return { success: true, data: true };
  } catch (error) {
    console.error('Failed to delete task:', error);
    return { success: false, error: 'Failed to delete task' };
  }
}

/**
 * Deletes tasks in bulk given an array of task ids.
 *
 * The function takes an array of task ids, deletes the related taskTags in bulk,
 * and then deletes the tasks in bulk.
 *
 * If the array of task ids is empty, the function simply returns a successful response.
 *
 * @param {string[]} taskIds The array of task ids to be deleted
 * @returns {Promise<ServiceResponse<boolean>>} A promise resolving to a boolean value
 * indicating success or failure of the bulk deletion
 */
export async function deleteTasksByIds(
  taskIds: string[]
): Promise<ServiceResponse<boolean>> {
  try {
    if (taskIds.length === 0) {
      return { success: true, data: true };
    }
    // // Delete related taskTags in bulk
    // await db.taskTags.where('taskId').anyOf(taskIds).delete();
    // // Delete the tasks in bulk
    // await db.tasks.where('id').anyOf(taskIds).delete();

    // Mark items for deletion until synced with RDS
    // TODO: Unless user has opted-out of data-sharing/syncing, then we can do the above
    await db.tasks.where('id').anyOf(taskIds).modify({ syncStatus: 'deleted' });

    return { success: true, data: true };
  } catch (error) {
    console.error('Failed to delete tasks:', error);
    return { success: false, error: 'Failed to delete tasks' };
  }
}
