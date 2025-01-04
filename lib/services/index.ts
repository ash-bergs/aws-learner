import { TaskService } from './task';
import { NoteService } from './note';
import { TagsService } from './tags';

export const taskService = new TaskService();
export const noteService = new NoteService();
export const tagsService = new TagsService();
