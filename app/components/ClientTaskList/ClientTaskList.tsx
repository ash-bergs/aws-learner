"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTaskStore } from "@/lib/store/task";
import { useNoteStore } from "@/lib/store/note";
import { useStore } from "@/lib/store/app";
import LoadingSpinner from "../LoadingSpinner";
import SortableTaskItem from "./SortableTaskItem";
import TasksToolbar from "../TasksToolbar.tsx";
import { useSession } from "next-auth/react";
import { GoCheckbox } from "react-icons/go";
import { useTagStore } from "@/lib/store/tag";
import { getAllDescendantTagIds } from "@/lib/helpers/tag-tree";

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
  const { tasks, reorderTask, selectedTagIds, loadingTasks } = useTaskStore();
  const { userId, setUserId, hideCompletedTasks } = useStore();
  const { flatTags } = useTagStore();
  const { isLinking } = useNoteStore();
  const { data: session } = useSession();

  const expandedTagIds = React.useMemo(() => {
    if (selectedTagIds.length === 0) return [];
    const expanded = new Set<string>();

    selectedTagIds.forEach((tagId) => {
      expanded.add(tagId);
      const descendants = getAllDescendantTagIds(tagId, flatTags);
      descendants.forEach((id) => expanded.add(id));
    });

    return Array.from(expanded);
  }, [selectedTagIds, flatTags]);

  const filteredTasks = React.useMemo(() => {
    return tasks
      .filter((task) => (hideCompletedTasks ? !task.completed : true))
      .filter((task) =>
        expandedTagIds.length > 0
          ? task.taskTags.some((taskTag) =>
              expandedTagIds.includes(taskTag.tagId)
            )
          : true
      );
  }, [tasks, expandedTagIds, hideCompletedTasks]);

  const listPadding = isLinking ? "py-2 px-4" : "";
  const listBorder = isLinking ? "border-2 border-highlight rounded-lg" : "";

  React.useEffect(() => {
    const loadSession = async () => {
      if (session?.user?.id && session.user.id !== userId) {
        setUserId(session.user.id);
      }
    };
    loadSession();
  }, [userId, setUserId, session?.user?.id]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      reorderTask(String(active.id), String(over.id));
    }
  };

  return (
    <>
      <h2 className="text-text text-xl font-bold mb-2">
        <GoCheckbox
          size={22}
          aria-hidden="true"
          className="inline-block mr-2"
        />
        Tasks
      </h2>
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
