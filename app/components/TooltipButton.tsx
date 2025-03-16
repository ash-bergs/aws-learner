import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TooltipButtonProps {
  label: string;
  tooltip: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}
/**
 * A button with a tooltip that displays a message when the user hovers
 * over the button.
 *
 * @returns {React.ReactElement} A JSX element representing the button with
 * a tooltip.
 */
const TooltipButton: React.FC<TooltipButtonProps> = ({
  label,
  tooltip,
  onClick,
  disabled,
  className,
}): React.ReactElement => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className={className} disabled={disabled} onClick={onClick}>
            {label}
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          sideOffset={3}
          className="bg-highlight text-white rounded-md px-3 py-2 shadow-lg"
        >
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipButton;
