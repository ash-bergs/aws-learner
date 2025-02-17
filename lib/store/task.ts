import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { taskService } from '@/lib/services';
import { useSelectedTaskStore } from './selected.task';
import { useStore } from './app';
import { Task, Tag } from '@prisma/client';

// Define TaskWithTags to include the `taskTags` relation
export interface TaskWithTags extends Task {
  taskTags: Array<{
    taskId: string;
    tagId: string;
    tag: Tag;
  }>;
}
interface TaskStore {
  tasks: TaskWithTags[];
  fetchTasks: () => Promise<void>;
  loadingTasks: boolean;
  addTask: (text: string, tagIds?: string[]) => void;
  deleteTask: (id: string) => void;
  deleteSelectedTasks: () => void;
  toggleComplete: (id: string) => void;
  reorderTask: (activeId: string, overId: string) => void;
  selectAllTasks: () => void;
  updateTaskDueDate: (id: string, dueDate: Date) => void;
  // Tag management
  //currentTagId: string | null;
  // TODO: this could all be it's own store
  selectedTagIds: string[];
  // setSelectedTagId - before
  setSelectedTagId: (tagId: string) => void;
  clearSelectedTags: () => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      loadingTasks: false,
      selectedTagIds: [],
      clearSelectedTags: () => {
        set({ selectedTagIds: [] });
      },
      setSelectedTagId: (tagId) => {
        set((state) => {
          const isTagSelected = state.selectedTagIds.includes(tagId);
          return {
            selectedTagIds: isTagSelected
              ? state.selectedTagIds.filter((id) => id !== tagId) // Remove if the tag is already in currentTagIds
              : [...state.selectedTagIds, tagId], // Or add the new tagId
          };
        });
      },
      fetchTasks: async () => {
        set({ loadingTasks: true });
        const userId = useStore.getState().userId;
        if (!userId) return;

        try {
          // fetch all user's tasks
          const fetchedTasks = await taskService.getAllTasks(userId);
          // Set the tasks in the store
          set({ tasks: fetchedTasks });
          set({ loadingTasks: false });
        } catch (error) {
          console.error('Failed to fetch tasks:', error);
        }
      },
      addTask: async (text, tagIds) => {
        const userId = useStore.getState().userId;
        if (!userId) return;

        const newTask = await taskService.addTask(text, userId, tagIds);

        if (!newTask) throw new Error('There was a problem adding the task');

        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },
      selectAllTasks: () => {
        const { selectedTaskIds, setSelectedTaskIds, clearSelectedTaskIds } =
          useSelectedTaskStore.getState();
        const { tasks } = get();

        const allTaskIds = tasks.map((task) => task.id);

        if (selectedTaskIds.length === allTaskIds.length) {
          clearSelectedTaskIds();
        } else {
          allTaskIds.forEach((id) => {
            if (!selectedTaskIds.includes(id)) {
              setSelectedTaskIds(id);
            }
          });
        }
      },

      toggleComplete: async (id) => {
        // get the current completion status from the store
        const { tasks } = get();
        const task = tasks.find((task) => task.id === id);
        if (!task) return;
        const taskCompleted = task.completed || false;
        await taskService.toggleComplete(id, !taskCompleted);

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        }));
      },
      updateTaskDueDate: async (id, dueDate) => {
        await taskService.updateTaskDueDate(id, dueDate);
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, dueDate } : task
          ),
        }));
      },
      deleteTask: async (id) => {
        await taskService.deleteTask(id);
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },
      deleteSelectedTasks: async () => {
        const { selectedTaskIds } = useSelectedTaskStore.getState();
        await taskService.deleteTasksByIds(selectedTaskIds);
        set(() => ({
          tasks: get().tasks.filter(
            (task) => !selectedTaskIds.includes(task.id)
          ),
          selectedTaskIds: [],
        }));
      },
      // TODO: there's some bugginess with task ordering if we order while the list is filtered by tag
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
        const { tasks } = useTaskStore.getState(); // Get current state

        // Find index of task being dragged
        const activeIndex = tasks.findIndex((task) => task.id === activeId);
        // And task being hovered over
        const overIndex = tasks.findIndex((task) => task.id === overId);

        if (
          // If either task is not found, do nothing
          activeIndex === -1 ||
          overIndex === -1 ||
          activeIndex === overIndex
        ) {
          return;
        }

        // Reorder the array in memory
        const [movedTask] = tasks.splice(activeIndex, 1);
        tasks.splice(overIndex, 0, movedTask);

        // Calculate the new position for moved task
        const prevTask = tasks[overIndex - 1];
        const nextTask = tasks[overIndex + 1];

        let newPosition;

        if (prevTask.position && nextTask.position) {
          // Average of adjacent task positions
          newPosition = (prevTask.position + nextTask.position) / 2;
        } else if (prevTask.position) {
          newPosition = prevTask.position + 1; // Place at the end
        } else if (nextTask.position) {
          newPosition = nextTask.position / 2; // Place at the start
        } else {
          newPosition = 1; // Fallback - place at start
        }

        await taskService.updateTaskPosition(activeId, newPosition);

        set({
          tasks: tasks.map((task) =>
            task.id === activeId ? { ...task, position: newPosition } : task
          ),
        });
      },
    }),
    {
      name: 'task-store',
      /**
       * Rehydrates the tasks store by fetching all tasks from the database and
       * saving them to the store.
       *
       * This function is called when the store is rehydrated from local storage.
       * It ensures that the tasks store is always up to date with the database.
       *
       * read more: https://zustand.docs.pmnd.rs/integrations/persisting-store-data
       */
      onRehydrateStorage: () => async (state) => {
        // Defer accessing `useTaskStore` to avoid circular reference
        //TODO: this is a hack, there's probably a better way
        if (state) {
          const fetchTasks = state.fetchTasks;
          await fetchTasks();
        }
      },
    }
  )
);
