import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import ColorSelector from './ColorSelector';
import { Task } from '@/lib/db';
import { useTagStore } from '@/lib/store/tag';

type AddTagModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddTagModal = ({ isModalOpen, setIsModalOpen }: AddTagModalProps) => {
  const [tagName, setTagName] = useState('');
  const [color, setColor] = useState('');

  const onColorSelect = (color: string) => {
    setColor(color);
  };
  return (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-semibold">Add a Tag</h1>
        <input
          type="text"
          className="border border-gray-300 rounded p-2"
          placeholder="Tag Name"
          onChange={(e) => {
            setTagName(e.target.value);
          }}
          value={tagName}
          name="Add Tag"
        />
        <div className="border rounded-md p-2">
          <p className="font-semibold text-sm text-secondary">Tag Preview</p>
          <div className="flex justify-center p-6">
            <ColorSelector
              tagText={tagName || 'Tag Name'}
              onColorSelect={onColorSelect}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="w-full text-center font-bold py-2 px-4 rounded-md
        bg-highlight hover:bg-secondary text-white"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="w-full text-center font-bold py-2 px-4 rounded-md
        bg-primary hover:bg-secondary text-white"
            //onClick={TODO}
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddTagModal;
