import React from 'react';
import Modal from '../Modal/Modal';
import { useTaskStore } from '@/lib/store/task';
import { useSelectedTaskStore } from '@/lib/store/selected.task';
import TaskItemSkeleton from '../TaskItemSkeleton';
import { primaryButtonStyles, secondaryButtonStyles } from '@/lib/style';
type DeleteConfirmationModalProps = {
  isMassDeleteModalOpen: boolean;
  setIsMassDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const MassDeleteConfirmationModal = ({
  isMassDeleteModalOpen,
  setIsMassDeleteModalOpen,
}: DeleteConfirmationModalProps) => {
  const { tasks, deleteSelectedTasks } = useTaskStore();
  const { selectedTaskIds } = useSelectedTaskStore();

  const selectedTasks = tasks.filter((task) =>
    selectedTaskIds.includes(task.id)
  );

  const handleDeleteTasks = () => {
    console.log("Clicked 'Confirm'", selectedTasks);
    if (!selectedTasks) return;
    deleteSelectedTasks();
    setIsMassDeleteModalOpen(false);
  };
  return (
    <Modal
      isOpen={isMassDeleteModalOpen}
      onClose={() => setIsMassDeleteModalOpen(false)}
    >
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-semibold">Delete Task</h1>
        <p>Are you sure you want to delete these tasks?</p>
        {selectedTasks &&
          selectedTasks.map((task) => (
            <TaskItemSkeleton key={task.id} task={task} />
          ))}
        <div className="flex gap-2">
          <button
            className={secondaryButtonStyles}
            onClick={() => setIsMassDeleteModalOpen(false)}
          >
            Cancel
          </button>
          <button className={primaryButtonStyles} onClick={handleDeleteTasks}>
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MassDeleteConfirmationModal;
