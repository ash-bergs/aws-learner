'use client';

import React, { useState } from 'react';
import { useTaskStore } from '@/lib/store/task';
import TagSelector from '../AddTasks/TagSelector';

export interface PlannerTask {
  text: string;
  date?: string;
  tag?: string;
  priority?: number; // Int in the table - using as a boolean for now, but we might want levels to priority so an Int made more sense
}

type SectionKeys = 'contact' | 'schedule' | 'followUp' | 'research' | 'create';

type Sections = Record<SectionKeys, PlannerTask[]>;

const PlannerForm = () => {
  const { addTask } = useTaskStore();
  const [bigGoal, setBigGoal] = useState('');
  const [priorities, setPriorities] = useState<PlannerTask[]>([]);
  const [sections, setSections] = useState<Sections>({
    contact: [{ text: '', date: '', tag: '', priority: 0 }],
    schedule: [{ text: '', date: '', tag: '', priority: 0 }],
    followUp: [{ text: '', date: '', tag: '', priority: 0 }],
    research: [{ text: '', date: '', tag: '', priority: 0 }],
    create: [{ text: '', date: '', tag: '', priority: 0 }],
  });
  // Type Casting solution: Tell TS that `value` should match type of PlannerTask[field] dynamically
  const handleChange = <K extends keyof PlannerTask>(
    section: SectionKeys,
    index: number,
    field: K, // Key(K) of PlannerTask
    value: PlannerTask[K] // Value matches expected type of PlannerTask[field]
  ) => {
    setSections((prev) => {
      const updated = { ...prev };
      // Shallow copy of the array for the specific section (e.g. 'contact')
      updated[section] = [...updated[section]];
      // Create a new obj for the update and dynamically update the corresponding field
      updated[section][index] = { ...updated[section][index], [field]: value };
      return updated;
    });
  };

  const addField = (section: SectionKeys) => {
    setSections((prev) => ({
      ...prev,
      [section]: [
        ...prev[section],
        { text: '', date: '', tag: '', priority: 0 },
      ],
    }));
  };

  const togglePriority = (section: SectionKeys, index: number) => {
    const item = sections[section][index];
    // if there's no text, don't proceed
    if (!item.text) return;
    setSections((prev) => {
      const updated = { ...prev };
      const task = updated[section][index];

      // Toggle priority in Sections state
      task.priority = task.priority === 0 ? 1 : 0;

      return { ...updated };
    });
    // Toggle priority in Priorities state
    setPriorities((prev) => {
      if (prev.includes(item)) {
        return prev.filter((p) => p !== item);
      }
      return [...prev, item];
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Object.entries(sections).forEach(([, items]) => {
      items.forEach(async (item) => {
        console.log(item);
        if (item.text.trim()) {
          await addTask({
            text: item.text,
            tagIds: item.tag ? [item.tag] : [],
            dueDate: item.date,
            priority: item.priority,
          });
        }
      });
    });
    setBigGoal('');
    setSections({
      contact: [{ text: '', tag: '', date: '' }],
      schedule: [{ text: '', date: '', tag: '' }],
      followUp: [{ text: '', tag: '', date: '' }],
      research: [{ text: '', tag: '', date: '' }],
      create: [{ text: '', tag: '', date: '' }],
    });
    setPriorities([]);
  };

  return (
    <main className="p-6 bg-note text-textSecondary rounded shadow">
      <h1 className="text-2xl font-bold">Weekly Planner</h1>
      <p>
        This is a place to plan your week from a high-level. Add tasks, organize
        them with tags, by date, and priority.
      </p>
      <form onSubmit={handleSubmit} className="space-y-2 mt-4">
        <label className="block text-lg font-medium">My Big Goal</label>
        <p className="text-sm">
          What is your most important goal for this week?
        </p>
        <input
          type="text"
          value={bigGoal}
          onChange={(e) => setBigGoal(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Describe your most important goal for this week..."
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4">
          {Object.entries(sections).map(([section, items]) => (
            <div key={section} className="space-y-2">
              <h2 className="font-semibold">
                This week I need to{' '}
                <span>{section.replace(/([A-Z])/g, ' $1')}</span> ...
              </h2>
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-2 items-center bg-primary p-2 rounded shadow-sm"
                >
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) =>
                      handleChange(
                        section as SectionKeys,
                        index,
                        'text',
                        e.target.value
                      )
                    }
                    className="p-2 border rounded w-full"
                    placeholder="Task"
                  />
                  <input
                    type="date"
                    value={item.date}
                    onChange={(e) =>
                      handleChange(
                        section as SectionKeys,
                        index,
                        'date',
                        e.target.value
                      )
                    }
                    className="p-2 border rounded w-1/4"
                  />
                  <TagSelector
                    selectedTag={item.tag || ''}
                    onTagSelect={(tag) =>
                      handleChange(section as SectionKeys, index, 'tag', tag)
                    }
                  />
                  <button
                    type="button"
                    onClick={() =>
                      togglePriority(section as SectionKeys, index)
                    }
                    className={`p-2 rounded ${
                      priorities.includes(item)
                        ? 'bg-yellow-400'
                        : 'bg-gray-200'
                    }`}
                  >
                    ⭐
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField(section as SectionKeys)}
                className="text-blue-500 mt-1"
              >
                + Add More
              </button>
            </div>
          ))}
        </div>

        {priorities.length > 0 && (
          <div className="mt-6 p-4 border rounded bg-gray-100">
            <h2 className="font-bold text-lg">Top Priorities</h2>
            <ul className="list-disc list-inside">
              {priorities.map((p, idx) => (
                <li key={idx}>{p.text || ''}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          className="text-center font-bold py-2 px-4 rounded-md
        bg-primary hover:bg-secondary text-white disabled:bg-gray-400"
        >
          Save Tasks
        </button>
      </form>
    </main>
  );
};

export default PlannerForm;
