import { create } from 'zustand';

// export enum Theme {
//   Light = 'light',
//   Dark = 'dark',
// }
// change theme to names
export type Theme = 'Tidepool' | 'Orchid';

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
  theme: 'Tidepool',
  // setTheme: (theme: Theme) => {
  //   set(() => ({ theme }));
  //   // update <html> class for Tailwind dark mode
  //   if (typeof document !== 'undefined') {
  //     document.documentElement.classList.toggle('dark', theme === 'dark');
  //   }
  // },
  setTheme: (theme: Theme) => {
    set(() => ({ theme }));

    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('Tidepool', 'Orchid');
      document.documentElement.classList.add(theme);
    }
  },
}));
