'use client';

import React, { useEffect } from 'react';
import { useNoteStore } from '@/lib/store/note';
import NoteDisplay from './NoteDisplay';

const NoteBoardDisplay = (): React.ReactElement => {
  const { notes, fetchNotes } = useNoteStore();

  // TODO: fetch notes differently - not in a useEffect
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <ul>
      {notes.map((note) => (
        <NoteDisplay key={note.id} id={note.id} content={note.content} />
      ))}
    </ul>
  );
};

export default NoteBoardDisplay;
