import { create } from 'zustand';
import { useTaskStore } from './task';
import moment from 'moment';

interface StatStore {
  currentDay: Date;
  currentWeek: number;
  completedToday: number;
  completedThisWeek: number;
  updateStats: () => void;
}

export const useStatStore = create<StatStore>((set) => ({
  currentDay: new Date(),
  currentWeek: moment().isoWeek(), // ISO week number
  completedToday: 0,
  completedThisWeek: 0,
  updateStats: () => {
    const { tasks } = useTaskStore.getState();
    // Get the current ISO week number for tracking weekly tasks
    // this will help us introduce monthly tracking
    const currentWeek = moment().isoWeek();

    const completedToday = tasks.filter(
      (task) =>
        // Check if dateUpdated matches today's date - task was completed today
        task.completed &&
        task.dateUpdated &&
        // Can't use an outside variable here - value will become stale
        moment(task.dateUpdated).isSame(moment(), 'day')
    ).length;

    const completedThisWeek = tasks.filter(
      // Check if dateUpdated falls into the current ISO week number - task was completed this week
      (task) =>
        task.completed &&
        task.dateUpdated &&
        moment(task.dateUpdated).isoWeek() === currentWeek
    ).length;

    set({
      currentDay: new Date(),
      currentWeek,
      completedToday,
      completedThisWeek,
    });
  },
}));

// Subscribe to task store updates - we can probably use this to replace onRehydrateStorage calls
useTaskStore.subscribe(() => {
  useStatStore.getState().updateStats();
});
