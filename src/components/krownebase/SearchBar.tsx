'use client';

import { Search } from 'lucide-react';
import { ChangeEvent } from 'react';

interface SearchBarProps {
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchChange }) => {
  return (
    <div className="relative flex-grow">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search size={20} className="text-gray-500" />
      </div>
      <input
        type="text"
        placeholder="Search by SKU, Product Name, or Tags..."
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        onChange={onSearchChange} // Wire up the onChange event
      />
    </div>
  );
};

export default SearchBar;
