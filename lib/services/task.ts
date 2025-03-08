import { type ServiceAddTaskInput } from '@/types/service';
import { db, Task, Tag } from '../db';
import { v4 as uuidv4 } from 'uuid';

/** This file holds the Task service
 * The Task service is responsible for CRUD operations on the tasks table in the database
 */

// TODO:
// Update the types with Prisma types - add Promise<type> returns

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
  async getAllTasks(userId: string): Promise<TaskWithTags[]> {
    try {
      // Fetch tasks by user id
      const tasks = await db.tasks.where('userId').equals(userId).toArray();

      // If we have no tasks we can return now
      if (tasks.length === 0) return [];

      // We have tasks - do they have tags?
      const taskTags = await db.taskTags
        .where('taskId')
        .anyOf(tasks.map((task) => task.id))
        .toArray();

      // If we have no tags we can return now with the tasks
      if (taskTags.length === 0) {
        return tasks.map((task) => ({ ...task, taskTags: [] }));
      }

      // We've found tasks, and they have tags
      const tags = await db.tags.bulkGet(
        taskTags.map((taskTag) => taskTag.tagId)
      );

      // Enrich the tasks with their tags
      return tasks.map((task) => ({
        ...task,
        taskTags: taskTags
          .filter((tt) => tt.taskId === task.id)
          .map((tt) => ({
            taskId: tt.taskId,
            tagId: tt.tagId,
            tag: tags.find((tag) => tag?.id === tt.tagId) || null,
          })),
      }));
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      return [];
    }
  }

  async addTask({
    userId,
    text,
    tagIds,
    dueDate,
    priority,
  }: ServiceAddTaskInput): Promise<TaskWithTags | null> {
    try {
      // Gen. id for task
      const newTaskId = uuidv4();
      const taskDueDate = dueDate ? new Date(dueDate) : undefined;

      // Find the highest position value among the user's tasks
      const highestPositionTask = await db.tasks
        .where('userId')
        .equals(userId)
        .sortBy('position'); // Sorts in ascending order

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

      return taskWithTags;
    } catch (error) {
      console.error('Failed to add task:', error);
      return null;
    }
  }
  async deleteTask(id: string): Promise<boolean> {
    try {
      // Delete related taskTags first to maintain data integrity
      await db.taskTags.where('taskId').equals(id).delete();

      // Delete the task
      await db.tasks.where('id').equals(id).delete();

      return true;
    } catch (error) {
      console.error('Failed to delete task:', error);
      return false;
    }
  }

  async deleteTasksByIds(taskIds: string[]): Promise<boolean> {
    try {
      if (taskIds.length === 0) return false;

      // Delete related taskTags in bulk
      await db.taskTags.where('taskId').anyOf(taskIds).delete();

      // Delete the tasks in bulk
      await db.tasks.where('id').anyOf(taskIds).delete();

      return true;
    } catch (error) {
      console.error('Failed to delete tasks:', error);
      return false;
    }
  }
  async toggleComplete(id: string, userId: string, completed: boolean) {
    try {
      const dateUpdated = new Date();
      const task = await db.tasks.get(id);
      if (!task) {
        console.log(`❌ Task not found: ${id}`);
        return null;
      }

      // Update the task in Dexie
      const updatedTask: Task = {
        ...task,
        completed,
        completedBy: completed ? userId : undefined, // if removing completion, set completedBy to null
        dateUpdated,
      };
      await db.tasks.update(id, updatedTask);

      return updatedTask;
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
      return null;
    }
  }
  async updateTaskDueDate(id: string, dueDate: Date) {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id, dueDate }),
      });

      if (!response.ok) throw new Error('Failed to update task due date');
      const updatedTask = await response.json();
      return updatedTask;
    } catch (error) {
      console.error('Failed to update task due date:', error);
      return null;
    }
  }
  async updateTaskPosition(id: string, newPosition: number) {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id, position: newPosition }),
      });

      if (!response.ok) throw new Error('Failed to update task order');
      const updatedTask = await response.json();
      return updatedTask;
    } catch (error) {
      console.error('Failed to update task order:', error);
      return null;
    }
  }
}
