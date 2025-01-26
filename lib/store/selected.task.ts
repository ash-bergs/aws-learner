import { create } from 'zustand';

interface SelectedTaskStore {
  selectedTaskIds: string[];
  setSelectedTaskIds: (taskId: string) => void;
  clearSelectedTaskIds: () => void;
}

/**
 * @type {SelectedTaskStore}
 * @name SelectedTaskStore
 * @description A zustand store for managing user-selected task IDs.
 * @returns {SelectedTaskStore}
 */
export const useSelectedTaskStore = create<SelectedTaskStore>((set) => ({
  selectedTaskIds: [],
  /**
   * Toggle a task ID in the `selectedTaskIds` array.
   *
   * If the task ID is already present in the array, it will be removed.
   * If the task ID is not present in the array, it will be added.
   *
   * @param {string} taskId The task ID to toggle.
   * @returns {void}
   */
  setSelectedTaskIds: (taskId: string) => {
    set((state) => ({
      selectedTaskIds: state.selectedTaskIds.includes(taskId)
        ? state.selectedTaskIds.filter((id) => id !== taskId)
        : [...state.selectedTaskIds, taskId],
    }));
  },
  /**
   * Resets the `selectedTaskIds` array to an empty array.
   *
   * @returns {void}
   */
  clearSelectedTaskIds: () => {
    set({ selectedTaskIds: [] });
  },
}));
