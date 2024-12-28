import { db, Note } from '../db';

/** This file holds the Note service
 * The service is responsible for CRUD operations on the notes table in the database
 */

export class NoteService {
  async getAllNotes() {
    return await db.notes.toArray();
  }
  addNote = async (content: Record<string, object>, color?: string) => {
    // get the last note and its position, add a new note right after
    const lastNote = await db.notes.orderBy('position').last();
    const newNotePosition = lastNote ? lastNote.position + 1 : 1;

    const note = {
      id: crypto.randomUUID(),
      content,
      color,
      dateAdded: new Date(),
      dateUpdated: new Date(),
      position: newNotePosition,
    };

    await db.notes.add(note);
    return note;
  };
  updateNote = async (note: Note) => {
    // get the note, and add a time stamp, and add the task to the database
    const updatedNote = { ...note, dateUpdated: new Date() };
    await db.tasks.update(note.id, updatedNote);
    return updatedNote;
  };
  /**
   * Update the color of a note background in the UI
   * @param {string} id - The id of the task to update
   * @param {string} color - The color to update the task with
   */
  updateNoteColor = async (id: string, color: string) => {
    const note = await db.notes.get(id);

    if (note) {
      const updatedNote = { ...note, color, dateUpdated: new Date() };
      await db.notes.update(id, updatedNote);
      return updatedNote;
    }

    console.warn(
      `Note with id ${id} could not be found - color not updated 😢`
    );
  };
  deleteNote = async (id: string) => {
    await db.notes.delete(id);
  };
  addNoteToTask = async (noteId: string, taskIds: string[]) => {
    const taskNotes = taskIds.map((taskId) => ({
      taskId,
      noteId,
    }));

    await db.taskNotes.bulkAdd(taskNotes);
  };
  updateNotePosition = async (id: string, newPosition: number) => {
    await db.notes.update(id, { position: newPosition });
  };
}
