import { db, Task } from '../db';

/** This file holds the Task service
 * The Task service is responsible for CRUD operations on the tasks table in the database
 */

export class TaskService {
  // create a method to get all tasks
  async getAllTasks() {
    // return all tasks from the database
    return await db.tasks.toArray();
  }

  addTask = async (task: string, color?: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: task,
      completed: false,
      color: color,
      dateAdded: new Date(),
      dateUpdated: new Date(),
    };
    await db.tasks.add(newTask);
    return newTask;
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

  /**
   * Update the color of a task background in the UI
   * @param {string} id - The id of the task to update
   * @param {string} color - The color to update the task with
   */
  updateTaskColor = async (id: string, color: string) => {
    const task = await db.tasks.get(id);

    if (task) {
      const updatedTask = { ...task, color, dateUpdated: new Date() };
      await db.tasks.update(id, updatedTask);
      return updatedTask;
    }

    console.warn(`Task with id ${id} not found - color not updated 😢`);
  };
}
