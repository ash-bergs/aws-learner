'use client';

import React, { useState } from 'react';
import { useTaskStore } from '@/lib/store/task';
import {
  PlannerInputGroup,
  type PlannerTask,
} from './inputs/PlannerInputGroup';

type SectionKeys = 'contact' | 'schedule' | 'followUp' | 'research' | 'create';

type Sections = Record<SectionKeys, PlannerTask[]>;

const PlannerForm = () => {
  const { addTask } = useTaskStore();
  const [bigGoal, setBigGoal] = useState({
    text: '',
    date: '',
    tag: '',
    priority: 0,
  });
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Adds section tasks
    Object.entries(sections).forEach(([, items]) => {
      items.forEach(async (item) => {
        console.log(item);
        if (item.text.trim()) {
          await addTask({
            text: item.text,
            tagIds: item.tag ? [item.tag] : [], // eventually we want to support adding more than 1 tag
            dueDate: item.date,
            priority: item.priority,
          });
        }
      });
    });
    // Adds big goal
    await addTask({
      text: bigGoal.text,
      tagIds: bigGoal.tag ? [bigGoal.tag] : [], // eventually we want to support adding more than 1 tag
      dueDate: bigGoal.date,
      priority: bigGoal.priority,
    });
    setBigGoal({ text: '', date: '', tag: '', priority: 0 });
    setSections({
      contact: [{ text: '', tag: '', date: '' }],
      schedule: [{ text: '', date: '', tag: '' }],
      followUp: [{ text: '', tag: '', date: '' }],
      research: [{ text: '', tag: '', date: '' }],
      create: [{ text: '', tag: '', date: '' }],
    });
  };

  return (
    <main className="p-6 bg-note text-tertiary rounded-sm shadow-sm">
      <h1 className="text-2xl font-bold">Weekly Planner</h1>
      <p>
        This is a place to plan your week from a high-level, a &quot;brain
        dump&quot; if you will. Add tasks, organize them with tags, by date, and
        priority.
      </p>
      <form onSubmit={handleSubmit} className="space-y-2 mt-4">
        <label className="block text-lg font-medium">My Big Goal</label>
        <p className="text-sm">
          What is your most important goal for this week?
        </p>
        <PlannerInputGroup
          value={bigGoal}
          onChange={(field, value) =>
            setBigGoal({ ...bigGoal, [field]: value })
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4">
          {Object.entries(sections).map(([section, items]) => (
            <div key={section} className="space-y-2">
              <h2 className="font-semibold">
                This week I need to{' '}
                <span>{section.replace(/([A-Z])/g, ' $1')}</span> ...
              </h2>
              {items.map((item, index) => (
                <PlannerInputGroup
                  key={index}
                  value={item}
                  onChange={(field, value) =>
                    handleChange(section as SectionKeys, index, field, value)
                  }
                />
              ))}
              <button
                type="button"
                onClick={() => addField(section as SectionKeys)}
                className="text-tertiary font-semibold mt-1 cursor-pointer hover:underline"
              >
                + Add More
              </button>
            </div>
          ))}
        </div>

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
