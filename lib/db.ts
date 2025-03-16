import Dexie from 'dexie';

// fake string (uuid) for user id testing
export const USER_ID = 'c8d6e5f5-9da0-4b0d-8e8d-9da0-4b0d-8e8d';

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
  dueDate?: Date;
  priority?: number;
  // Sync status - only on Dexie (not in RDS/Prisma)
  // TODO: new db version, and update old tasks with default
  syncStatus: 'new' | 'pending' | 'synced' | 'deleted';
}

export interface Tag {
  id: string;
  name: string; // Name of the tag (e.g., "Work", "Personal")
  color?: string; // Optional color for the tag
  userId: string; // User who created the tag
}

export interface TaskWithTags extends Task {
  taskTags: Array<{
    taskId: string;
    tagId: string;
    tag: Tag | null;
  }>;
}

export interface Note {
  id: string;
  content: Record<string, object>; // better reflect the JSON received from TipTap
  color?: string; // the user assigned color for the note background - a string
  dateAdded: Date;
  dateUpdated: Date;
  position: number;
  userId?: string; // the id of the user that created the note
}

export interface User {
  id: string;
  email?: string;
  username: string;
  firstName?: string;
  lastName?: string;
  password: string;
  settings: {
    theme: string;
  };
}

// Join table types
export interface TaskTag {
  taskId: string; // ID of the task
  tagId: string; // ID of the tag
}

export interface NoteTask {
  noteId: string; // ID of the note
  taskId: string; // ID of the task
}

class AppDatabase extends Dexie {
  users: Dexie.Table<User, string>;
  tasks: Dexie.Table<Task, string>;
  tags: Dexie.Table<Tag, string>;
  notes: Dexie.Table<Note, string>;
  taskNotes: Dexie.Table<NoteTask, [string, string]>;
  taskTags: Dexie.Table<TaskTag, [string, string]>;

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

    // update: Adds username, and first and last name to User
    // makes email optional but a unique username is required
    this.version(7).stores({
      tasks:
        '&id, text, completed, completedBy, color, dateAdded, dateUpdated, position, userId',
      notes: '&id, content, color, dateAdded, dateUpdated, userId',
      taskNotes: '[taskId+noteId], taskId, noteId',
      users: '&id, email, password, username, firstName, lastName, settings',
    });

    // update: adds position to notes
    this.version(8).stores({
      tasks:
        '&id, text, completed, completedBy, color, dateAdded, dateUpdated, position, userId',
      notes: '&id, content, color, dateAdded, dateUpdated, userId, position',
      taskNotes: '[taskId+noteId], taskId, noteId',
      users: '&id, email, password, username, firstName, lastName, settings',
    });

    // update: add tags to tasks
    // tags are meant to be created by the user and associated with tasks
    // we will probably make a separate table for tags and notes
    this.version(9).stores({
      tasks:
        '&id, text, completed, completedBy, color, dateAdded, dateUpdated, position, userId',
      notes: '&id, content, color, dateAdded, dateUpdated, userId, position',
      taskNotes: '[taskId+noteId], taskId, noteId',
      users: '&id, email, password, username, firstName, lastName, settings',
      taskTags: '[taskId+tagId], taskId, tagId',
      tags: '&id, name, color, userId',
    });

    // update: add due dates to tasks
    this.version(10).stores({
      tasks:
        '&id, text, completed, completedBy, color, dateAdded, dateUpdated, position, userId, dueDate',
      notes: '&id, content, color, dateAdded, dateUpdated, userId, position',
      taskNotes: '[taskId+noteId], taskId, noteId',
      users: '&id, email, password, username, firstName, lastName, settings',
      taskTags: '[taskId+tagId], taskId, tagId',
      tags: '&id, name, color, userId',
    });

    // TODO: setup a better, external, module to seed
    // this.on('populate', () => {
    //   // Seed default tags
    //   this.tags.bulkAdd([
    //     {
    //       id: crypto.randomUUID(),
    //       name: 'Work',
    //       color: 'blue',
    //       userId: USER_ID,
    //     },
    //     {
    //       id: crypto.randomUUID(),
    //       name: 'Personal',
    //       color: 'purple',
    //       userId: USER_ID,
    //     },
    //     {
    //       id: crypto.randomUUID(),
    //       name: 'Urgent',
    //       color: 'red',
    //       userId: USER_ID,
    //     },
    //     {
    //       id: crypto.randomUUID(),
    //       name: 'Project',
    //       color: 'orange',
    //       userId: USER_ID,
    //     },
    //     {
    //       id: crypto.randomUUID(),
    //       name: 'Home',
    //       color: 'pink',
    //       userId: USER_ID,
    //     },
    //   ]);
    // });

    // sync with Prisma
    // user - adds createdAt and updatedAt
    // tasks - adds priority
    this.version(11)
      .stores({
        tasks:
          '&id, text, completed, completedBy, color, dateAdded, dateUpdated, position, userId, dueDate, priority',
        notes: '&id, content, color, dateAdded, dateUpdated, userId, position',
        taskNotes: '[taskId+noteId], taskId, noteId',
        users:
          '&id, email, password, username, firstName, lastName, settings, createdAt, updatedAt',
        taskTags: '[taskId+tagId], taskId, tagId',
        tags: '&id, name, color, userId, createdAt, updatedAt',
      })
      .upgrade(async (tx) => {
        const now = new Date();

        // Update Users: Backfill createdAt and updatedAt
        await tx
          .table('users')
          .toCollection()
          .modify((user) => {
            user.createdAt = now;
            user.updatedAt = now;
          });

        // Update Tasks: Backfill priority
        await tx
          .table('tasks')
          .toCollection()
          .modify((task) => {
            task.priority = task.priority ?? 0;
          });
      });

    // Add sync status
    this.version(12)
      .stores({
        tasks:
          '&id, text, completed, completedBy, color, dateAdded, dateUpdated, position, userId, dueDate, priority, syncStatus',
        notes: '&id, content, color, dateAdded, dateUpdated, userId, position',
        taskNotes: '[taskId+noteId], taskId, noteId',
        users:
          '&id, email, password, username, firstName, lastName, settings, createdAt, updatedAt',
        taskTags: '[taskId+tagId], taskId, tagId',
        tags: '&id, name, color, userId, createdAt, updatedAt',
      })
      .upgrade(async (tx) => {
        // Update Tasks: Backfill priority
        await tx
          .table('tasks')
          .toCollection()
          .modify((task) => {
            task.syncStatus = task.syncStatus ?? 'new';
          });
      });

    this.users = this.table('users');
    this.tasks = this.table('tasks');
    this.tags = this.table('tags');
    this.notes = this.table('notes');
    this.taskNotes = this.table('taskNotes');
    this.taskTags = this.table('taskTags');
  }
}

export const db = new AppDatabase();
