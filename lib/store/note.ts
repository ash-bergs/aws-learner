import { create } from 'zustand';
import { Note } from '@/lib/db';
import { noteService } from '@/lib/services';

interface NoteStore {
  notes: Note[];
  fetchNotes: () => Promise<void>;
  addNote: (content: Record<string, object>) => void;
  deleteNote: (id: string) => void;
}

export const useNoteStore = create<NoteStore>((set) => ({
  notes: [],

  fetchNotes: async () => {
    const allNotes = await noteService.getAllNotes();
    set({ notes: allNotes });
  },

  addNote: async (content: Record<string, object>) => {
    const newNote = await noteService.addNote(content);

    set((state) => ({
      notes: [...state.notes, newNote],
    }));
  },

  deleteNote: async (id: string) => {
    await noteService.deleteNote(id);

    set((state) => ({
      notes: state.notes.filter((task) => task.id !== id),
    }));
  },
}));
