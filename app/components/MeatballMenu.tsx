interface MenuItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  // icon?: React.ReactNode; //TODO: Might want an icon for each menu item?
}

interface MeatballMenuProps {
  menuOpen: boolean;
  toggleMenu: () => void;
  items: MenuItem[];
  className?: string;
}

/**
 * A dropdown menu component that renders a button with a stacked meatball icon and a list
 * of menu items. The menu is toggled on click.
 *
 * @param {{ menuOpen: boolean; toggleMenu: () => void; items: { label: string; onClick: () => void; disabled?: boolean }[]; className?: string; }}
 * @returns
 */
const MeatballMenu = ({
  menuOpen,
  toggleMenu,
  items,
  className = '',
}: MeatballMenuProps) => {
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={toggleMenu}
        className="p-2 rounded-full hover:bg-gray-200"
        aria-haspopup="true"
        aria-expanded={menuOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {menuOpen && (
        <ul className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg text-sm z-10">
          {items.map(({ label, onClick, disabled }, index) => (
            <li key={index} role="menuitem">
              <button
                onClick={onClick}
                disabled={disabled}
                className={`flex items-center w-full px-4 py-2 text-left ${
                  disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {/* {icon && <span className="mr-2">{icon}</span>} */}
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MeatballMenu;
