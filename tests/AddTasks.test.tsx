import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import AddTasks from '../app/components/AddTasks/AddTasks';

// Mock Zustand stores
jest.mock('@/lib/store/tag', () => ({
  useTagStore: jest.fn(() => ({
    fetchTags: jest.fn(),
    tags: [
      { id: '1', name: 'Tag 1' },
      { id: '2', name: 'Tag 2' },
      { id: '3', name: 'Tag 3' },
    ],
    setCurrentTag: jest.fn(),
  })),
}));

jest.mock('@/lib/store/task', () => ({
  useTaskStore: jest.fn(() => ({
    tasks: [],
    addTask: jest.fn(),
    fetchTasks: jest.fn(),
  })),
}));

expect.extend(toHaveNoViolations);

describe('AddTasks Accessibility Tests', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<AddTasks />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
