import { db, Task, TaskWithTags } from '@/lib/db';
import type { ServiceResponse } from '@/lib/services';
import { type ServiceAddTaskInput } from '@/types/service';
import { v4 as uuidv4 } from 'uuid';

/**
 * Adds a new task for a given user with the given properties.
 *
 * Finds the highest position value among the user's tasks, assigns a new float
 * position (e.g., next step could be highest + 1.0), and creates a new task with
 * the given properties. If there are tags, creates task-tag relationships.
 *
 * @param {ServiceAddTaskInput} input The input object for the new task
 * @returns {Promise<TaskWithTags | null>} A promise resolving to the added task,
 * or null if there was an error
 */
export async function addTask({
  userId,
  text,
  tagIds,
  dueDate,
  priority,
}: ServiceAddTaskInput): Promise<ServiceResponse<TaskWithTags>> {
  try {
    // Gen. id for task
    const newTaskId = uuidv4();
    const taskDueDate = dueDate ? new Date(dueDate) : undefined;

    // Find the highest position value among the user's tasks
    const highestPositionTask = await db.tasks
      .where('userId')
      .equals(userId)
      .sortBy('position');
    const highestPosition = highestPositionTask.length
      ? highestPositionTask[highestPositionTask.length - 1].position
      : 0;
    // Assign a new float position (e.g., next step could be highest + 1.0)
    const newTaskPosition = highestPosition + 1.0;

    // Create the new task
    const newTask: Task = {
      id: newTaskId,
      userId,
      text,
      completed: false,
      completedBy: undefined,
      color: undefined,
      dateAdded: new Date(),
      dateUpdated: new Date(),
      position: newTaskPosition,
      dueDate: taskDueDate,
      syncStatus: 'new',
      priority,
    };

    await db.tasks.add(newTask);

    // If there are tags, create task-tag relationships
    const taskTags = tagIds?.map((tagId) => ({
      taskId: newTaskId,
      tagId,
    }));
    if (taskTags && taskTags.length > 0) {
      await db.taskTags.bulkAdd(taskTags);
    }

    // Fetch the tags to return in the correct TaskWithTags shape
    const tags = tagIds ? await db.tags.bulkGet(tagIds) : [];
    const taskWithTags: TaskWithTags = {
      ...newTask,
      taskTags: (taskTags ?? []).map((tt) => ({
        taskId: tt.taskId,
        tagId: tt.tagId,
        tag: tags.find((tag) => tag?.id === tt.tagId) || null,
      })),
    };

    return { success: true, data: taskWithTags };
  } catch (error) {
    console.error('Failed to add task:', error);
    return { success: false, error: 'Failed to add task' };
  }
}
