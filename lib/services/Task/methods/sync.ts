import { db } from '@/lib/db';
import type { ServiceResponse } from '@/lib/services';

/**
 * Syncs tasks for a given user with the server.
 *
 * This function collects tasks with different sync statuses ('new', 'pending', 'deleted')
 * for the specified user and prepares them for synchronization with the server.
 * It also handles associated task tags for new and updated tasks.
 *
 * The function sends a POST request to the server with the user's tasks and task tags
 * to perform the synchronization. Upon successful synchronization, it marks new and
 * pending tasks as 'synced' and deletes the tasks marked as 'deleted'.
 *
 * @param {string} userId - The ID of the user whose tasks need to be synchronized.
 * @returns {Promise<ServiceResponse<number>>} A promise that resolves to the number of tasks
 * updated during the sync or an error message if the sync fails.
 */
export async function syncTasks(
  userId: string
): Promise<ServiceResponse<number>> {
  try {
    // fetch:
    // New tasks - sync status new
    const newTasks = await db.tasks
      .where('userId')
      .equals(userId)
      .and((t) => t.syncStatus === 'new')
      .toArray();
    // Updated tasks - sync status pending
    const updatedTasks = await db.tasks
      .where('userId')
      .equals(userId)
      .and((t) => t.syncStatus === 'pending')
      .toArray();
    // Deleted tasks - sync status deleted
    const deletedTasks = await db.tasks
      .where('userId')
      .equals(userId)
      .and((t) => t.syncStatus === 'deleted')
      .toArray();
    // Handle Task Tags
    const newTaskTags = await db.taskTags
      .where('taskId')
      .anyOf(newTasks.map((t) => t.id))
      .toArray();
    const updatedTaskTags = await db.taskTags
      .where('taskId')
      .anyOf(updatedTasks.map((t) => t.id))
      .toArray();

    //TODO: if NONE of this data is returned - throw error

    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        newTasks,
        updatedTasks,
        newTaskTags,
        updatedTaskTags,
        deletedTasks,
      }),
    });
    if (!response.ok) throw new Error('Failed to sync tasks');

    // Delete and/or mark synced tasks
    await db.tasks.where('syncStatus').equals('deleted').delete();
    const updated = await db.tasks
      .where('syncStatus')
      .anyOf(['new', 'pending'])
      .modify({ syncStatus: 'synced' });

    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: `Failed to sync tasks: ${error}` };
  }
}

/** Our Task Scenarios:
 *
 * 1. A task is added, it receives 'new' sync status
 *   1 a. Is a 'new' task is updated - it remains 'new' - it will not exist in the AWS db yet
 *   2 b. Is a 'new' task is deleted - it's completely removed, it will not exist in the AWS db, and does not need to be synced
 * 2. A task synced with AWS is updated, it receives 'pending' sync status
 *  2 a. Is a 'pending' task is deleted - it's marked deleted
 * 3. A task is deleted, it receives 'deleted' sync status - to support this we need to rethink how we handle deleting tasks above
 */
