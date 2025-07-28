'use client';
import React from 'react';
import { XIcon } from 'lucide-react';

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Overlay: React.FC<OverlayProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" data-overlay>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Overlay;