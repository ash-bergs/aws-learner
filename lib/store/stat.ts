import { create } from 'zustand';
import { useTaskStore } from './task';
import moment from 'moment';

interface StatStore {
  currentDay: Date;
  currentWeek: number;
  completedToday: number;
  // count for due today that are done
  completedDueToday: number;
  dueToday: number;
  completedThisWeek: number;
  completedDueThisWeek: number;
  dueThisWeek: number;
  updateStats: () => void;
}

export const useStatStore = create<StatStore>((set) => ({
  currentDay: new Date(),
  currentWeek: moment().isoWeek(), // ISO week number
  completedToday: 0,
  completedThisWeek: 0,
  dueToday: 0,
  dueThisWeek: 0,
  completedDueToday: 0,
  completedDueThisWeek: 0,
  updateStats: () => {
    const { tasks } = useTaskStore.getState();
    const currentWeek = moment().isoWeek();
    const today = moment();

    // Init counters
    let completedToday = 0;
    let completedDueToday = 0;
    let dueToday = 0;
    let completedThisWeek = 0;
    let completedDueThisWeek = 0;
    let dueThisWeek = 0;

    tasks.forEach((task) => {
      const dateUpdated = task.dateUpdated ? moment(task.dateUpdated) : null;
      const dueDate = task.dueDate ? moment(task.dueDate) : null;

      // Iterate the tasks once instead of in a series of filters
      // If the task is complete and the UPDATED date is today
      if (task.completed && dateUpdated?.isSame(today, 'day')) {
        completedToday++;
      }

      // If the task is complete and the DUE date is today
      if (task.completed && dueDate?.isSame(today, 'day')) {
        completedDueToday++;
      }

      // If the DUE date is in the current day
      if (dueDate?.isSame(today, 'day')) {
        dueToday++;
      }

      // If the task is complete and the UPDATED date is in the current week
      if (task.completed && dateUpdated?.isoWeek() === currentWeek) {
        completedThisWeek++;
      }

      // If the task is complete and the DUE date is in the current week
      if (task.completed && dueDate?.isoWeek() === currentWeek) {
        completedDueThisWeek++;
      }

      // If the DUE date is in the current week
      if (dueDate?.isoWeek() === currentWeek) {
        dueThisWeek++;
      }
    });

    set({
      currentDay: new Date(),
      currentWeek,
      completedToday,
      completedThisWeek,
      dueToday,
      dueThisWeek,
      completedDueToday,
      completedDueThisWeek,
    });
  },
}));

// Subscribe to task store updates - we can probably use this to replace onRehydrateStorage calls
useTaskStore.subscribe(() => {
  useStatStore.getState().updateStats();
});
