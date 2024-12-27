import { useNoteStore } from '@/lib/store/note';

/**
 * A component that renders two buttons to confirm or cancel linking a note to a task.
 *
 * The component is only rendered if the user is currently linking a note to a task.
 *
 * The confirm button calls `confirmLinking` from the note store, and
 * the cancel button calls `cancelLinking` from the note store.
 */
const LinkingControls = () => {
  const { confirmLinking, cancelLinking, isLinking } = useNoteStore();

  if (!isLinking) return null;

  return (
    <div className="flex py-2 gap-2">
      <button
        className="w-[50%] text-center font-bold py-2 px-4 rounded-md
        bg-green-500 hover:bg-green-600 text-white"
        onClick={confirmLinking}
      >
        ✔ Confirm
      </button>
      <button
        className="w-[50%] text-center font-bold py-2 px-4 rounded-md
        bg-red-500 hover:bg-red-600 text-white"
        onClick={cancelLinking}
      >
        ✖ Cancel
      </button>
    </div>
  );
};

export default LinkingControls;
