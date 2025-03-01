import React, { useState } from 'react';
import classNames from 'classnames';
import Confetti from 'react-confetti';

type ToggleCompletionButtonProps = {
  isCompleted: boolean;
  onToggle: () => void;
  ariaLabel: string;
};

const ToggleCompletionButton = ({
  isCompleted,
  onToggle,
  ariaLabel,
}: ToggleCompletionButtonProps) => {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleClick = () => {
    if (!isCompleted) {
      setShowConfetti(true);

      setTimeout(() => {
        setShowConfetti(false);
        onToggle();
      }, 1500);
    } else {
      onToggle();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={classNames(
          'flex items-center justify-center h-6 w-6 rounded-full border-2 transition-colors',
          isCompleted
            ? 'bg-highlight border-highlight text-white'
            : 'bg-gray-200 border-gray-400 text-gray-600'
        )}
        aria-label={ariaLabel}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3 z-10"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {showConfetti && (
        <Confetti
          numberOfPieces={70} // Adjust the number of confetti pieces
          recycle={false} // Confetti should not recycle
          gravity={0.5} // Adjust the fall speed
          initialVelocityX={3} // Simulates confetti coming from the button
          initialVelocityY={8} // Simulates confetti coming from the button
          width={400} // Constrain the confetti area to the button's vicinity
          height={70} // Constrain the confetti area to the button's vicinity
          style={{
            position: 'absolute',
            top: -26,
            bottom: 0,
            left: -350,
          }}
        />
      )}
    </div>
  );
};

export default ToggleCompletionButton;
