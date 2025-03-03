import React from 'react';
import Modal from '../../Modal/Modal';
import { type TaskWithTags, useTaskStore } from '@/lib/store/task';
import TaskItemSkeleton from '../../TaskItemSkeleton';
import { primaryButtonStyles, secondaryButtonStyles } from '@/lib/style';
type DeleteConfirmationModalProps = {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  task: TaskWithTags;
};

const DeleteConfirmationModal = ({
  task,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
}: DeleteConfirmationModalProps) => {
  const { deleteTask } = useTaskStore();

  const handleDeleteTask = () => {
    if (!task.id) return;
    deleteTask(task.id);
    setIsDeleteModalOpen(false);
  };
  return (
    <Modal
      isOpen={isDeleteModalOpen}
      onClose={() => setIsDeleteModalOpen(false)}
    >
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-semibold">Delete Task</h1>
        <p>Are you sure you want to delete this task?</p>
        <TaskItemSkeleton task={task} />
        <div className="flex gap-2">
          <button
            className={secondaryButtonStyles}
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </button>
          <button className={primaryButtonStyles} onClick={handleDeleteTask}>
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
