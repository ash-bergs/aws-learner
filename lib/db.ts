import Dexie from 'dexie';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  color?: string; // the user assigned color for the task background - a string
  dateAdded: Date;
  dateUpdated: Date;
}

export interface Note {
  id: string;
  content: Record<string, object>; // better reflect the JSON received from TipTap
  color?: string; // the user assigned color for the note background - a string
  dateAdded: Date;
  dateUpdated: Date;
}

class AppDatabase extends Dexie {
  tasks: Dexie.Table<Task, string>;
  notes: Dexie.Table<Note, string>;
  taskNotes: Dexie.Table<{ taskId: string; noteId: string }, [string, string]>;

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

    // update:
    // colors on tasks and notes
    // links tasks and notes with a taskNotes table
    this.version(4).stores({
      tasks: '&id, text, completed, color, dateAdded, dateUpdated',
      notes: '&id, content, color, dateAdded, dateUpdated',

      // composite key for primary key, a tuple with 2 elements
      // prevents duplicate relationships for the same task and note
      // how would this scale?
      taskNotes: '[taskId+noteId], taskId, noteId',
    });

    this.tasks = this.table('tasks');
    this.notes = this.table('notes');
    this.taskNotes = this.table('taskNotes');
  }
}

export const db = new AppDatabase();
