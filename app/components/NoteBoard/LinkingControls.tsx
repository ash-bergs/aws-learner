import { useNoteStore } from '@/lib/store/note';

//TODO: style these
const LinkingControls = () => {
  const { confirmLinking, cancelLinking, isLinking } = useNoteStore();

  if (!isLinking) return null;

  return (
    <div className="linking-controls">
      <button onClick={confirmLinking}>✔ Confirm</button>
      <button onClick={cancelLinking}>✖ Cancel</button>
    </div>
  );
};

export default LinkingControls;
