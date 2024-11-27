'use client';

import React, { useEffect } from 'react';
import { useNoteStore } from '@/lib/store/note';
import NoteDisplay from './NoteDisplay';

/**
 * A component that renders a list of notes.
 *
 * It fetches the notes from the store when mounted.
 * Each note is rendered as a `NoteDisplay` component within an unordered list.
 *
 * @returns {React.ReactElement} A JSX element representing the list of notes.
 */
const NoteBoardDisplay = (): React.ReactElement => {
  const { notes, fetchNotes } = useNoteStore();

  // TODO: fetch notes differently - not in a useEffect
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <>
      <h2 className="text-text text-2xl font-bold mb-4">Notes</h2>
      <div
        className="flex flex-col h-[50vh] md:h-[50vh] sm:h-auto sm:flex-grow 
                 overflow-y-auto bg-secondary
                 p-4 rounded shadow-md"
      >
        <ul className="space-y-4">
          {notes.map((note) => (
            <NoteDisplay key={note.id} id={note.id} content={note.content} />
          ))}
        </ul>
      </div>
    </>
  );
};

export default NoteBoardDisplay;
