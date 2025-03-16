import React, { useState } from 'react';
import Modal from '../../Modal/Modal';
import { useTaskStore } from '@/lib/store/task';
import { TaskWithTags } from '@/lib/db';
import { primaryButtonStyles, secondaryButtonStyles } from '@/lib/style';

type DueDateModalProps = {
  isDueDateModalOpen: boolean;
  setIsDueDateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  task: TaskWithTags;
};

const DueDateModal = ({
  task,
  isDueDateModalOpen,
  setIsDueDateModalOpen,
}: DueDateModalProps) => {
  const [localDueDate, setLocalDueDate] = useState<string | undefined>(
    task.dueDate ? String(task.dueDate) : undefined
  );
  const { updateTaskDueDate } = useTaskStore();

  const handleUpdateTaskDueDate = () => {
    if (!localDueDate) return;

    // Split the date string into year, month, and day
    const [year, month, day] = localDueDate.split('-').map(Number);

    // Construct a new Date object in the local timezone
    const dueDate = new Date(year, month - 1, day); // Month is 0-based

    if (!isNaN(dueDate.getTime())) {
      updateTaskDueDate(task.id, dueDate);
      setIsDueDateModalOpen(false);
    }
  };
  return (
    <Modal
      isOpen={isDueDateModalOpen}
      onClose={() => setIsDueDateModalOpen(false)}
    >
      <div className="">
        <h1 className="text-lg font-semibold mb-4">Add Due Date</h1>
        <input
          type="date"
          className="mb-4 p-2 border border-highlight rounded-md text-primary w-full"
          value={String(localDueDate)}
          onChange={(e) => setLocalDueDate(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            className={secondaryButtonStyles}
            onClick={() => setIsDueDateModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className={primaryButtonStyles}
            onClick={handleUpdateTaskDueDate}
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DueDateModal;
