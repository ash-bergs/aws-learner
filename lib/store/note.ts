import { create } from 'zustand';
import { Note } from '@/lib/db';
import { noteService } from '@/lib/services';

interface NoteStore {
  notes: Note[];
  fetchNotes: () => Promise<void>;
  addNote: (content: Record<string, object>) => void;
  deleteNote: (id: string) => void;
  // linkNoteToTasks: (id: string, taskIds: string[]) => void;

  linkingNoteId: string | null;
  selectedTaskIds: string[];
  isLinking: boolean;
  cancelLinking: () => void;
  startLinking: (noteId: string) => void;
  confirmLinking: () => void;
}

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],
  linkingNoteId: null, // the id of a note being currently linked to Tasks
  selectedTaskIds: [],
  isLinking: false, // whether the user is currently linking a note to tasks

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

  // linking logics
  startLinking: (noteId: string) => {
    set({ linkingNoteId: noteId, selectedTaskIds: [], isLinking: true });
  },

  selectTask: (taskId: string) => {
    set((state) => ({
      selectedTaskIds: state.selectedTaskIds.includes(taskId)
        ? state.selectedTaskIds.filter((id) => id !== taskId)
        : [...state.selectedTaskIds, taskId],
    }));
  },

  /**
   * Confirms the linking process.
   *
   * If a note is being linked to tasks (i.e. `linkingNoteId` is not null)
   * and at least one task is selected, this function will link the note
   * to the selected tasks using the note service, and then
   * cancel the linking process.
   */
  confirmLinking: async () => {
    const { linkingNoteId, selectedTaskIds, cancelLinking } = get();
    if (linkingNoteId && selectedTaskIds.length) {
      await noteService.addNoteToTask(linkingNoteId, selectedTaskIds);
      cancelLinking();
    }
  },

  cancelLinking: () => {
    set({ linkingNoteId: null, selectedTaskIds: [], isLinking: false });
  },
}));
