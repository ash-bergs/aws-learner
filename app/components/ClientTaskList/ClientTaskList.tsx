'use client';

import React, { useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useTaskStore } from '@/lib/store/task';
import SortableTaskItem from './SortableTaskItem';

/**
 * A component that renders a list of tasks.
 *
 * It utilizes the `useTaskStore` hook to access and fetch tasks from the store.
 * On component mount, it triggers the `fetchTasks` function to load tasks.
 * Each task is rendered as a `TaskItem` within an unordered list.
 *
 * @returns {React.ReactElement} A JSX element representing the list of tasks.
 */
const ClientTaskList = (): React.ReactElement => {
  const { tasks, fetchTasks, reorderTask } = useTaskStore();

  // https://docs.dndkit.com/api-documentation/sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // ms delay
        tolerance: 5,
      },
    })
  );

  // TODO: fetch tasks differently - not in a useEffect
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // dnd setup
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      reorderTask(String(active.id), String(over.id));

      // Refetch tasks
      await fetchTasks();
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-text text-2xl font-bold mb-4">Tasks</h2>
        {/** TODO: Create function to show completed tasks (update list ordering/visibility) */}
        {/* <button className="border p-3 py-2 rounded bg-gray-200">
          View Completed
        </button> */}
      </div>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul>
            {tasks.map((task) => (
              <SortableTaskItem key={task.id} task={task} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </>
  );
};

export default ClientTaskList;
