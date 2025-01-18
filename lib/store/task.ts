import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, USER_ID } from '@/lib/db';
import { taskService, tagsService } from '@/lib/services';
import { db } from '@/lib/db';

// maybe the store is the best place to handle getting the tags associated with a task
// in our initial fetch we can also get the taskTags and tags, and pre-process the Tasks, adding the tags
// this still seems like it will be quite expensive to do on every fetch - maybe a tagId foreign key would be better?

interface TaskStore {
  tasks: Task[];
  currentTagId: string | null;
  setCurrentTagId: (tagId: string | null) => void;
  fetchTasks: () => Promise<void>;
  addTask: (task: string, color?: string, taskTag?: string) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  reorderTask: (activeId: string, overId: string) => void;
  updateTaskDueDate: (id: string, dueDate: Date) => void;
  //TODO:
  // updateTask: (updatedTask: Task) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      currentTagId: null,
      fetchTasks: async () => {
        try {
          const { currentTagId } = get();

          let tasksToFetch: Task[];

          if (currentTagId) {
            // TODO: Query the TaskTag join table to find task IDs associated with the currentTagId
            // this is where we'll be using SQL queries when we have Prisma set up
            // this is a band-aid for now
            const taskTags = await db.taskTags
              .where('tagId')
              .equals(currentTagId)
              .toArray();
            const taskIds = taskTags.map((taskTag) => taskTag.taskId);
            // Fetch tasks that match the task IDs
            const tasks = await taskService.getTasksByIds(taskIds);
            tasksToFetch = tasks.filter((task) => task !== undefined);
          } else {
            // If no tag is selected, fetch all tasks
            tasksToFetch = await taskService.getAllTasks();
          }

          set({ tasks: tasksToFetch });
        } catch (error) {
          console.error('Failed to fetch tasks:', error);
        }
      },

      setCurrentTagId: (tagId) => {
        set({ currentTagId: tagId });
        // trigger a re-fetch of tasks when the currentTagId changes
        // TODO: Zustand research, there's probably a better way to trigger this refresh, without explicitly calling it
        useTaskStore.getState().fetchTasks();
      },
      addTask: async (text, color, taskTag) => {
        const newTask = await taskService.addTask(text, color);
        if (!newTask) throw new Error('There was a problem adding the task');
        //TODO: move this to the TagStore when the flow is complete
        // if a tag has been selected, use the tagsService to add the tag
        // and update the taskTags table
        if (taskTag && taskTag !== '') {
          const newTag = await tagsService.createTag(USER_ID, taskTag);
          await tagsService.linkTagToTask(newTag.id, newTask.id);
        }

        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },
      toggleComplete: async (id) => {
        await taskService.toggleComplete(id);
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        }));
      },
      deleteTask: async (id) => {
        await taskService.deleteTask(id);
        // TODO: when deleting a task, delete it's entry in the taskTags table
        // Refine this .... can Tasks have multiple tags?
        const taskTags = await db.taskTags.where('taskId').equals(id).toArray();
        if (taskTags.length > 0) {
          for (const taskTag of taskTags) {
            await tagsService.unlinkTagFromTask(taskTag.tagId, taskTag.taskId);
          }
        }
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
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

        // find index of task being dragged and task being hovered over
        const activeIndex = tasks.findIndex((task) => task.id === activeId);
        const overIndex = tasks.findIndex((task) => task.id === overId);

        if (
          activeIndex === -1 ||
          overIndex === -1 ||
          activeIndex === overIndex
        ) {
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

      updateTaskDueDate: async (id, dueDate) => {
        await taskService.updateTaskDueDate(id, dueDate);
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, dueDate } : task
          ),
        }));
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
