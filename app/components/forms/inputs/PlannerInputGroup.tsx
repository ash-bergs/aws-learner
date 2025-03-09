import React from 'react';
import TagSelector from '../../AddTasks/TagSelector';

interface PlannerTask {
  text: string;
  date?: string;
  tag?: string;
  priority?: number;
}

interface PlannerInputGroupProps {
  value: PlannerTask;
  onChange: <K extends keyof PlannerTask>(
    field: K,
    value: PlannerTask[K]
  ) => void;
  togglePriority: () => void; // Handle this differently?
}

export const PlannerInputGroup: React.FC<PlannerInputGroupProps> = ({
  value,
  onChange,
  togglePriority,
}) => {
  return (
    <div className="flex gap-2 items-center bg-primary p-2 rounded-sm shadow-xs">
      {/* Text Input */}
      <input
        type="text"
        value={value.text}
        onChange={(e) => onChange('text', e.target.value)}
        className="w-full p-2 rounded-sm bg-background placeholder-gray-700"
        placeholder="Describe task..."
      />

      {/* Date Input */}
      <input
        type="date"
        value={value.date || ''}
        onChange={(e) => onChange('date', e.target.value)}
        className="p-2 rounded-sm w-1/4 bg-background text-text"
      />

      {/* Tag Selector */}
      <TagSelector
        selectedTag={value.tag || ''}
        onTagSelect={(tag) => onChange('tag', tag)}
      />

      {/* Priority Toggle */}
      <button
        type="button"
        onClick={togglePriority}
        className={`p-2 rounded ${
          value.priority ? 'bg-yellow-400' : 'bg-gray-200'
        }`}
      >
        ⭐
      </button>
    </div>
  );
};
