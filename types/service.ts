export interface AddTaskInput {
  text: string;
  tagIds?: string[];
  dueDate?: string;
  priority?: number;
}

export type ServiceAddTaskInput = {
  userId: string;
} & AddTaskInput;
