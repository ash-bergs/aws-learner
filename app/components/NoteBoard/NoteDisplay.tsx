'use client';

import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useNoteStore } from '@/lib/store/note';
import MeatballMenu from '../MeatballMenu';

const NoteDisplay = ({
  content,
  id,
}: {
  content: Record<string, object>;
  id: string;
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable: false, // it might be cool to have in-place editing in the future
  });
  const [menuOpen, setMenuOpen] = useState(false);

  const { deleteNote } = useNoteStore();

  const menuItems = [
    {
      label: 'Delete',
      onClick: () => {
        deleteNote(id);
      },
    },
  ];

  return (
    <div
      className="flex border rounded-md bg-note p-4"
      style={{
        justifyContent: 'space-between',
      }}
    >
      <EditorContent editor={editor} />
      <MeatballMenu
        menuOpen={menuOpen}
        toggleMenu={() => setMenuOpen(!menuOpen)}
        items={menuItems}
      />
    </div>
  );
};

export default NoteDisplay;
