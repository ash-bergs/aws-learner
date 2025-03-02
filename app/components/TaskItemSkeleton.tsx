import { TaskWithTags } from '@/lib/store/task';
import { COLORS } from '@/utils/constants';

const TaskItemSkeleton = ({ task }: { task: TaskWithTags }) => {
  const taskTagColor = task.taskTags.length > 0 && task.taskTags[0].tag.color;
  const bgColor =
    task.taskTags.length > 0
      ? COLORS.find((color) => color.name === taskTagColor)?.background
      : 'bg-note';

  const borderColor = 'border-2 border-transparent';
  return (
    <div
      className={`relative flex items-center justify-between p-4 mb-2 ${bgColor} ${borderColor} rounded-md shadow-sm hover:shadow-md transition-shadow gap-2`}
    >
      <div>
        <p>{task.text}</p>
        {task.dueDate && (
          <span id={`task-due-${task.id}`} className="text-gray-500 text-xs">
            Due: {new Date(task.dueDate).toDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskItemSkeleton;
