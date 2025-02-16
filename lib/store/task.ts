import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task } from '@/lib/db';
import { taskService } from '@/lib/services';
import { useSelectedTaskStore } from './selected.task';
import { useStore } from './app';

interface TaskStore {
  tasks: Task[];
  fetchTasks: () => Promise<void>;
  addTask: (text: string) => void;
  deleteTask: (id: string) => void;
  deleteSelectedTasks: () => void;
  toggleComplete: (id: string) => void;
  reorderTask: (activeId: string, overId: string) => void;
  selectAllTasks: () => void;
  updateTaskDueDate: (id: string, dueDate: Date) => void;
  //TODO:
  // updateTask: (updatedTask: Task) => void;
  // Tag management
  currentTagId: string | null;
  setCurrentTagId: (tagId: string | null) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      currentTagId: null,
      fetchTasks: async () => {
        const userId = useStore.getState().userId;
        if (!userId) return;

        try {
          const { currentTagId } = get();
          let fetchedTasks: Task[];

          if (currentTagId) {
            // fetch tasks by tag
            fetchedTasks = await taskService.getAllTasksById(
              userId,
              currentTagId
            );
          } else {
            // fetch all user's tasks
            fetchedTasks = await taskService.getAllTasks(userId);
          }
          console.log('~~~ IN THE STORE, FETCHED TASKS: ', fetchedTasks);
          console.log('~~~ IN THE STORE, USER ID: ', userId);

          set({ tasks: fetchedTasks });
        } catch (error) {
          console.error('Failed to fetch tasks:', error);
        }
      },
      addTask: async (text) => {
        // TODO: add back in taskTag to args...
        const userId = useStore.getState().userId;
        if (!userId) return;

        const newTask = await taskService.addTask(text, userId);
        if (!newTask) throw new Error('There was a problem adding the task');

        //TODO: restore this flow
        // if a tag has been selected, use the tagsService to add the tag
        // and update the taskTags table
        // if (taskTag && taskTag !== '') {
        //   const newTag = await tagsService.createTag(USER_ID, taskTag);
        //   await tagsService.linkTagToTask(newTag.id, newTask.id);
        // }

        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },
      // selectAllTasks shouldn't need to be updated with the migration to Prisma
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
      setCurrentTagId: (tagId) => {
        set({ currentTagId: tagId });
        // trigger a re-fetch of tasks when the currentTagId changes
        // TODO: Zustand research, there's probably a better way to trigger this refresh, without explicitly calling it
        useTaskStore.getState().fetchTasks();
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
        // TODO: when deleting a task, delete it's entry in the taskTags table
        // Refine this .... can Tasks have multiple tags?
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },
      deleteSelectedTasks: async () => {
        const { selectedTaskIds } = useSelectedTaskStore.getState();
        await taskService.deleteTasksByIds(selectedTaskIds);
        set(() => ({
          // remove the selected tasks from the store
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

        if (prevTask && nextTask) {
          // Average of adjacent task positions
          newPosition = (prevTask.position + nextTask.position) / 2;
        } else if (prevTask) {
          newPosition = prevTask.position + 1; // Place at the end
        } else if (nextTask) {
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
