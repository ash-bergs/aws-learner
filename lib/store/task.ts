import { create } from 'zustand';
import { Task } from '@/lib/db';
import { taskService } from '@/lib/services';

interface TaskStore {
  tasks: Task[];
  fetchTasks: () => Promise<void>;
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  //TODO:
  // updateTask: (updatedTask: Task) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],

  fetchTasks: async () => {
    const allTasks = await taskService.getAllTasks();
    set({ tasks: allTasks });
  },

  /**
   * Add a new task to the store. This function will add the task to the dexie
   * database and then update the store with the new task.
   *
   * @param {Task} task The task to add to the store.
   * @returns {void}
   */
  addTask: async (task: Task) => {
    // add the task to the dexie database
    const newTask = await taskService.addTask(task);
    // update the store with the new task
    set((state) => ({
      tasks: [...state.tasks, newTask],
    }));
  },

  /**
   * Remove a task from the store. This function will delete the task from the
   * Dexie database and then update the store without the task.
   *
   * @param {string} id The id of the task to remove from the store.
   * @returns {void}
   */
  deleteTask: async (id: string) => {
    // remove the task from the dexie database
    await taskService.deleteTask(id);
    // update the store with the new task
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
  },

  // toggle task completion
  toggleComplete: async (id: string) => {
    // update the task in the dexie database
    await taskService.toggleComplete(id);
    // update the store with the new task
    // what would be a more direct way to update this? get the task back from the dexie database and use that?
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id === id) {
          return { ...task, completed: !task.completed };
        }
        return task;
      }),
    }));
  },
}));
