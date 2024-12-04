'use client';

import { useState } from 'react';
// we'll need to get the current theme from the app store
//import { useStore } from '@/lib/store/app';

// constant to record colors that map to tailwind tokens
export const COLORS = [
  { name: 'red', class: 'bg-red-200' },
  { name: 'blue', class: 'bg-blue-200' },
  { name: 'green', class: 'bg-green-200' },
  { name: 'yellow', class: 'bg-yellow-200' },
  { name: 'purple', class: 'bg-purple-200' },
  { name: 'pink', class: 'bg-pink-200' },
  { name: 'orange', class: 'bg-orange-200' },
  { name: 'gray', class: 'bg-gray-200' },
];

const ColorSelector = ({
  onColorSelect,
}: {
  onColorSelect: (color: string) => void;
}) => {
  //TODO: create different sets of colors for tasks/notes depending on the theme
  // const { theme } = useStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLORS[2].class);

  return (
    <div className="relative">
      <button
        className={`w-6 h-6 rounded-full border focus:outline-none ${selectedColor}`}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      ></button>
      {dropdownOpen && (
        <div className="absolute left-0 mt-2 bg-white shadow-md rounded-lg p-2 flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <div
              key={color.name}
              className={`w-8 h-8 rounded-full cursor-pointer border ${color.class}`}
              onClick={() => {
                setSelectedColor(color.class);
                onColorSelect(color.name);
                setDropdownOpen(false);
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorSelector;
