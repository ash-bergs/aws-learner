import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AchievementsState {}

/**
 * To get an idea of how achievements could work, we can use this as a sandbox:
 *
 * To start we can set some basic achievements to work for,
 * based on our own tags, and goals, etc.
 * Then we can start thinking about how to generalize it.
 *
 * Our core tags: Work, Home, Learning, Personal, Projects
 *
 * So let's say achievements could be:
 *
 * - Complete three learning tasks in a week (learning tag)
 * - Complete all tasks with a due date for today (work tag)
 * - Schedule 5 tasks this week (for any time/date) - i.e. "Scheduler!" badge
 * - Complete tasks in 3 categories in a single day - i.e. "Mastermind!" badge
 * - Complete all tasks due this week - i.e. "Task Master!" badge
 * 
 * We should remember that we have the stats store available to us. 
 * The stats store has the following type definitions:
 * interface StatStore {
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
 */

export const useStore = create<AchievementsState>()(
  persist(
    (set) => ({
      /** State, actions, etc. */
    }),
    {
      name: 'achievements-storage',
    }
  )
);

/**
 * Types to think about:
 *
 * Will we track achievements in its own table?
 * We'll want to show how many times the user got a badge over time - i.e. they got "Task Master!" 2 weeks out of the month last month.
 * What's the intrinsic link with stats?
 * How are we tracking stats in the database? (I don't think we are, we base it off current db values for tasks)
 * How will we trigger alerts for the user when the attain an achievement?
 */
