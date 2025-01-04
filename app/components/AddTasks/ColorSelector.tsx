'use client';

import { useState } from 'react';
import { COLORS } from '@/utils/constants';
// we'll need to get the current theme from the app store
//import { useStore } from '@/lib/store/app';

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
    <div className="relative flex items-center">
      <button
        className={`w-6 h-6 rounded-full border ${selectedColor}`}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      ></button>
      {dropdownOpen && (
        <div className="absolute left-0 mt-2 bg-white shadow-md rounded-lg p-2 flex flex-wrap gap-2 z-20">
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
