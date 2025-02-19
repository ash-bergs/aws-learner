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
      /**
       * Toggles the completion of a task.
       *
       * @param {string} id The ID of the task to toggle completion on.
       *
       * This function will first update the state of the task in the store to reflect the new completion status.
       * It will then call the `toggleComplete` function from the `taskService` to update the task in the database.
       *
       * If the call to the database fails, it will revert the state of the task in the store to what it was before the toggle.
       */
      toggleComplete: async (id) => {
        const userId = useStore.getState().userId;
        if (!userId) return;

        const { tasks } = get();
        set({ loadingTasks: true });
        const task = tasks.find((task) => task.id === id);

        if (!task) {
          set({ loadingTasks: false });
          return;
        }

        const taskCompleted = task.completed || false;
        // Update state before the DB call for a snappier UI feel
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        }));
        const res = await taskService.toggleComplete(
          id,
          userId,
          !taskCompleted
        );
        if (!res.ok) {
          console.warn(`Error toggling completion for task: ${task.id}`);
          // If toggling complete fails in the database - revert store state
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === id ? { ...task, completed: task.completed } : task
            ),
          }));
        }
        set({ loadingTasks: false });
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
