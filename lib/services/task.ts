import { db, Task } from '../db';
import { v4 as uuidv4 } from 'uuid';

/** This file holds the Task service
 * The Task service is responsible for CRUD operations on the tasks table in the database
 */

export class TaskService {
  // create a method to get all tasks
  async getAllTasks() {
    // return all tasks from the database
    return await db.tasks.toArray();
  }

  addTask = async (task: Task) => {
    // get the task, and add a time stamp, and add the task to the database
    await db.tasks.add(task);
    return task;
  };

  updateTask = async (task: Task) => {
    // get the task, and add a time stamp, and add the task to the database
    const updatedTask = { ...task, dateUpdated: new Date() };
    await db.tasks.update(task.id, updatedTask);
    return updatedTask;
  };

  deleteTask = async (id: string) => {
    // delete the task from the database
    await db.tasks.delete(id);
  };

  toggleComplete = async (id: string) => {
    const task = await db.tasks.get(id);

    if (task) {
      const updatedTask = {
        ...task,
        completed: !task.completed,
        dateUpdated: new Date(),
      };
      await db.tasks.update(id, updatedTask);
    }
  };
}
