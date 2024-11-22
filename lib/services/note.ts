import { db, Note } from '../db';
import { v4 as uuidv4 } from 'uuid';

/** This file holds the Note service
 * The service is responsible for CRUD operations on the notes table in the database
 */

export class NoteService {
  async getAllNotes() {
    return await db.notes.toArray();
  }

  addNote = async (note: Note) => {
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
