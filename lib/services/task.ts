import { db, Task, USER_ID } from '../db';
// import { prisma } from '../prisma';

/** This file holds the Task service
 * The Task service is responsible for CRUD operations on the tasks table in the database
 */

export class TaskService {
  // create a method to get all tasks
  async getAllTasks() {
    // return all tasks from the database
    return await db.tasks.orderBy('position').toArray();
    //FIXME: Error: PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `unknown`).
    // return (await prisma.task.findMany()).sort(
    //   (a, b) => a.position - b.position
    // );
  }
  async getTasksByIds(taskIds: string[]) {
    const tasks = await db.tasks.bulkGet(taskIds);
    return tasks;
  }
  addTask = async (task: string, color?: string) => {
    const lastTask = await db.tasks.orderBy('position').last();
    const newTaskPosition = lastTask ? lastTask.position + 1 : 1;

    const newTask: Task = {
      id: crypto.randomUUID(),
      text: task,
      completed: false,
      color: color,
      dateAdded: new Date(),
      dateUpdated: new Date(),
      position: newTaskPosition,
      userId: USER_ID,
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
  // TODO: remove
  updateTaskDate = async (id: string) => {
    const task = await db.tasks.get(id);
    if (!task) return console.warn(`No task with ${id} to update :(`);

    await db.tasks.update(id, { dateUpdated: new Date() });
  };
  updateTaskDueDate = async (id: string, dueDate: Date) => {
    const task = await db.tasks.get(id);
    if (!task) return console.warn(`No task with ${id} to update :(`);

    await db.tasks.update(id, { dueDate: dueDate });
  };
  updateTaskPosition = async (id: string, newPosition: number) => {
    await db.tasks.update(id, { position: newPosition });
  };
  deleteByIds = async (taskIds: string[]) => {
    await db.tasks.bulkDelete(taskIds);
  };
}
