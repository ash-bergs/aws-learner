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
import { useStore } from '@/lib/store/app';
import LoadingSpinner from '../LoadingSpinner';
import SortableTaskItem from './SortableTaskItem';
import TasksToolbar from '../TasksToolbar.tsx';
import { getSession } from 'next-auth/react';

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
  const { tasks, reorderTask, currentTagId, loadingTasks } = useTaskStore();
  const { userId, setUserId } = useStore();
  const { isLinking } = useNoteStore();

  // Filter tasks in memory based on the current tag
  const filteredTasks = React.useMemo(() => {
    if (currentTagId) {
      return tasks.filter((task) =>
        task.taskTags.some((tag) => tag.tagId === currentTagId)
      );
    }
    return tasks;
  }, [tasks, currentTagId]);

  //TODO: better classes - clsx?
  const listPadding = isLinking ? 'py-2 px-4' : '';
  const listBorder = isLinking ? 'border-2 border-highlight rounded-lg' : '';

  // TODO: do this a better way?
  // set the userId in the params on the dashboard page...?
  React.useEffect(() => {
    const loadSession = async () => {
      // TODO: useSession instead? How does this work in AppRouter?
      const session = await getSession();
      if (session?.user?.id && session.user.id !== userId) {
        setUserId(session.user.id);
      }
    };

    loadSession();
  }, [userId, setUserId]);

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
    <>
      <h2 className="text-text text-2xl font-bold mb-4">Your Tasks</h2>
      <div className="flex flex-col gap-4">
        <TasksToolbar />
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          {loadingTasks && <LoadingSpinner />}
          {!loadingTasks && (
            <SortableContext
              items={tasks.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className={`${listPadding} ${listBorder}`}>
                {filteredTasks.map((task) => (
                  <SortableTaskItem key={task.id} task={task} />
                ))}
              </ul>
            </SortableContext>
          )}
        </DndContext>
      </div>
    </>
  );
};

export default ClientTaskList;
