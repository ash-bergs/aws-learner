import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_THEME, Theme, THEMES } from '../core/theme.config';

interface AppState {
  userId: string | null;
  setUserId: (userId: string) => void;
  view: {
    tasks: boolean;
    notes: boolean;
  };
  setView: (view: keyof AppState['view'], value: boolean) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      userId: null, // track the authenticated user's ID
      setUserId: (userId: string) => {
        set(() => ({ userId: String(userId) }));
      },
      view: {
        tasks: true,
        notes: true,
      },
      setView: (view, value) => {
        set((state) => ({
          view: {
            ...state.view, // preserve existing view
            [view]: value, // update the specific view
          },
        }));
      },
      theme: DEFAULT_THEME,
      setTheme: (theme: Theme) => {
        set(() => ({ theme }));

        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove(...Object.keys(THEMES));
          document.documentElement.classList.add(theme);
        }
      },
    }),
    {
      name: 'app-storage',
    }
  )
);
