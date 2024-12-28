'use client';

import React from 'react';
import { Note } from '@/lib/db';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import NoteDisplay from './NoteDisplay';

/**
 * A component that renders a single, sortable note list item.
 * Utilizes the `useSortable` hook from the dnd-kit library to provide
 * drag-and-drop functionality for notes within a list.
 *
 * @param {{ note: Note }} props The component props.
 * @param {Note} props.note The note to render.
 * @returns {React.ReactElement} A JSX element representing the sortable note list item.
 */

const SortableNoteDisplay = ({ note }: { note: Note }): React.ReactElement => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: note.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <NoteDisplay id={note.id} content={note.content} />
    </li>
  );
};

export default SortableNoteDisplay;
