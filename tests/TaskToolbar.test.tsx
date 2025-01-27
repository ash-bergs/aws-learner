import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import TasksToolbar from '@/app/components/TasksToolbar.tsx';
//import userEvent from '@testing-library/user-event';

// Mock Zustand stores
jest.mock('@/lib/store/tag', () => ({
  useTagStore: jest.fn(() => ({
    tags: [
      { id: '1', name: 'Tag 1' },
      { id: '2', name: 'Tag 2' },
      { id: '3', name: 'Tag 3' },
    ],
  })),
}));

jest.mock('@/lib/store/task', () => ({
  useTaskStore: jest.fn(() => ({
    tasks: [
      {
        id: '1',
        text: 'Task 1',
        completed: false,
        dateAdded: new Date(),
        dateUpdated: new Date(),
        position: 1,
        userId: '1',
        dueDate: new Date(),
      },
      {
        id: '2',
        text: 'Task 2',
        completed: false,
        dateAdded: new Date(),
        dateUpdated: new Date(),
        position: 2,
        userId: '1',
        dueDate: new Date(),
      },
      {
        id: '3',
        text: 'Task 3',
        completed: false,
        dateAdded: new Date(),
        dateUpdated: new Date(),
        position: 3,
        userId: '1',
        dueDate: new Date(),
      },
    ],
    selectAllTasks: jest.fn(),
    deleteSelectedTasks: jest.fn(),
    setCurrentTagId: jest.fn(),
    currentTagId: null,
  })),
}));

jest.mock('@/lib/store/selected.task', () => ({
  useSelectedTaskStore: jest.fn(() => ({
    clearSelectedTaskIds: jest.fn(),
    selectedTaskIds: [],
  })),
}));

jest.mock('@/lib/store/note', () => ({
  useNoteStore: jest.fn(() => ({
    isLinking: false,
  })),
}));

expect.extend(toHaveNoViolations);

describe('AddTasks Automated Accessibility Tests', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<TasksToolbar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
