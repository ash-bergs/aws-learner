# Core Directory

The **core** directory is intended to house the fundamental pieces of our application's logic. It serves as the backbone of the app, providing essential configurations and utilities that are used throughout the project.

## Key Features

- **Theme Management**: This directory includes configuration and logic related to theme management, allowing for consistent styling and theming across the application.
- **Centralized Configurations**: Any core configurations that are critical for application functionality reside here, ensuring they are easily accessible and maintainable.
- **Utility Functions**: Fundamental utility functions that support various components and features of the app are also centralized within this directory.

---

## Adding to the Theme

To add a new theme to the app, the following steps should be taken:

1. In `globals.css`, add a new class definition for the theme, using the theme name:

```
.Tidepool {
  --background: #f4f7f5;
  --foreground: #f4f7f5;
  --color-primary: #21a0a0;
  --color-secondary: #046865;
  --color-text: #074846;
  --color-note: #e9f7ee;
  --color-highlight: #41d070;
}
```

2. In `lib/core/theme.config.ts`, add the new theme to the `THEMES` array.

With that the new theme will be available for selection through the `Header` component.
