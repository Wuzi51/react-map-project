import { useState } from 'react';

const Tooltip = ({ children, title, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const arrows = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-800 border-t-4 border-x-4 border-x-transparent',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-800 border-b-4 border-x-4 border-x-transparent',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-800 border-l-4 border-y-4 border-y-transparent',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-800 border-r-4 border-y-4 border-y-transparent'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && title && (
        <div className={`absolute z-50 ${positions[position]}`}>
          <div className="bg-gray-800 text-white text-sm px-2 py-1 rounded whitespace-nowrap">
            {title}
          </div>
          <div className={`absolute ${arrows[position]}`}></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;