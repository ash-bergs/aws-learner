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

  const { deleteNote, startLinking, linkingNoteId } = useNoteStore();
  const isBeingLinked = linkingNoteId === id;
  const borderColor = isBeingLinked ? 'border-blue-500' : 'border-note';
  const borderThickness = isBeingLinked ? 'border-4' : 'border-2';

  const menuItems = [
    {
      label: 'Delete',
      onClick: () => {
        deleteNote(id);
      },
    },
    {
      label: 'Link to Task',
      onClick: () => {
        // close the meatball menu
        setMenuOpen(false);
        // begin linking
        startLinking(id);
      },
    },
  ];

  return (
    <div
      className={`flex border rounded-md bg-note p-4 ${borderThickness} ${borderColor}`}
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
