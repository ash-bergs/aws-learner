import { create } from "zustand";
import { persist } from "zustand/middleware";
import moment from "moment";
import { db, type Task } from "@/lib/db";
import { useStore as appStore } from "./app";
import { useStatStore } from "./stat";

// --- Types ---
export type Condition = {
  field: keyof Task;
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
  conditions: Condition[];
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
  let tasks = await db.tasks.where("userId").equals(userId).toArray();

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
          threshold: 5,
          conditions: [
            {
              field: "dueDate",
              operator: "within",
              value: "week",
            },
          ],
        },
      },
      unlockedAchievements: {},
      checkAchievements: async () => {
        const userId = appStore.getState().userId;
        if (!userId) return;

        const { achievements, unlockedAchievements } = get();
        const unlocked = { ...unlockedAchievements };

        for (const [id, achievement] of Object.entries(achievements)) {
          const progress = await evaluateAchievementProgress(
            achievement,
            userId
          );

          if (progress >= achievement.threshold) {
            unlocked[id] = { ...achievement, progress, active: false };
          } else {
            // Optional progress update
            set((state) => ({
              achievements: {
                ...state.achievements,
                [id]: { ...state.achievements[id], progress },
              },
            }));
          }
        }

        set((state) => ({
          unlockedAchievements: {
            ...state.unlockedAchievements,
            ...unlocked,
          },
        }));
      },
    }),
    {
      name: "achievements-storage",
    }
  )
);

useAchievementStore.subscribe(() => {
  useStatStore.getState().updateStats();
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
