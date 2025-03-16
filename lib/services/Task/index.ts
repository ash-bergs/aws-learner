import { ServiceAddTaskInput } from '@/types/service';
import { ServiceResponse } from '..';
import { Task, TaskWithTags } from '../../db';
import { addTask } from '@/lib/services/Task/methods/add';
import {
  deleteTask,
  deleteTasksByIds,
} from '@/lib/services/Task/methods/delete';
import { getAllTasks } from '@/lib/services/Task/methods/get';
import { syncTasks } from '@/lib/services/Task/methods/sync';
import {
  toggleComplete,
  updateTaskDueDate,
  updateTaskPosition,
} from '@/lib/services/Task/methods/update';

/**
 * TaskService is a class that contains all the methods for interacting with tasks
 * across AWS and the local database in Dexie.
 */
export class TaskService {
  // Fetch 🎾
  /** Fetch all tasks for a given user */
  public getAllTasks: (
    userId: string
  ) => Promise<ServiceResponse<TaskWithTags[]>> = getAllTasks;

  // Create ✚
  /** Creates a new task */
  public addTask: ({
    userId,
    text,
    tagIds,
    dueDate,
    priority,
  }: ServiceAddTaskInput) => Promise<ServiceResponse<TaskWithTags>> = addTask;

  // Delete 🗑
  /** Deletes a single task */
  public deleteTask: (id: string) => Promise<ServiceResponse<boolean>> =
    deleteTask;
  /** Deletes multiple tasks */
  public deleteTasksByIds: (
    taskIds: string[]
  ) => Promise<ServiceResponse<boolean>> = deleteTasksByIds;

  // Sync 🔄
  /** Syncs tasks for a given user with the server */
  public syncTasks: (userId: string) => Promise<ServiceResponse<number>> =
    syncTasks;

  // Update 📝
  /** Toggles the completion status of a task */
  public toggleComplete: (
    id: string,
    userId: string,
    completed: boolean
  ) => Promise<ServiceResponse<Task>> = toggleComplete;
  /** Updates the due date of a task */
  public updateTaskDueDate: (
    id: string,
    dueDate: Date
  ) => Promise<ServiceResponse<Task>> = updateTaskDueDate;
  /** Updates the position of a task */
  public updateTaskPosition: (
    id: string,
    newPosition: number
  ) => Promise<ServiceResponse<Task>> = updateTaskPosition;
}
