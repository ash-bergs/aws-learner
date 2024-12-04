import { create } from 'zustand';
import { Task } from '@/lib/db';
import { taskService } from '@/lib/services';

interface TaskStore {
  tasks: Task[];
  fetchTasks: () => Promise<void>;
  addTask: (task: string, color?: string) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  reorderTask: (activeId: string, overId: string) => void;
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
  addTask: async (task: string, color?: string) => {
    // add the task to the dexie database
    const newTask = await taskService.addTask(task, color);
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

  /**
   * Reorder a task to the position of another task. This function will update
   * the position of the task in the Dexie database and then update the store
   * with the moved task.
   *
   * @param {string} activeId The id of the task being dragged.
   * @param {string} overId The id of the task being hovered over.
   * @returns {void}
   */
  reorderTask: async (activeId, overId) => {
    const tasks = await taskService.getAllTasks();

    // find index of task being dragged and task being hovered over
    const activeIndex = tasks.findIndex((task) => task.id === activeId);
    const overIndex = tasks.findIndex((task) => task.id === overId);

    if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
      return; // no op drag event
    }

    // reorder the array
    const [movedTask] = tasks.splice(activeIndex, 1);
    tasks.splice(overIndex, 0, movedTask);

    // calculate the new position for moved task
    const prevTask = tasks[overIndex - 1];
    const nextTask = tasks[overIndex + 1];

    let newPosition;

    if (prevTask && nextTask) {
      newPosition = (prevTask.position + nextTask.position) / 2;
    } else if (prevTask) {
      newPosition = prevTask.position + 1; // Place at the end
    } else if (nextTask) {
      newPosition = nextTask.position / 2; // place at the start
    } else {
      newPosition = 1; // fallback to place at start
    }

    await taskService.updateTaskPosition(activeId, newPosition);

    set({
      tasks: tasks.map((task) =>
        task.id === activeId ? { ...task, position: newPosition } : task
      ),
    });
  },
}));
