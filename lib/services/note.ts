import { db, Note } from '../db';

/** This file holds the Note service
 * The service is responsible for CRUD operations on the notes table in the database
 */

export class NoteService {
  async getAllNotes() {
    return await db.notes.toArray();
  }

  addNote = async (content: Record<string, object>) => {
    const note = {
      id: crypto.randomUUID(),
      content,
      dateAdded: new Date(),
      dateUpdated: new Date(),
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

  deleteNote = async (id: string) => {
    await db.notes.delete(id);
  };
}
