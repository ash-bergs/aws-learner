/**
 * This module contains constants related to the themes (colors) of the application.
 *
 * @module theme.config
 */

export const THEMES = {
  Lavender: 'Lavender',
  Forest: 'Forest',
  Nightshade: 'Nightshade',
};

export type Theme = keyof typeof THEMES;

export const DEFAULT_THEME: Theme = 'Lavender';

export const AVAILABLE_THEMES: Theme[] = Object.keys(THEMES) as Theme[];
