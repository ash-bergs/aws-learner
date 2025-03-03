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
import { useNoteStore } from '@/lib/store/note';
import SortableNoteDisplay from './SortableNoteDisplay';
import LinkingControls from './LinkingControls';

/**
 * A component that renders a draggable and sortable list of notes.
 *
 * Utilizes the DndContext and SortableContext from the dnd-kit library
 * to provide drag-and-drop functionality for notes, allowing reordering
 * by dragging.
 *
 * Displays a header or linking controls based on the linking state,
 * managed by the note store.
 *
 * @returns {React.ReactElement} A JSX element representing the note board display.
 */
const NoteBoardDisplay = (): React.ReactElement => {
  const { notes, isLinking, reorderNote } = useNoteStore();

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      reorderNote(String(active.id), String(over.id));
    }
  };

  return (
    <>
      {/** if isLinking is true, don't show h2, show the LinkingControls buttons */}
      {!isLinking && (
        <h2 className="text-text text-2xl font-bold mb-4">Notes</h2>
      )}
      {isLinking && <LinkingControls />}

      <div
        className="flex flex-col h-[50vh] md:h-[50vh] sm:h-auto sm:grow 
                 overflow-y-auto bg-secondary
                 p-4 rounded shadow-md"
      >
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <SortableContext
            items={notes.map((note) => note.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-4">
              {notes.map((note) => (
                <SortableNoteDisplay key={note.id} note={note} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>

        {notes.length === 0 && (
          <p className="text-text text-center bg-note w-[60%] mx-auto my-auto rounded-xs py-4 px-4">
            No current notes to display{' '}
          </p>
        )}
      </div>
    </>
  );
};

export default NoteBoardDisplay;
