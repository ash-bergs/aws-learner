import Dexie from 'dexie';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  dateAdded: Date;
  dateUpdated: Date;
}

export interface Note {
  id: string;
  text: string;
  dateAdded: Date;
  dateUpdated: Date;
}

class AppDatabase extends Dexie {
  tasks: Dexie.Table<Task, string>;
  notes: Dexie.Table<Note, string>;

  constructor() {
    super('ProductivityAppDB');

    // this setup does not automatically handle creation of ids and incrementing them
    // &id - marks the id as a primary key, dexie will handle the rest
    this.version(1).stores({
      tasks: 'id, text, completed, dateAdded, dateUpdated',
      notes: 'id, text, dateAdded, dateUpdated',
    });

    this.version(2).stores({
      tasks: '&id, text, completed, dateAdded, dateUpdated',
      notes: '&id, text, dateAdded, dateUpdated',
    });

    this.tasks = this.table('tasks');
    this.notes = this.table('notes');
  }
}

export const db = new AppDatabase();
