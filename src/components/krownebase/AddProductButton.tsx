'use client';

import { PlusCircle } from 'lucide-react';

interface AddProductButtonProps {
  onClick: () => void;
}

const AddProductButton: React.FC<AddProductButtonProps> = ({ onClick }) => {
  return (
    <button 
      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      onClick={onClick}
    >
      <PlusCircle size={20} className="mr-2" />
      Or add a new product
    </button>
  );
};

export default AddProductButton;
