import { create } from "zustand";
import { persist } from "zustand/middleware";
import moment from "moment";
import { db, type Task } from "@/lib/db";
import { useStore as appStore } from "./app";
import { useTaskStore } from "./task";

// --- Types ---
export type Condition = {
  field: keyof Task; // TODO: expand to work with more tables, e.g. notes
  operator: "within";
  value: "week" | "day";
};

export type ConditionBasedAchievement = {
  id: string;
  name: string;
  description: string;
  progress?: number;
  repeat?: boolean;
  active: boolean;
  tag?: string;
  conditions?: Condition[];
  customEvaluator?: (tasks: Task[]) => number | Promise<number>;
  threshold: number;
};

interface AchievementsState {
  achievements: Record<string, ConditionBasedAchievement>;
  unlockedAchievements: Record<string, ConditionBasedAchievement>;
  checkAchievements: () => Promise<void>;
}

// --- Achievement Evaluation Function ---
const evaluateAchievementProgress = async (
  achievement: ConditionBasedAchievement,
  userId: string
): Promise<number> => {
  let tasks = await db.tasks
    .where("userId")
    .equals(userId)
    .filter((task) => task.syncStatus !== "deleted")
    .toArray();

  if (achievement.customEvaluator) {
    const response = await achievement.customEvaluator(tasks);

    return response;
  }

  if (!achievement.conditions) return 0;

  for (const condition of achievement.conditions) {
    if (condition.operator === "within") {
      const now = moment();
      let rangeStart: Date;
      let rangeEnd: Date;

      if (condition.value === "week") {
        rangeStart = now.startOf("isoWeek").toDate();
        rangeEnd = now.endOf("isoWeek").toDate();
      } else {
        rangeStart = now.startOf("day").toDate();
        rangeEnd = now.endOf("day").toDate();
      }

      tasks = tasks.filter((task) => {
        const fieldValue = task[condition.field];
        return (
          fieldValue instanceof Date &&
          fieldValue >= rangeStart &&
          fieldValue <= rangeEnd
        );
      });
    }
  }

  return tasks.length;
};

/** Achievement ideas */
/**
 * Scribe - take 5 notes in a day
 * [Tag] Taskmaster - complete 3 tasks in [tag] in a day
 * [Tag] Mastermind - complete [Tag] Taskmaster 3x in a week - how would we do achievements that build on each other? how do we record that?
 */

// --- Zustand Store ---
export const useAchievementStore = create<AchievementsState>()(
  persist(
    (set, get) => ({
      achievements: {
        scheduler: {
          id: "scheduler",
          name: "Scheduler!",
          description: "Schedule 5 tasks this week",
          active: true,
          progress: 0,
          repeat: true,
          threshold: 3,
          conditions: [
            {
              field: "dueDate",
              operator: "within",
              value: "week",
            },
          ],
        },
        dailyCloser: {
          id: "daily_closer",
          name: "Daily Closer",
          description: "Complete 3 tasks today",
          active: true,
          progress: 0,
          repeat: true,
          threshold: 3,
          customEvaluator: (tasks) => {
            const today = moment();
            const startOfDay = today.startOf("day").toDate();
            const endOfDay = today.endOf("day").toDate();

            const completedToday = tasks.filter(
              (task) =>
                task.completed === true &&
                task.dateUpdated &&
                task.dateUpdated >= startOfDay &&
                task.dateUpdated <= endOfDay
            );

            return completedToday.length;
          },
        },
      },
      unlockedAchievements: {},
      // TODO: Add to db table
      // TODO: Add to service - add to another? create a new one? - update local db state there
      /**
       * Checks all achievements for a user and updates the achievements state.
       *
       * @remarks
       * The following steps are taken:
       * 1. It iterates over all achievements and evaluates the progress.
       * 2. If the progress meets the threshold, it adds the achievement to
       *    the unlockedAchievements state and sets the achievement to inactive.
       * 3. It sets the progress of the achievement in the achievements state.
       * 4. Finally, it sets the unlockedAchievements state.
       */
      checkAchievements: async () => {
        const userId = appStore.getState().userId;
        if (!userId) return;

        const { achievements } = get();
        const unlocked: Record<string, ConditionBasedAchievement> = {};

        for (const [id, achievement] of Object.entries(achievements)) {
          const progress = await evaluateAchievementProgress(
            achievement,
            userId
          );
          const hasMetThreshold = progress >= achievement.threshold;

          set((state) => ({
            achievements: {
              ...state.achievements,
              [id]: {
                ...state.achievements[id],
                progress,
                active: !hasMetThreshold, // Only active if the criteria is not met - but active might serve a different purpose later
              },
            },
          }));

          if (hasMetThreshold) {
            unlocked[id] = {
              ...achievement,
              progress,
              active: false,
            };
          }
        }

        set(() => ({
          unlockedAchievements: unlocked,
        }));
      },
    }),
    {
      name: "achievements-storage",
    }
  )
);

// Subscribe to task store updates
useTaskStore.subscribe(() => {
  useAchievementStore.getState().checkAchievements();
});

/**
 * Types to think about:
 *
 * Will we track achievements in its own table?
 * We'll want to show how many times the user got a badge over time - i.e. they got "Task Master!" 2 weeks out of the month last month.
 * What's the intrinsic link with stats?
 * How are we tracking stats in the database? (I don't think we are, we base it off current db values for tasks)
 * How will we trigger alerts for the user when the attain an achievement?
 */

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

Resources: 
- https://www.nected.ai/us/blog-us/rules-based-systems#:~:text=A%20rules%2Dbased%20system%20is,discount%20rate%20can%20be%2010%25.
 */
