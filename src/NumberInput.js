import React from 'react';

const NumberInput = ({ value, onChange, min = 1, className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <button
        type="button"
        className="px-2 py-1 border border-gray-300 rounded-l-md hover:bg-gray-100"
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        -
      </button>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const newValue = parseInt(e.target.value, 10);
          onChange(isNaN(newValue) ? min : Math.max(min, newValue));
        }}
        className="w-20 px-2 py-1 border border-gray-300 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        style={{ WebkitAppearance: 'none', MozAppearance: 'textfield', appearance: 'textfield' }}
      />
      <button
        type="button"
        className="px-2 py-1 border border-gray-300 rounded-r-md hover:bg-gray-100"
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  );
};

export default NumberInput;
