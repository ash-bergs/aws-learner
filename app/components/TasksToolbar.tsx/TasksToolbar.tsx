import React from 'react';
import { useTaskStore } from '@/lib/store/task';
import { useSelectedTaskStore } from '@/lib/store/selected.task';
import { useNoteStore } from '@/lib/store/note';
import { useTagStore } from '@/lib/store/tag';
import { useStore } from '@/lib/store/app';
import TagItem from './TagItem';
import AddTagModal from './AddTagModal';
import MassDeleteConfirmationModal from './MassDeleteConfirmationModal';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

//TODO: break this component up

const buttonClass =
  'bg-primary rounded-sm disabled:bg-gray-400 hover:bg-secondary text-white p-2 font-semibold text-sm';
const checkboxLabelClass = 'flex items-center text-sm font-semibold text-text';
const TasksToolbar = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isMassDeleteModalOpen, setIsMassDeleteModalOpen] =
    React.useState(false);
  const {
    selectAllTasks,
    setSelectedTagId,
    selectedTagIds,
    clearSelectedTags,
    syncTasks,
  } = useTaskStore();
  const { selectedTaskIds, clearSelectedTaskIds } = useSelectedTaskStore();
  const { isLinking } = useNoteStore();
  const { tags } = useTagStore();
  const {
    hideCompletedTasks,
    toggleHideCompletedTasks,
    disableColorCodeTasks,
    toggleColorCodeTasks,
    userId,
  } = useStore();

  const handleTagChange = (tagId: string) => {
    // now we can have more than 1
    clearSelectedTaskIds();
    setSelectedTagId(tagId);
  };

  return (
    <div className="p-4 rounded-sm shadow-sm bg-utility flex flex-col gap-2">
      <div className="flex gap-2 flex-col">
        <div>
          <div className="flex items-center justify-between">
            <p className="font-bold text-text text-lg">Filter by Tag</p>
          </div>
        </div>
        <div className="flex gap-1 flex-wrap">
          {tags.map((tag) => (
            <TagItem
              key={tag.id}
              tag={tag}
              selectedTagIds={selectedTagIds}
              handleTagChange={handleTagChange}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="font-bold text-text text-lg pb-2">Actions</p>
        <div>
          <div className="flex flex-col gap-2">
            {/** checkbox with a label for hiding completed */}
            <div className="flex gap-2 items-center">
              <label className={checkboxLabelClass}>
                <input
                  type="checkbox"
                  checked={hideCompletedTasks}
                  onClick={toggleHideCompletedTasks}
                  onChange={() => {}}
                  className="mr-2 h-5 w-5"
                />
                Hide Completed
              </label>
              <label className={checkboxLabelClass}>
                <input
                  type="checkbox"
                  checked={disableColorCodeTasks}
                  onClick={toggleColorCodeTasks}
                  onChange={() => {}}
                  className="mr-2 h-5 w-5"
                />
                Disable Color Coding
              </label>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                className={buttonClass}
                onClick={() => setIsModalOpen(true)}
              >
                Add Tag
              </button>
              <button className={buttonClass} onClick={selectAllTasks}>
                Select All
              </button>
              <button
                className={buttonClass}
                onClick={() => setIsMassDeleteModalOpen(true)}
                disabled={isLinking || !selectedTaskIds.length}
              >
                Delete Selected
              </button>
              <button
                className={buttonClass}
                onClick={() => clearSelectedTags()}
                disabled={selectedTagIds.length === 0}
              >
                Clear Filters
              </button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={buttonClass}
                      disabled
                      onClick={() => userId && syncTasks(userId)}
                    >
                      Sync Tasks
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    sideOffset={3}
                    className="bg-highlight text-white rounded-md px-3 py-2 shadow-lg"
                  >
                    Coming Soon!
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {isModalOpen && (
              <AddTagModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
              />
            )}
            {isMassDeleteModalOpen && (
              <MassDeleteConfirmationModal
                isMassDeleteModalOpen={isMassDeleteModalOpen}
                setIsMassDeleteModalOpen={setIsMassDeleteModalOpen}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksToolbar;
