'use client';

import Placeholder from '@tiptap/extension-placeholder';
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

  // following these docs: https://tiptap.dev/docs/editor/extensions/functionality/placeholder
  // but this doesn't appear to be working as expected - wonder why?
  // TODO: check versions, check any next js configs that might be causing issues
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write your notes here!',
      }),
    ],
    content: '',
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
        editor={editor}
        //className="min-h-[200px] focus:outline-none active:outline-none"
        className="h-64 overflow-y-auto bg-white border rounded-b p-2"
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
