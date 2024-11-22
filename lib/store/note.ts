import { create } from 'zustand';
import { Note } from '@/lib/db';
import { noteService } from '@/lib/services';

interface NoteStore {
  notes: Note[];
  fetchNotes: () => Promise<void>;
  addNote: (note: Note) => void;
  deleteNote: (id: string) => void;
}

export const useNoteStore = create<NoteStore>((set) => ({
  notes: [],

  fetchNotes: async () => {
    const allNotes = await noteService.getAllNotes();
    set({ notes: allNotes });
  },

  addNote: async (note: Note) => {
    const newTask = await noteService.addNote(note);

    set((state) => ({
      notes: [...state.notes, newTask],
    }));
  },

  deleteNote: async (id: string) => {
    await noteService.deleteNote(id);

    set((state) => ({
      notes: state.notes.filter((task) => task.id !== id),
    }));
  },
}));
