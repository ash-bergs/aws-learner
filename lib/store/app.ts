import { create } from 'zustand';

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

interface AppState {
  view: {
    tasks: boolean;
    notes: boolean;
  };
  setView: (view: keyof AppState['view'], value: boolean) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useStore = create<AppState>((set) => ({
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
  theme: Theme.Light,
  setTheme: (theme) => set({ theme }),
}));
