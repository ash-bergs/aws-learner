import React from 'react';
import { useTaskStore } from '@/lib/store/task';
import { useSelectedTaskStore } from '@/lib/store/selected.task';
import { useNoteStore } from '@/lib/store/note';
import { useTagStore } from '@/lib/store/tag';
import TagItem from './TagItem';
import AddTagModal from './AddTagModal';

const TasksToolbar = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { selectAllTasks, deleteSelectedTasks, setCurrentTagId, currentTagId } =
    useTaskStore();
  const { selectedTaskIds, clearSelectedTaskIds } = useSelectedTaskStore();
  const { isLinking } = useNoteStore();
  const { tags } = useTagStore();

  const handleTagChange = (tagId: string) => {
    clearSelectedTaskIds();
    // if the tagId is the same as the currentTagId, reset the currentTagId
    if (tagId === currentTagId) {
      setCurrentTagId(null);
      return;
    }
    setCurrentTagId(tagId);
  };

  return (
    <div className="p-4 rounded shadow bg-utility flex flex-col gap-2">
      <div className="flex gap-2 flex-col">
        <div>
          <div className="flex items-center justify-between">
            <p className="font-bold text-text text-lg">Filter by Tag</p>
            <button
              className="bg-primary rounded disabled:bg-gray-400 hover:bg-secondary
        text-white p-2 font-semibold
        "
              onClick={() => setIsModalOpen(true)}
            >
              + Add a Tag
            </button>
          </div>
        </div>
        <div className="flex gap-1">
          {tags.map((tag) => (
            <TagItem
              key={tag.id}
              tag={tag}
              currentTagId={currentTagId}
              handleTagChange={handleTagChange}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="font-bold text-text text-lg pb-2">Actions</p>
        <div>
          {/** Rounded search input - standin for now */}
          {/* <input
          type="text"
          placeholder="Search"
          className="bg-white rounded-full disabled:bg-gray-400 hover:bg-secondary
        text-white px-2 text-sm
        h-10
        "
        /> */}
          <div className="flex gap-2">
            <button
              className="bg-primary rounded disabled:bg-gray-400 hover:bg-secondary
        text-white p-2 font-semibold
        "
              onClick={selectAllTasks}
            >
              Select All
            </button>
            <button
              className="bg-primary rounded disabled:bg-gray-400 hover:bg-secondary
        text-white p-2 font-semibold
        "
              onClick={deleteSelectedTasks}
              disabled={isLinking || !selectedTaskIds.length}
            >
              Delete Selected
            </button>
            {/* <button
              className="bg-primary rounded disabled:bg-gray-400 hover:bg-secondary
        text-white p-2 text-sm
        "
              onClick={deleteSelectedTasks}
              disabled={isLinking || !selectedTaskIds.length}
            >
              Toggle Completed
            </button> */}
            {isModalOpen && (
              <AddTagModal
                //task={task}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksToolbar;
