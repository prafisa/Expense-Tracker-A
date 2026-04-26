// src/components/Common/FilterSelect.jsx
import React from 'react';

const FilterSelect = ({ value, onChange, options, placeholder }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-500 text-sm bg-white"
    >
      <option value="">{placeholder}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
};

export default FilterSelect;