import { useState } from 'react';

const TextArea = ({ 
  value = '', 
  onChange, 
  placeholder = '', 
  rows = 3, 
  maxLength, 
  showCount = false, 
  className = '',
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <textarea
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`
          w-full px-3 py-2 border rounded-md resize-vertical
          ${isFocused ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}
          focus:outline-none transition-colors duration-200
          disabled:bg-gray-100 disabled:cursor-not-allowed
        `}
        {...props}
      />
      {showCount && maxLength && (
        <div className="flex justify-end mt-1">
          <span className="text-sm text-gray-500">
            {value.length}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
};

export default TextArea;