import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tag } from '@/lib/db';
import { tagsService } from '@/lib/services';
import { useStore } from './app';

interface TagStore {
  tags: Tag[];
  fetchTags: () => Promise<void>;
  addTag: (name: string, color?: string) => Promise<void>;
  currentTag: Tag | null;
  setCurrentTag: (tag: Tag) => void;
}

export const useTagStore = create<TagStore>()(
  persist(
    (set) => ({
      tags: [],
      currentTag: null,
      fetchTags: async () => {
        const userId = useStore.getState().userId;
        if (!userId) return console.warn('User ID is required');
        try {
          const response = await tagsService.getTagsByUser(userId);
          if (!response.success) throw new Error(response.error);
          const userTags = response.data;
          set({ tags: userTags });
        } catch (error) {
          console.error('Failed to fetch tags:', error);
        }
      },
      addTag: async (name: string, color?: string) => {
        const userId = useStore.getState().userId;
        if (!userId) return console.warn('User ID is required');
        const response = await tagsService.createTag(userId, name, color);
        if (!response.success) throw new Error(response.error);
        const newTag = response.data;
        set((state) => ({ tags: [...state.tags, newTag] }));
      },
      setCurrentTag: (tag) => {
        set({ currentTag: tag });
      },
    }),
    {
      name: 'tag-store',
      onRehydrateStorage: () => async (state) => {
        if (state) {
          const fetchTags = state.fetchTags;
          await fetchTags();
        }
      },
    }
  )
);
