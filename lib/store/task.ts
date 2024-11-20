import { create } from 'zustand';
import { Task } from '@/lib/db';
import { taskService } from '@/lib/services';

interface TaskStore {
  tasks: Task[];
  fetchTasks: () => Promise<void>;
  addTask: (task: Task) => void;
  //TODO:
  // updateTask: (updatedTask: Task) => void;
  // removeTask: (taskId: string) => void;
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
}));
