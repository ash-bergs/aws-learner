'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Toolbar from './Toolbar';
import { useNoteStore } from '@/lib/store/note';

const extensions = [StarterKit];
/**
 * A basic text editor component using tiptap.
 *
 * @returns {React.ReactElement} The JSX element representing the text editor.
 */
const TextEditor = () => {
  const { addNote } = useNoteStore();

  const editor = useEditor({
    extensions,
  });

  const saveNote = () => {
    const content = editor?.getJSON();
    if (!content) return;

    addNote(content);

    // clear the contents and refocus the editor
    editor?.commands.clearContent();
    editor?.commands.focus();
  };

  return (
    <div className="rounded-md p4 mt-6">
      <Toolbar editor={editor} />
      <EditorContent
        className="bg-white border rounded-b p-2"
        editor={editor}
      />
      <button
        className="w-full text-center font-bold py-2 px-4 mt-4 rounded-md
        bg-primary hover:bg-secondary text-white"
        onClick={saveNote}
      >
        Save Note
      </button>
    </div>
  );
};

export default TextEditor;
