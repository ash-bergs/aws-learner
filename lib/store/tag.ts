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
        if (!userId) return;
        try {
          const userTags = await tagsService.getTagsByUser(userId);
          if (!userTags.ok) throw new Error('Failed to fetch tags');
          const allTags = await userTags.json();
          set({ tags: allTags });
        } catch (error) {
          console.error('Failed to fetch tags:', error);
        }
      },
      addTag: async (name: string, color?: string) => {
        const userId = useStore.getState().userId;
        if (!userId) return console.warn('User ID is required');
        const newTag = await tagsService.createTag(userId, name, color);
        if (!newTag) throw new Error('Failed to create tag');
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
