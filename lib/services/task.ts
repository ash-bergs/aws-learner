import { type ServiceAddTaskInput } from '@/types/service';
import { db, Task, Tag } from '../db';
import { v4 as uuidv4 } from 'uuid';
import type { ServiceResponse } from '@/lib/services';

/** This file holds the Task service
 * The Task service is responsible for CRUD operations on the tasks table in the database
 */
export interface TaskWithTags extends Task {
  taskTags: Array<{
    taskId: string;
    tagId: string;
    tag: Tag | null;
  }>;
}
export class TaskService {
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
  async getAllTasks(userId: string): Promise<ServiceResponse<TaskWithTags[]>> {
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
  /**
   * Adds a new task for a given user with the given properties.
   *
   * Finds the highest position value among the user's tasks, assigns a new float
   * position (e.g., next step could be highest + 1.0), and creates a new task with
   * the given properties. If there are tags, creates task-tag relationships.
   *
   * @param {ServiceAddTaskInput} input The input object for the new task
   * @returns {Promise<TaskWithTags | null>} A promise resolving to the added task,
   * or null if there was an error
   */
  async addTask({
    userId,
    text,
    tagIds,
    dueDate,
    priority,
  }: ServiceAddTaskInput): Promise<ServiceResponse<TaskWithTags>> {
    try {
      // Gen. id for task
      const newTaskId = uuidv4();
      const taskDueDate = dueDate ? new Date(dueDate) : undefined;

      // Find the highest position value among the user's tasks
      const highestPositionTask = await db.tasks
        .where('userId')
        .equals(userId)
        .sortBy('position');
      const highestPosition = highestPositionTask.length
        ? highestPositionTask[highestPositionTask.length - 1].position
        : 0;
      // Assign a new float position (e.g., next step could be highest + 1.0)
      const newTaskPosition = highestPosition + 1.0;

      // Create the new task
      const newTask: Task = {
        id: newTaskId,
        userId,
        text,
        completed: false,
        completedBy: undefined,
        color: undefined,
        dateAdded: new Date(),
        dateUpdated: new Date(),
        position: newTaskPosition,
        dueDate: taskDueDate,
        syncStatus: 'new',
        priority,
      };

      await db.tasks.add(newTask);

      // If there are tags, create task-tag relationships
      const taskTags = tagIds?.map((tagId) => ({
        taskId: newTaskId,
        tagId,
      }));
      if (taskTags && taskTags.length > 0) {
        await db.taskTags.bulkAdd(taskTags);
      }

      // Fetch the tags to return in the correct TaskWithTags shape
      const tags = tagIds ? await db.tags.bulkGet(tagIds) : [];
      const taskWithTags: TaskWithTags = {
        ...newTask,
        taskTags: (taskTags ?? []).map((tt) => ({
          taskId: tt.taskId,
          tagId: tt.tagId,
          tag: tags.find((tag) => tag?.id === tt.tagId) || null,
        })),
      };

      return { success: true, data: taskWithTags };
    } catch (error) {
      console.error('Failed to add task:', error);
      return { success: false, error: 'Failed to add task' };
    }
  }
  async deleteTask(id: string): Promise<ServiceResponse<boolean>> {
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
  async deleteTasksByIds(taskIds: string[]): Promise<ServiceResponse<boolean>> {
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
      await db.tasks
        .where('id')
        .anyOf(taskIds)
        .modify({ syncStatus: 'deleted' });

      return { success: true, data: true };
    } catch (error) {
      console.error('Failed to delete tasks:', error);
      return { success: false, error: 'Failed to delete tasks' };
    }
  }
  async toggleComplete(
    id: string,
    userId: string,
    completed: boolean
  ): Promise<ServiceResponse<Task>> {
    try {
      const dateUpdated = new Date();
      const task = await db.tasks.get(id);
      if (!task) {
        return { success: false, error: 'Task not found' };
      }

      // Update the task in Dexie
      const syncStatus =
        task.syncStatus === 'synced' ? 'pending' : task.syncStatus;
      const updatedTask: Task = {
        ...task,
        completed,
        completedBy: completed ? userId : undefined, // if removing completion, set completedBy to null
        dateUpdated,
        syncStatus,
      };
      await db.tasks.update(id, updatedTask);

      return { success: true, data: updatedTask };
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
      return { success: false, error: 'Failed to toggle task completion' };
    }
  }
  async updateTaskDueDate(
    id: string,
    dueDate: Date
  ): Promise<ServiceResponse<Task>> {
    try {
      const task = await db.tasks.get(id);
      if (!task) {
        console.log(`❌ Task not found: ${id}`);
        return { success: false, error: 'Task not found' };
      }

      // Update the due date
      const syncStatus =
        task.syncStatus === 'synced' ? 'pending' : task.syncStatus;
      const updatedTask: Task = {
        ...task,
        dueDate,
        syncStatus,
      };
      await db.tasks.update(id, updatedTask);

      return { success: true, data: updatedTask };
    } catch (error) {
      console.error('Failed to update task due date:', error);
      return { success: false, error: 'Failed to update task due date' };
    }
  }
  async updateTaskPosition(
    id: string,
    newPosition: number
  ): Promise<ServiceResponse<Task>> {
    try {
      const dateUpdated = new Date();
      const task = await db.tasks.get(id);
      if (!task) {
        console.log(`❌ Task not found: ${id}`);
        return { success: false, error: 'Task not found' };
      }

      // TODO: make this more readable
      // determine sync status -
      // if currently is 'synced' - update to 'pending'
      // otherwise keep current sync status
      const syncStatus =
        task.syncStatus === 'synced' ? 'pending' : task.syncStatus;

      const updatedTask: Task = {
        ...task,
        position: newPosition,
        syncStatus,
        dateUpdated,
      };
      await db.tasks.update(id, updatedTask);

      return { success: true, data: updatedTask };
    } catch (error) {
      console.error('Failed to update task order:', error);
      return { success: false, error: 'Failed to update task order' };
    }
  }
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
  async syncTasks(userId: string): Promise<ServiceResponse<number>> {
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
