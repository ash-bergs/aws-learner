'use client';

import React, { useEffect, useRef, useState } from 'react';
import { COLORS } from '@/utils/constants';
// we'll need to get the current theme from the app store
//import { useStore } from '@/lib/store/app';

const ColorSelector = ({
  onColorSelect,
  tagText,
}: {
  onColorSelect: (color: string) => void;
  tagText: string;
}) => {
  //TODO: create different sets of colors for tasks/notes depending on the theme
  // const { theme } = useStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLORS[2].class);
  const [selectedTextColor, setSelectedTextColor] = useState(COLORS[2].text);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    // TODO: trap focus in the dropdown
    const handleKeyDown = (event: KeyboardEvent) => {
      // don't bubble up the keydown event
      event.stopPropagation();
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button
        className={`rounded-full p-2 ${selectedTextColor} font-medium focus:outline focus:outline-highlight shadow ${selectedColor}`}
        ref={dropdownButtonRef}
        aria-haspopup="listbox"
        aria-expanded={dropdownOpen}
        aria-label="Select a color"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {tagText}
      </button>
      {dropdownOpen && (
        <div
          className="absolute left-0 mt-2 bg-white shadow-md rounded-lg p-2 flex flex-wrap gap-2 z-20"
          role="listbox"
          aria-label="Color options"
        >
          {COLORS.map((color) => (
            <div
              key={color.name}
              role="option"
              aria-selected={color.class === selectedColor}
              aria-label={color.name}
              tabIndex={0} // make each option focusable
              className={`w-8 h-8 rounded-full cursor-pointer border ${
                color.class
              } ${
                selectedColor === color.class ? 'ring-2 ring-highlight' : ''
              }`}
              onClick={() => {
                setSelectedColor(color.class);
                setSelectedTextColor(color.text);
                onColorSelect(color.name);
                setDropdownOpen(false);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  setSelectedColor(color.class);
                  setSelectedTextColor(color.text);
                  onColorSelect(color.name);
                  setDropdownOpen(false);
                  // Return focus to the button
                  dropdownButtonRef.current?.focus();
                }
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorSelector;
