'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Toolbar from './Toolbar';
import { useNoteStore } from '@/lib/store/note';
import { primaryButtonStyles } from '@/lib/style';

const AccessibleEditor = Extension.create({
  name: 'accessibleEditor',

  addGlobalAttributes() {
    return [
      {
        types: ['editor'], // Trying to apply attributes to the root ProseMirror editor div
        attributes: {
          role: {
            default: 'textbox',
          },
          'aria-label': {
            default: 'Write your note here...',
          },
          'aria-multiline': {
            default: 'true',
          },
          'aria-labelledby': {
            default: 'editor-label',
          },
        },
      },
    ];
  },
});

const extensions = [StarterKit, AccessibleEditor];
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
      <div className="border rounded-md p-2 bg-background text-text">
        <label id="editor-label" className="sr-only">
          Write your note here...
        </label>
        <EditorContent editor={editor} />
      </div>
      <button
        className={`${primaryButtonStyles} w-full text-center`}
        onClick={saveNote}
      >
        Save Note
      </button>
    </div>
  );
};

export default TextEditor;
