import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tag, USER_ID } from '@/lib/db';
import { tagsService } from '@/lib/services';

interface TagStore {
  tags: Tag[];
  fetchTags: () => Promise<void>;
  currentTag: Tag | null;
  setCurrentTag: (tag: Tag) => void;
}

export const useTagStore = create<TagStore>()(
  persist(
    (set) => ({
      tags: [],
      currentTag: null,
      fetchTags: async () => {
        try {
          const tagsByUser = await tagsService.getTagsByUser(USER_ID);
          const allTags = [...tagsByUser];
          set({ tags: allTags });
        } catch (error) {
          console.error('Failed to fetch tags:', error);
        }
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
