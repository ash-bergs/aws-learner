import { db, Task } from "@/lib/db";
import type { ServiceResponse } from "@/lib/services";

export async function toggleComplete(
  id: string,
  userId: string,
  completed: boolean
): Promise<ServiceResponse<Task>> {
  try {
    const dateUpdated = new Date();
    const task = await db.tasks.get(id);
    if (!task) {
      return { success: false, error: "Task not found" };
    }

    // Update the task in Dexie
    const syncStatus =
      task.syncStatus === "synced" ? "pending" : task.syncStatus;
    const updatedTask: Task = {
      ...task,
      completed,
      completedBy: completed ? userId : undefined, // if removing completion, set completedBy to null
      dateUpdated,
      syncStatus,
    };
    await db.tasks.update(id, updatedTask);

    return { success: true, data: updatedTask };
  } catch (error) {
    console.error("Failed to toggle task completion:", error);
    return { success: false, error: "Failed to toggle task completion" };
  }
}
export async function updateTaskDueDate(
  id: string,
  dueDate: Date
): Promise<ServiceResponse<Task>> {
  try {
    const task = await db.tasks.get(id);
    if (!task) {
      console.log(`❌ Task not found: ${id}`);
      return { success: false, error: "Task not found" };
    }

    // Update the due date
    const syncStatus =
      task.syncStatus === "synced" ? "pending" : task.syncStatus;
    const updatedTask: Task = {
      ...task,
      dueDate,
      syncStatus,
    };
    await db.tasks.update(id, updatedTask);

    return { success: true, data: updatedTask };
  } catch (error) {
    console.error("Failed to update task due date:", error);
    return { success: false, error: "Failed to update task due date" };
  }
}

// function to update whatever property of a task
// We can replace the other update functions with this for simplicity
// we should be able to update multiple properties at once
export async function updateTaskProperty(
  id: string,
  updates: Partial<Task>
): Promise<ServiceResponse<Task>> {
  try {
    const task = await db.tasks.get(id);
    if (!task) {
      console.log(`❌ Task not found: ${id}`);
      return { success: false, error: "Task not found" };
    }
    const syncStatus =
      task.syncStatus === "synced" ? "pending" : task.syncStatus;

    const updatedTask: Task = {
      ...task,
      ...updates,
      syncStatus,
    };
    await db.tasks.update(id, updatedTask);
    return { success: true, data: updatedTask };
  } catch (error) {
    console.error("Failed to update task property:", error);
    return { success: false, error: "Failed to update task property" };
  }
}
/**
 * Update the position of a task in the Dexie database.
 * The position effects the order in which tasks are displayed in the UI.
 *
 * If the task's sync status is 'synced', it will be updated to 'pending'.
 * Otherwise, the sync status will remain the same.
 *
 * @param {string} id The id of the task to update
 * @param {number} newPosition The new position of the task
 * @returns {Promise<ServiceResponse<Task>>}
 */
export async function updateTaskPosition(
  id: string,
  newPosition: number
): Promise<ServiceResponse<Task>> {
  try {
    const dateUpdated = new Date();
    const task = await db.tasks.get(id);
    if (!task) {
      console.log(`❌ Task not found: ${id}`);
      return { success: false, error: "Task not found" };
    }

    // TODO: make this more readable
    // determine sync status -
    // if currently is 'synced' - update to 'pending'
    // otherwise keep current sync status
    const syncStatus =
      task.syncStatus === "synced" ? "pending" : task.syncStatus;

    const updatedTask: Task = {
      ...task,
      position: newPosition,
      syncStatus,
      dateUpdated,
    };
    await db.tasks.update(id, updatedTask);

    return { success: true, data: updatedTask };
  } catch (error) {
    console.error("Failed to update task order:", error);
    return { success: false, error: "Failed to update task order" };
  }
}
