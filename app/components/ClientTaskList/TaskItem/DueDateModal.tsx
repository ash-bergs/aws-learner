import React, { useState } from "react";
import Modal from "../../Modal/Modal";
import { useTaskStore } from "@/lib/store/task";
import { primaryButtonStyles, secondaryButtonStyles } from "@/lib/style";
import type { TaskWithTags } from "@/lib/db";
import moment from "moment";

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
  const [localDueDate, setLocalDueDate] = useState<string>(
    task.dueDate ? moment(task.dueDate).format("YYYY-MM-DD") : ""
  );
  const [timeTracked, setTimeTracked] = useState<number>(task.timeTracked ?? 0);
  const { updateTaskProperty } = useTaskStore();

  const handleUpdateTaskDueDate = () => {
    if (!localDueDate) return;

    updateTaskProperty(task.id, {
      dueDate: moment(localDueDate, "YYYY-MM-DD").toDate(),
      timeTracked,
    });
    setIsDueDateModalOpen(false);
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
          value={localDueDate}
          onChange={(e) => setLocalDueDate(e.target.value)}
        />
        {/** Input to put in minutes for time tracking */}
        <input
          className="mb-4 p-2 border border-highlight rounded-md text-primary w-full"
          type="number"
          step="10"
          placeholder="Minutes"
          value={timeTracked}
          onChange={(e) => setTimeTracked(Number(e.target.value))}
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
