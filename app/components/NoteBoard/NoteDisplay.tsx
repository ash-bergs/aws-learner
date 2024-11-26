import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const NoteDisplay = ({ content }: { content: Record<string, object> }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable: false, // it might be cool to have in-place editing in the future
  });

  return (
    <div className="border rounded-md bg-gray-100 p-4">
      <EditorContent editor={editor} />
    </div>
  );
};

export default NoteDisplay;
