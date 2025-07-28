'use client';
import type { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';
import { SettingsIcon } from 'lucide-react';

// Define the PopoverTrigger component (can be moved to a separate utility if reused)
const PopoverTrigger = React.forwardRef<HTMLButtonElement, {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  togglePopover: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  className?: string;
}>(({ className, onClick, togglePopover, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={className}
      onClick={(event) => {
        onClick?.(event);
        togglePopover(event);
      }}
      {...props}
    >
      {children}
    </button>
  );
});
PopoverTrigger.displayName = "PopoverTrigger";

const SidebarUser = ({ togglePopover }: { togglePopover: (event?: React.MouseEvent<HTMLButtonElement>) => void }) => {
  const { data: session } = useSession();

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <PopoverTrigger 
        togglePopover={togglePopover}
        className="w-full text-left flex items-center text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 py-2 px-3 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        {session?.user ? (
          <>
            {session.user.image && (
              <Image
                src={session.user.image}
                alt={session.user.name || 'User'}
                width={32}
                height={32}
                className="rounded-full mr-3"
              />
            )}
            <div className="flex flex-col flex-1 leading-tight">
              <p className="text-sm font-medium">{session.user.name || 'User'}</p>
              {session.user.email && <p className="text-xs text-gray-500 dark:text-gray-400">{session.user.email}</p>}
            </div>
          </>
        ) : (
          <div className="flex items-center">
            <SettingsIcon className="w-5 h-5 mr-3" />
            <span className="text-sm font-medium">Loading user...</span>
          </div>
        )}
      </PopoverTrigger>
    </div>
  );
};

export default SidebarUser;