import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import AddTasks from '../app/components/AddTasks/AddTasks';
import userEvent from '@testing-library/user-event';

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

describe('AddTasks Automated Accessibility Tests', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<AddTasks />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('AddTasks Usability Tests', () => {
  it('should have a logical label', () => {
    const { getByLabelText } = render(<AddTasks />);

    const input = getByLabelText('Task Description');
    expect(input).toBeInTheDocument();
  });
  it('should have placeholder text', () => {
    const { getByLabelText } = render(<AddTasks />);

    const input = getByLabelText('Task Description');
    expect(input).toHaveAttribute('placeholder', 'Describe your task...');
  });
  it('should have a visible focus border', () => {
    const { getByLabelText } = render(<AddTasks />);

    const input = getByLabelText('Task Description');
    input.focus();
    expect(input).toHaveFocus();
    expect(input.className).toContain('focus:outline');
  });
  it('should move to TagSelector on tab', async () => {
    const { getByLabelText } = render(<AddTasks />);

    const input = getByLabelText('Task Description');
    input.focus();
    await userEvent.tab();
    const tagSelector = getByLabelText('Select a tag for the task');
    expect(tagSelector).toHaveFocus();
  });
});
