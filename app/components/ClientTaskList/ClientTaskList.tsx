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
import type { Tag } from "@/lib/db";

const getEffectiveTagSets = (
  selectedTagIds: string[],
  flatTags: Tag[]
): Set<string>[] => {
  // Wrap in a Set for fast lookups
  const selected = new Set(selectedTagIds);

  // Get the 'most specific' tags
  // When we select "Work" and it has 2 subtasks like "Work" -> "E2E" and "Workshop", we'll be getting all tasks for "E2E" and "Workshop"
  // But when we select "E2E", it has narrowed the search to just tasks with a tag id that is a descendant of "E2E"
  const mostSpecific = selectedTagIds.filter((id) => {
    // For each selected tag, get all its descendants
    const descendants = getAllDescendantTagIds(id, flatTags);
    // If any of those descendants are selected, this tag is not the most specific - return false
    // If no descendants are selected, this tag is the most specific - return true
    return !descendants.some((descId) => selected.has(descId));
  });

  // For each 'most specific' tag
  return mostSpecific.map((id) => {
    // Get all its descendants
    const set = new Set(getAllDescendantTagIds(id, flatTags));
    // Add the tag itself
    set.add(id);
    // Return the set to be used to filter tasks
    return set;
  });
};

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

  const effectiveTagSets = React.useMemo(
    () => getEffectiveTagSets(selectedTagIds, flatTags),
    [selectedTagIds, flatTags]
  );

  const filteredTasks = React.useMemo(() => {
    return (
      tasks
        // hide completed tasks if hideCompletedTasks is true
        .filter((task) => (hideCompletedTasks ? !task.completed : true))
        // filter by most specific selected tags
        .filter((task) => {
          if (effectiveTagSets.length === 0) return true;
          return effectiveTagSets.some((tagSet) =>
            task.taskTags.some((taskTag) => tagSet.has(taskTag.tagId))
          );
        })
    );
  }, [tasks, effectiveTagSets, hideCompletedTasks]);

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
