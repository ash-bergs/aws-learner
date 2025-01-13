/**
 * This module contains constants related to the themes (colors) of the application.
 *
 * @module theme.config
 */

export const THEMES = {
  Tidepool: 'Tidepool',
  Orchid: 'Orchid',
  Jewel: 'Jewel',
  DeepSpace: 'DeepSpace',
};

export type Theme = keyof typeof THEMES;

export const DEFAULT_THEME: Theme = 'DeepSpace';

export const AVAILABLE_THEMES: Theme[] = Object.keys(THEMES) as Theme[];
