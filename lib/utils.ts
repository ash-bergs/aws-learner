import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitizes an array of items by removing the `syncStatus` property from each one.
 * This is useful when syncing data to a server that doesn't care about the sync status.
 * @param items - The array of items to sanitize.
 * @returns A new array of items with the `syncStatus` property removed.
 */
export function removeSyncMetadataArray<
  T extends object & { syncStatus?: string }
>(items: T[]): Array<Omit<T, 'syncStatus'>> {
  return items.map((item) => {
    const sanitizedItem = { ...item };
    delete sanitizedItem.syncStatus; // Remove the syncStatus property
    return sanitizedItem as Omit<T, 'syncStatus'>; // Ensure TypeScript understands we're only omitting `syncStatus`
  });
}
/**
 * Breakdown of the type above:
 *
 * - **Generic `T`**: Represents a flexible object type that can work with different data structures
 *   - e.g., Tasks, Tags, Notes, etc.
 *   - Docs: https://www.typescriptlang.org/docs/handbook/2/generics.html
 *
 * - **`T extends object & { syncStatus?: string }`**: A type constraint that ensures:
 *   - `T` must be an object.
 *   - `T` may optionally have a `syncStatus` property of type `string` (but it's not required).
 *   - This guarantees we can safely attempt to remove `syncStatus` without breaking the function.
 *   - Docs: https://www.typescriptlang.org/docs/handbook/mixins.html#constraints
 *
 * - **Function Parameter (`items: T[]`)**:
 *   - Accepts an **array** of objects of type `T`.
 *
 * - **Return Type (`Array<Omit<T, 'syncStatus'>>`)**:
 *   - Uses TypeScript’s `Omit<T, 'syncStatus'>` utility type.
 *   - Ensures that the returned objects are **exactly the same as `T`**, except without `syncStatus`.
 *   - Prevents TypeScript from inferring an overly broad or incorrect type.
 *   - Docs: https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys
 *
 * - **Key Implementation Details**:
 *   - `{ ...item }` creates a shallow copy of the object to ensure we don't modify the original.
 *   - `delete sanitizedItem.syncStatus;` removes `syncStatus` from the copied object.
 *   - `return sanitizedItem as Omit<T, 'syncStatus'>;` explicitly tells TypeScript the result does **not** have `syncStatus`.
 */

/**
 * Removes the `syncStatus` property from a single object.
 *
 * @param {T} item The object to sanitize.
 * @returns {Omit<T, 'syncStatus'>} A new object without `syncStatus`.
 */
export function removeSyncMetadataSingle<
  T extends object & { syncStatus?: string }
>(item: T): Omit<T, 'syncStatus'> {
  const sanitizedItem = { ...item };
  delete sanitizedItem.syncStatus;
  return sanitizedItem as Omit<T, 'syncStatus'>;
}
