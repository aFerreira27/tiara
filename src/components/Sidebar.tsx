'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import SidebarLogo from './SidebarLogo';
import SidebarNavigation from './SidebarNavigation';
import SidebarUser from './SidebarUser';
import SidebarPopover from './SidebarPopover';
import Overlay from './Overlay';
import ProfileOverlayContent from './ProfileOverlayContent';
import ConnectionsOverlayContent from './ConnectionsOverlayContent';
import SupportOverlayContent from './SupportOverlayContent';

export default function Sidebar() {
  const { data: session } = useSession();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // Don't close if clicking inside the popover or an overlay
      if (isPopoverOpen && !target.closest('[data-popover]') && !target.closest('[data-overlay]')) {
        setIsPopoverOpen(false);
      }
    };

    if (isPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopoverOpen]);

  const togglePopover = (event?: React.MouseEvent<HTMLButtonElement>) => {
    if (event && !isPopoverOpen) {
      const rect = event.currentTarget.getBoundingClientRect();
      // Position popover above the button
      setPopoverPosition({
        top: rect.top - 10, // 10px spacing above the button
        left: rect.left,
      });
    }
    
    setIsPopoverOpen(!isPopoverOpen);
  };

  const openOverlay = (overlayType: string) => {
    console.log('Opening overlay:', overlayType);
    setActiveOverlay(overlayType);
    setIsPopoverOpen(false); // Close popover when opening overlay
  };

  const closeOverlay = () => {
    console.log('Closing overlay');
    setActiveOverlay(null);
  };

  return (
    <>
      <div className="flex flex-col justify-between h-screen bg-gray-100 dark:bg-gray-800 w-64 fixed left-0 top-0 shadow-lg z-10">
        <nav className="flex flex-col p-4">
          <SidebarLogo />
          {/* Horizontal line */}
          <div className="border-t border-gray-300 dark:border-gray-700 mb-4"></div>
          <SidebarNavigation />
        </nav>
        
        <SidebarUser togglePopover={togglePopover} />
      </div>

      <SidebarPopover 
        isPopoverOpen={isPopoverOpen}
        popoverPosition={popoverPosition}
        openOverlay={openOverlay}
      />

      {/* Overlays */}
      <Overlay 
        isOpen={activeOverlay === 'profile'} 
        onClose={closeOverlay} 
        title="Profile"
      >
        <ProfileOverlayContent session={session} />
      </Overlay>

      <Overlay 
        isOpen={activeOverlay === 'connections'} 
        onClose={closeOverlay} 
        title="Connections"
      >
        <ConnectionsOverlayContent />
      </Overlay>

      <Overlay 
        isOpen={activeOverlay === 'support'} 
        onClose={closeOverlay} 
        title="Support"
      >
        <SupportOverlayContent />
      </Overlay>
    </>
  );
}