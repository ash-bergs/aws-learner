import { db } from '../db';

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
      if (!response.ok) throw new Error('Failed to delete tasks');
      const deletedTasks = await response.json();
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
      if (!response.ok) throw new Error('Failed to delete tasks');
      const deletedTasks = await response.json();
      return deletedTasks;
    } catch (error) {
      console.error('Failed to delete tasks:', error);
      return null;
    }
  }
  async toggleComplete(id: string, completed: boolean) {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id, completed }),
      });

      if (!response.ok) throw new Error('Failed to toggle task completion');
      const updatedTask = await response.json();
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

      if (!response.ok) throw new Error('Failed to toggle task completion');
      const updatedTask = await response.json();
      return updatedTask;
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
      return null;
    }
  }
  // NEED TO BE UPDATED
  updateTaskPosition = async (id: string, newPosition: number) => {
    await db.tasks.update(id, { position: newPosition });
  };
}
