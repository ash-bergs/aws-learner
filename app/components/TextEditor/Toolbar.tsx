import { Editor } from '@tiptap/react';

import type { JSX } from 'react';

/**
 * A toolbar component for the TextEditor.
 *
 * Provides buttons for text formatting and editor actions,like bold and italic
 *
 * @param {object} props - The component props.
 * @param {Editor | null} props.editor - The Tiptap editor instance.
 * @returns {JSX.Element | null} The JSX element representing the toolbar,
 * or null if no editor instance is provided.
 */
const Toolbar = ({ editor }: { editor: Editor | null }): JSX.Element | null => {
  if (!editor) return null;

  return (
    <div className="flex space-x-2 bg-utility p-2 rounded-t shadow">
      {/* Bold Button */}
      <button
        className={`px-2 py-1 bg-primary rounded text-white ${
          editor.isActive('bold') ? 'bg-secondary' : ''
        }`}
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
      >
        Bold
      </button>

      {/* Italic Button */}
      <button
        className={`px-2 py-1 rounded bg-primary text-white ${
          editor.isActive('italic') ? 'bg-secondary' : ''
        }`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
      >
        Italic
      </button>

      {/* Undo */}
      <button
        className="px-2 py-1 rounded bg-primary text-white"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        Undo
      </button>

      {/* Redo */}
      <button
        className="px-2 py-1 rounded bg-primary text-white"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        Redo
      </button>
    </div>
  );
};

export default Toolbar;
