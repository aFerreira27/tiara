'use client';
import React from 'react';
import { signOut } from 'next-auth/react';
import { UserIcon, LinkIcon, LifeBuoyIcon, LogOutIcon } from 'lucide-react';

interface SidebarPopoverProps {
  isOpen: boolean;
  position: { top: number; left: number };
  onClose: () => void;
  onOpenProfile: () => void;
  onOpenConnections: () => void;
  onOpenSupport: () => void;
}

const SidebarPopover: React.FC<SidebarPopoverProps> = ({
  isOpen,
  position,
  onClose,
  onOpenProfile,
  onOpenConnections,
  onOpenSupport,
}) => {
  if (!isOpen) return null;

  return (
    <div
      data-popover
      className="fixed rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 text-gray-700 dark:text-gray-200 shadow-lg z-[9999] w-56"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateY(-100%)' // Position above the button
      }}
    >
      <div className="px-1 space-y-1">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenProfile();
          }}
          className="relative flex cursor-pointer select-none items-center gap-3 rounded-md px-3 py-2.5 text-sm outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left font-medium"
        >
          <div className="text-gray-500 dark:text-gray-400">
            <UserIcon className="w-4 h-4" />
          </div>
          <span>Profile</span>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenConnections();
          }}
          className="relative flex cursor-pointer select-none items-center gap-3 rounded-md px-3 py-2.5 text-sm outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left font-medium"
        >
          <div className="text-gray-500 dark:text-gray-400">
            <LinkIcon className="w-4 h-4" />
          </div>
          <span>Connections</span>
        </button>
         <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenSupport();
          }}
          className="relative flex cursor-pointer select-none items-center gap-3 rounded-md px-3 py-2.5 text-sm outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left font-medium"
        >
          <div className="text-gray-500 dark:text-gray-400">
            <LifeBuoyIcon className="w-4 h-4" />
          </div>
          <span>Support</span>
        </button>
      </div>

      <div className="my-2 h-px bg-gray-200 dark:bg-gray-600 mx-2"></div>

      <button
        onClick={() => signOut({ callbackUrl: window.location.origin })}
        className="relative flex cursor-pointer select-none items-center gap-3 rounded-md px-3 py-2.5 text-sm outline-none transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left text-red-600 dark:text-red-400 font-medium"
      >
        <div className="text-red-500 dark:text-red-400">
          <LogOutIcon className="w-4 h-4" />
        </div>
        <span>Logout</span>
      </button>

    </div>
  );
};

export default SidebarPopover;