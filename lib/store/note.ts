import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Note } from '@/lib/db';
import { noteService } from '@/lib/services';
import { useSelectedTaskStore } from './selected.task';

interface NoteStore {
  notes: Note[];
  linkingNoteId: string | null;
  isLinking: boolean;
  // CRUD
  fetchNotes: () => Promise<void>;
  addNote: (content: Record<string, object>, color?: string) => void;
  deleteNote: (id: string) => void;
  reorderNote: (activeId: string, overId: string) => void;
  // Note/Task linking
  cancelLinking: () => void;
  startLinking: (noteId: string) => void;
  confirmLinking: () => void;
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      notes: [],
      linkingNoteId: null, // the id of a note being currently linked to Tasks
      isLinking: false, // whether the user is currently linking a note to tasks

      fetchNotes: async () => {
        const allNotes = await noteService.getAllNotes();
        set({ notes: allNotes });
      },
      addNote: async (content: Record<string, object>, color?: string) => {
        const newNote = await noteService.addNote(content, color);

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
      /**
       * Reorder a note to the position of another note. This function will update
       * the position of the note in the Dexie database and then update the store
       * with the moved note.
       *
       * @param {string} activeId The id of the note being dragged.
       * @param {string} overId The id of the note being hovered over.
       * @returns {void}
       */
      reorderNote: async (activeId, overId) => {
        const notes = await noteService.getAllNotes();

        // find index of task being dragged and task being hovered over
        const activeIndex = notes.findIndex((note) => note.id === activeId);
        const overIndex = notes.findIndex((note) => note.id === overId);

        if (
          activeIndex === -1 ||
          overIndex === -1 ||
          activeIndex === overIndex
        ) {
          return; // no op drag event
        }

        // reorder the array
        const [movedNote] = notes.splice(activeIndex, 1);
        notes.splice(overIndex, 0, movedNote);

        // calculate the new position for moved task
        const prevNote = notes[overIndex - 1];
        const nextNote = notes[overIndex + 1];

        let newPosition;

        if (prevNote && nextNote) {
          newPosition = (prevNote.position + nextNote.position) / 2;
        } else if (prevNote) {
          newPosition = prevNote.position + 1; // Place at the end
        } else if (nextNote) {
          newPosition = nextNote.position / 2; // place at the start
        } else {
          newPosition = 1; // fallback to place at start
        }

        await noteService.updateNotePosition(activeId, newPosition);

        set({
          notes: notes.map((note) =>
            note.id === activeId ? { ...note, position: newPosition } : note
          ),
        });
      },
      /* ------------------------------ LINKING LOGIC ----------------------------- */
      startLinking: (noteId: string) => {
        const { clearSelectedTaskIds } = useSelectedTaskStore.getState();
        // clear selected tasks and set linkingNoteId
        clearSelectedTaskIds();
        set({ linkingNoteId: noteId, isLinking: true });
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
        const { selectedTaskIds } = useSelectedTaskStore.getState();
        const { linkingNoteId, cancelLinking } = get();
        if (linkingNoteId && selectedTaskIds.length) {
          await noteService.addNoteToTask(linkingNoteId, selectedTaskIds);
          cancelLinking();
        }
      },
      cancelLinking: () => {
        const { clearSelectedTaskIds } = useSelectedTaskStore.getState();
        // clear selected tasks and set linkingNoteId
        clearSelectedTaskIds();
        set({ linkingNoteId: null, isLinking: false });
      },
    }),
    {
      name: 'note-store',
      onRehydrateStorage: () => async (state) => {
        if (state) {
          const fetchNotes = state.fetchNotes;
          await fetchNotes();
        }
      },
    }
  )
);
