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
  content: Record<string, object>; // better reflect the JSON received from TipTap
  dateAdded: Date;
  dateUpdated: Date;
}

class AppDatabase extends Dexie {
  tasks: Dexie.Table<Task, string>;
  notes: Dexie.Table<Note, string>;

  constructor() {
    super('ProductivityAppDB');

    this.version(1).stores({
      tasks: 'id, text, completed, dateAdded, dateUpdated',
      notes: 'id, text, dateAdded, dateUpdated',
    });

    // &id - marks the id as a unique primary key
    this.version(2).stores({
      tasks: '&id, text, completed, dateAdded, dateUpdated',
      notes: '&id, text, dateAdded, dateUpdated',
    });

    // update Note table structure (text -> content)
    this.version(3).stores({
      tasks: '&id, text, completed, dateAdded, dateUpdated',
      notes: '&id, content, dateAdded, dateUpdated',
    });

    this.tasks = this.table('tasks');
    this.notes = this.table('notes');
  }
}

export const db = new AppDatabase();
