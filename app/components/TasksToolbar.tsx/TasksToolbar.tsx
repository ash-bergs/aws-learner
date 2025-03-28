import React from "react";
import { useTaskStore } from "@/lib/store/task";
import { useSelectedTaskStore } from "@/lib/store/selected.task";
import { useNoteStore } from "@/lib/store/note";
import { useStore } from "@/lib/store/app";
import AddTagModal from "./AddTagModal";
import MassDeleteConfirmationModal from "./MassDeleteConfirmationModal";
import TooltipButton from "../TooltipButton";
import NestedTagTree from "../NestedTagTree";

//TODO: break this component up

const buttonClass =
  "bg-primary rounded-sm disabled:bg-gray-400 hover:bg-secondary text-white p-2 font-semibold text-sm cursor-pointer disabled:cursor-not-allowed";
const checkboxLabelClass = "flex items-center text-sm font-semibold text-text";
const TasksToolbar = () => {
  const clearExpandedRef = React.useRef<() => void>(() => {});
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isMassDeleteModalOpen, setIsMassDeleteModalOpen] =
    React.useState(false);

  const {
    selectAllTasks,
    selectedTagIds,
    clearSelectedTags,
    setSelectedTagIds,
  } = useTaskStore();
  const { selectedTaskIds } = useSelectedTaskStore();
  const { isLinking } = useNoteStore();

  const {
    hideCompletedTasks,
    toggleHideCompletedTasks,
    disableColorCodeTasks,
    toggleColorCodeTasks,
    //userId,
  } = useStore();

  return (
    <div className="p-4 rounded-sm shadow-sm bg-utility flex flex-col gap-2">
      <div className="flex gap-2 flex-col">
        <div>
          <div className="flex items-center justify-between">
            <p className="font-bold text-text text-lg">Filter by Tag</p>
          </div>
        </div>
        <div className="flex gap-1 flex-wrap">
          <NestedTagTree
            selectedTagIds={new Set(selectedTagIds)}
            setSelectedTagIds={(updatedSet) =>
              setSelectedTagIds(Array.from(updatedSet))
            }
            onClearExpanded={(fn) => {
              clearExpandedRef.current = fn;
            }}
          />
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
                onClick={() => {
                  clearSelectedTags();
                  // Slightly hacky, but it works
                  // TODO: Refactor to a cleaner solution
                  clearExpandedRef.current?.();
                }}
                disabled={selectedTagIds.length === 0}
              >
                Clear Filters
              </button>
              <TooltipButton
                className={buttonClass}
                disabled
                // onClick={() => userId && syncTasks(userId)}
                label="Sync Tasks"
                tooltip="Coming soon - Sync tasks with AWS!"
              />
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
