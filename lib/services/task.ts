import { db, Task } from '../db';

/** This file holds the Task service
 * The Task service is responsible for CRUD operations on the tasks table in the database
 */

// TODO:
// Migrate all the service fns to use the API
// Once moved, update the types with Prisma types - add Promise<type> returns

export class TaskService {
  async getAllTasks(userId: string) {
    try {
      const response = await fetch(`/api/tasks?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      console.log('Look at that, a response from the API: ', response);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      return [];
    }
  }
  async getAllTasksById(userId: string, tagId: string) {
    try {
      const response = await fetch(
        `/api/tasks?userId=${userId}&tagId=${tagId}`
      );
      if (!response.ok) throw new Error('Failed to fetch tasks');
      console.log('Look at that, a response from the API: ', response);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      return [];
    }
  }
  async addTask(text: string, userId: string) {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, userId }),
      });

      if (!response.ok) throw new Error('Failed to add task');
      const newTask = await response.json();
      console.log('Lookie here, a new task: ', newTask);
      return newTask;
    } catch (error) {
      console.error('Failed to add task:', error);
      return null; // return false? Is that a better practice?
    }
  }
  async deleteTask(id: string) {
    try {
      const response = await fetch('/api/tasks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
      });
      console.log('RESPONSE: ', response);
      if (!response.ok) throw new Error('Failed to delete tasks');
      const deletedTasks = await response.json();
      console.log('Lookie here, a deleted task: ', deletedTasks);
      return deletedTasks;
    } catch (error) {
      console.error('Failed to delete tasks:', error);
      return null;
    }
  }
  async deleteTasksByIds(taskIds: string[]) {
    try {
      const response = await fetch('/api/tasks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: taskIds }),
      });
      console.log('RESPONSE: ', response);
      if (!response.ok) throw new Error('Failed to delete tasks');
      const deletedTasks = await response.json();
      console.log('Lookie here, a deleted task: ', deletedTasks);
      return deletedTasks;
    } catch (error) {
      console.error('Failed to delete tasks:', error);
      return null;
    }
  }

  // NEED TO BE UPDATED
  // deprecated?
  // async getTasksByIds(taskIds: string[]) {
  //   const tasks = await db.tasks.bulkGet(taskIds);
  //   return tasks;
  // }
  updateTask = async (task: Task) => {
    // get the task, and add a time stamp, and add the task to the database
    const updatedTask = { ...task, dateUpdated: new Date() };
    await db.tasks.update(task.id, updatedTask);
    return updatedTask;
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
}
