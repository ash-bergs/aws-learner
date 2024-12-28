'use client';

import React from 'react';
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
import { useNoteStore } from '@/lib/store/note';
import SortableTaskItem from './SortableTaskItem';

/**
 * A component that renders a draggable and sortable list of tasks.
 *
 * It utilizes the DndContext and SortableContext from the dnd-kit library
 * to provide drag-and-drop functionality. Tasks can be reordered by dragging.
 *
 * The component listens to drag-end events to update the order of tasks
 * using the reorderTask function from the task store.
 *
 * The appearance of the task list can change depending on whether the user is
 * linking tasks to a note, adding specific padding and borders.
 *
 * @returns {React.ReactElement} A JSX element representing the task list.
 */

const ClientTaskList = (): React.ReactElement => {
  const { tasks, reorderTask } = useTaskStore();
  const { isLinking } = useNoteStore();
  //TODO: better classes - clsx?
  const listPadding = isLinking ? 'py-2 px-4' : '';
  const listBorder = isLinking ? 'border-2 border-highlight rounded-lg' : '';

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

  // dnd setup
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      reorderTask(String(active.id), String(over.id));
    }
  };

  return (
    <div>
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
          <ul className={`${listPadding} ${listBorder}`}>
            {tasks.map((task) => (
              <SortableTaskItem key={task.id} task={task} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ClientTaskList;
