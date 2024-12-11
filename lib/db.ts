import Dexie from 'dexie';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  completedBy?: string;
  color?: string; // the user assigned color for the task background - a string
  dateAdded: Date;
  dateUpdated: Date;
  position: number;
  userId?: string; // the id of the user that created the task
}

export interface Note {
  id: string;
  content: Record<string, object>; // better reflect the JSON received from TipTap
  color?: string; // the user assigned color for the note background - a string
  dateAdded: Date;
  dateUpdated: Date;
  // position: number;
  userId?: string; // the id of the user that created the note
}

export interface User {
  id: string;
  email: string;
  password: string;
  settings: {
    theme: string;
  };
}

class AppDatabase extends Dexie {
  tasks: Dexie.Table<Task, string>;
  notes: Dexie.Table<Note, string>;
  taskNotes: Dexie.Table<{ taskId: string; noteId: string }, [string, string]>;
  users: Dexie.Table<User, string>;

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

    // update:
    // adding a position to tasks
    // the position uses relative positions with scaled position values
    // this is useful for reordering because we can use the average between adjacent tasks
    // and avoid shifting the entire list when reordering
    this.version(5).stores({
      tasks: '&id, text, completed, color, dateAdded, dateUpdated, position',
      notes: '&id, content, color, dateAdded, dateUpdated',
      taskNotes: '[taskId+noteId], taskId, noteId',
    });
    // migrate existing tasks
    // .upgrade((tx) => {
    //   return tx
    //     .table('tasks')
    //     .toCollection()
    //     .modify((task, index) => {
    //       // assign sequential positions to tasks based on the current order
    //       task.position = Number(index) + 1;
    //     });
    // });

    this.version(6).stores({
      tasks:
        '&id, text, completed, completedBy, color, dateAdded, dateUpdated, position, userId',
      notes: '&id, content, color, dateAdded, dateUpdated, userId',
      taskNotes: '[taskId+noteId], taskId, noteId',
      users: '&id, email, password, settings',
    });

    this.tasks = this.table('tasks');
    this.notes = this.table('notes');
    this.taskNotes = this.table('taskNotes');
    this.users = this.table('users');
  }
}

export const db = new AppDatabase();
