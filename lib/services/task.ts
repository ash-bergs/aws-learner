/** This file holds the Task service
 * The Task service is responsible for CRUD operations on the tasks table in the database
 */

// TODO:
// Update the types with Prisma types - add Promise<type> returns

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
  async addTask(text: string, userId: string, tagIds?: string[]) {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, userId, tagIds }),
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
  async toggleComplete(id: string, userId: string, completed: boolean) {
    const dateUpdated = new Date();
    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          completed,
          dateUpdated,
          completedBy: completed ? userId : null, // if removing completion, set completedBy to null
        }),
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
