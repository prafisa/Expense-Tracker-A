// src/components/Common/SearchBar.jsx
import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div className="relative flex-1">
      <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
      />
    </div>
  );
};

export default SearchBar;