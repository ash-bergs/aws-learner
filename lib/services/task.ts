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
      const tasks = await db.tasks.where('userId').equals(userId).toArray();
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
      // Delete related taskTags first to maintain data integrity
      await db.taskTags.where('taskId').equals(id).delete();

      // Delete the task
      await db.tasks.where('id').equals(id).delete();

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
      // Delete related taskTags in bulk
      await db.taskTags.where('taskId').anyOf(taskIds).delete();
      // Delete the tasks in bulk
      await db.tasks.where('id').anyOf(taskIds).delete();
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
      const updatedTask: Task = {
        ...task,
        completed,
        completedBy: completed ? userId : undefined, // if removing completion, set completedBy to null
        dateUpdated,
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
      const updatedTask: Task = {
        ...task,
        dueDate,
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
  // Sync tasks
  // Pulls pending changes from Dexie and sends them to the server
  // Marks Dexie tasks synced after successful sync
  // returns the count of synced tasks
  async syncTasks(userId: string): Promise<ServiceResponse<number>> {
    try {
      // fetch:
      // New tasks - sync status new - separate new and pending? Use the same one?
      const newTasks = await db.tasks
        .where('syncStatus')
        .equals('new')
        .toArray();
      // Updated tasks - sync status pending
      const updatedTasks = await db.tasks
        .where('syncStatus')
        .equals('pending')
        .toArray();
      // Deleted tasks - sync status deleted
      const deletedTasks = await db.tasks
        .where('syncStatus')
        .equals('deleted')
        .toArray();
      // Hit 'api/tasks/' endpoint, POST with the above data
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          newTasks,
          updatedTasks,
          deletedTaskIds: deletedTasks.map((t) => t.id),
        }),
      });
      // if response not okay - throw error
      if (!response.ok) throw new Error('Failed to sync tasks');
      // Mark synced tasks in Dexie
      // Something like: db.tasks.where('syncStatus').anyof([*statuses*]).modify({syncStatus: 'synced'})
      const updated = await db.tasks
        .where('syncStatus')
        .anyOf(['new', 'pending', 'deleted'])
        .modify({ syncStatus: 'synced' });

      return { success: true, data: updated };
    } catch (error) {
      return { success: false, error: `Failed to sync tasks: ${error}` };
    }
  }
}
