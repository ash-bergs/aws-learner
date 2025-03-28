import { create } from "zustand";
import { persist } from "zustand/middleware";
import { taskService } from "@/lib/services";
import { Task, TaskWithTags } from "@/lib/db";
import { useSelectedTaskStore } from "./selected.task";
import { useStore } from "./app";
import { type AddTaskInput } from "@/types/service";
//import { Task, Tag } from '@prisma/client'; // we don't want to use Prisma types here?

interface TaskStore {
  tasks: TaskWithTags[];
  loadingTasks: boolean;
  addTask: (task: AddTaskInput) => Promise<void>;
  deleteTask: (id: string) => void;
  deleteSelectedTasks: () => void;
  fetchTasks: () => Promise<void>;
  reorderTask: (activeId: string, overId: string) => void;
  selectAllTasks: () => void;
  toggleComplete: (id: string) => void;
  syncTasks: (id: string) => Promise<void>;
  updateTaskDueDate: (id: string, dueDate: Date) => void;
  updateTaskProperty: (id: string, updates: Partial<Task>) => void;
  // Tag management
  // TODO: this could all be it's own store
  selectedTagIds: string[];
  setSelectedTagId: (tagId: string) => void;
  setSelectedTagIds: (ids: string[]) => void;

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
      setSelectedTagIds: (tagIds) => {
        set({ selectedTagIds: tagIds });
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
          const response = await taskService.getAllTasks(userId);
          if (!response.success) throw new Error(response.error);

          const fetchedTasks = response.data;
          set({ tasks: fetchedTasks });
          set({ loadingTasks: false });
        } catch (error) {
          console.error("Failed to fetch tasks:", error);
        }
      },
      addTask: async ({ text, tagIds, dueDate, priority }) => {
        try {
          const userId = useStore.getState().userId;
          if (!userId) return;

          const response = await taskService.addTask({
            userId,
            text,
            tagIds,
            dueDate,
            priority,
          });
          if (!response.success) throw new Error(response.error);

          const newTask = response.data;
          set((state) => ({ tasks: [...state.tasks, newTask] }));
        } catch (error) {
          console.error("Failed to add task:", error);
        }
      },
      /**
       * Selects all tasks based on current filters and updates the selectedTaskIds.
       *
       * This function retrieves tasks from the store, applying any active filters such as
       * hiding completed tasks and filtering by selected tags. If all tasks are already selected,
       * it clears the selection. Otherwise, it adds any unselected task IDs to the selection.
       */
      selectAllTasks: () => {
        const { selectedTaskIds, setSelectedTaskIds, clearSelectedTaskIds } =
          useSelectedTaskStore.getState();
        const { hideCompletedTasks } = useStore.getState();
        const { selectedTagIds } = get();
        const { tasks } = get();

        const allTaskIds = tasks
          // Filter out completed tasks if hideCompletedTasks is true
          .filter((task) => (hideCompletedTasks ? !task.completed : true))
          // Filter tasks by selected tags
          .filter(
            (task) =>
              selectedTagIds.length > 0
                ? task.taskTags.some((taskTag) =>
                    selectedTagIds.includes(taskTag.tagId)
                  )
                : true // return true will include all tasks
          )
          // Extract task IDs
          .map((task) => task.id);

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
      //TODO: Deprecate
      toggleComplete: async (id) => {
        const userId = useStore.getState().userId;
        if (!userId) return;
        const { tasks } = get();
        const task = tasks.find((task) => task.id === id);
        if (!task) return;
        const taskCompleted = task.completed || false;
        await taskService.toggleComplete(id, userId, !taskCompleted);

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        }));
      },
      //TODO: Deprecate
      updateTaskDueDate: async (id, dueDate) => {
        await taskService.updateTaskDueDate(id, dueDate);
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, dueDate } : task
          ),
        }));
      },
      updateTaskProperty: async (id, updates) => {
        await taskService.updateTaskProperty(id, updates);
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
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
        // Find index of task being hovered over
        const overIndex = tasks.findIndex((task) => task.id === overId);

        if (
          activeIndex === -1 ||
          overIndex === -1 ||
          activeIndex === overIndex
        ) {
          return;
        }

        // Reorder the array in memory
        const [movedTask] = tasks.splice(activeIndex, 1);
        tasks.splice(overIndex, 0, movedTask);

        // Get surrounding tasks
        const prevTask = tasks[overIndex - 1] || null; // Ensure it's either a task or null
        const nextTask = tasks[overIndex + 1] || null;

        let newPosition: number;

        if (prevTask && nextTask) {
          // Average of adjacent task positions
          newPosition = (prevTask.position + nextTask.position) / 2;
        } else if (prevTask) {
          newPosition = prevTask.position + 1; // Place at the end
        } else if (nextTask) {
          newPosition = nextTask.position / 2; // Place at the start
        } else {
          newPosition = 1; // Fallback if no neighbors exist
        }

        await taskService.updateTaskPosition(activeId, newPosition);

        set({
          tasks: tasks.map((task) =>
            task.id === activeId ? { ...task, position: newPosition } : task
          ),
        });
      },
      /**
       * Syncs all tasks in the store for a given user with the server.
       *
       * This function is a wrapper around the `TaskService.syncTasks` method.
       * It is used to sync the tasks store with through manual triggering.
       *
       * @param {string} id The id of the user for which to sync tasks.
       * @returns {Promise<void>} A promise resolving when the sync is complete.
       */
      syncTasks: async (id: string) => {
        await taskService.syncTasks(id);
      },
    }),
    {
      name: "task-store",
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
