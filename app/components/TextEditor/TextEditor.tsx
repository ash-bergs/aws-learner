'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useNoteStore } from '@/lib/store/note';
import Toolbar from './Toolbar';

/**
 * A basic text editor component using tiptap.
 *
 * @returns {React.ReactElement} The JSX element representing the text editor.
 */
const TextEditor = (): React.ReactElement => {
  const { addNote } = useNoteStore();

  const editor = useEditor({
    extensions: [StarterKit],
    content: `
      <p> Write your notes here! </p>`,
  });

  const saveNote = () => {
    const content = editor?.getJSON();
    if (!content) return;

    addNote(content);
  };

  return (
    <div className="rounded-md p4 mt-6">
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="h-64 overflow-y-auto bg-white border rounded-b p-2"
      />
      <button
        className="w-full text-center font-bold py-2 px-4 mt-4 rounded-md
        bg-primary hover:bg-blue-600 text-white"
        onClick={saveNote}
      >
        Save Note
      </button>
    </div>
  );
};

export default TextEditor;
