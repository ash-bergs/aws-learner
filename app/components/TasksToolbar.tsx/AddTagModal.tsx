import React, { useState } from "react";
import Modal from "../Modal/Modal";
import TagPreview from "./TagPreview";
import { useTagStore } from "@/lib/store/tag";
import { COLORS } from "@/utils/constants";
import { primaryButtonStyles, secondaryButtonStyles } from "@/lib/style";
import NestedTagList from "../NestedTagList";

type AddTagModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddTagModal = ({ isModalOpen, setIsModalOpen }: AddTagModalProps) => {
  const [tagName, setTagName] = useState("");
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [color, setColor] = useState(COLORS[2].name);
  const { addTag } = useTagStore();

  if (!isModalOpen) return null;

  const handleAddTag = async () => {
    if (tagName === "") return;
    try {
      const parentId = selectedPath[selectedPath.length - 1];
      await addTag(tagName, color, parentId);
      setIsModalOpen(false);
      // clear state
      setTagName("");
      setColor(COLORS[2].name);
    } catch (error) {
      console.error(error);
    }
  };

  const onColorSelect = (color: string) => {
    setColor(color);
  };
  return (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-semibold">Add a Tag</h1>
        <div>
          Available Parent tags:
          <NestedTagList
            selectedPath={selectedPath}
            setSelectedPath={setSelectedPath}
          />
        </div>
        <input
          type="text"
          className="border border-text rounded-sm p-2"
          placeholder="Tag Name"
          onChange={(e) => {
            setTagName(e.target.value);
          }}
          value={tagName}
          name="Add Tag"
        />
        <div className="rounded-md p-2 bg-utility">
          <p className="font-semibold text-text">Tag Preview</p>
          <div className="flex justify-center p-6">
            <TagPreview
              tagText={tagName || "Tag Name"}
              onColorSelect={onColorSelect}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className={secondaryButtonStyles}
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className={primaryButtonStyles}
            onClick={handleAddTag}
            disabled={tagName === ""}
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddTagModal;
