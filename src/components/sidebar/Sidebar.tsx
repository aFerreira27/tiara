'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import SidebarLogo from './SidebarLogo';
import SidebarNavigation from './SidebarNavigation';
import SidebarUser from './SidebarUser';
import SidebarPopover from './SidebarPopover';
import ProfileOverlayContent from './overlay/ProfileOverlayContent';
import ConnectionsOverlayContent from './overlay/ConnectionsOverlayContent';
import SupportOverlayContent from './overlay/SupportOverlayContent';
import Overlay from './overlay/Overlay';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isProfileOverlayOpen, setIsProfileOverlayOpen] = useState(false);
  const [isConnectionsOverlayOpen, setIsConnectionsOverlayOpen] = useState(false);
  const [isSupportOverlayOpen, setIsSupportOverlayOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

  const handleOpenProfileOverlay = () => {
    setIsProfileOverlayOpen(true);
    setIsPopoverOpen(false); // Close popover when overlay opens
  };

  const handleCloseProfileOverlay = () => {
    setIsProfileOverlayOpen(false);
  };

  const handleOpenConnectionsOverlay = () => {
    setIsConnectionsOverlayOpen(true);
    setIsPopoverOpen(false); // Close popover when overlay opens
  };

  const handleCloseConnectionsOverlay = () => {
    setIsConnectionsOverlayOpen(false);
  };

  const handleOpenSupportOverlay = () => {
    setIsSupportOverlayOpen(true);
    setIsPopoverOpen(false); // Close popover when overlay opens
  };

  const handleCloseSupportOverlay = () => {
    setIsSupportOverlayOpen(false);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsPopoverOpen(true);
    setPopoverPosition({
      top: event.currentTarget.getBoundingClientRect().top,
      left: event.currentTarget.getBoundingClientRect().right,
    });
  };

  const handleClosePopover = () => {
    setIsPopoverOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 w-64 p-4">
      <SidebarLogo />
      <SidebarNavigation />
      <div className="mt-auto">
        <SidebarUser
          session={session}
          onOpenPopover={handleOpenPopover}
        />
      </div>

      <SidebarPopover
        isOpen={isPopoverOpen}
        position={popoverPosition}
        onClose={handleClosePopover}
        onOpenProfile={handleOpenProfileOverlay}
        onOpenConnections={handleOpenConnectionsOverlay}
        onOpenSupport={handleOpenSupportOverlay}
      />

      {/* Profile Overlay */}
      <Overlay isOpen={isProfileOverlayOpen} onClose={handleCloseProfileOverlay} title="Profile">
        <ProfileOverlayContent session={session} onClose={handleCloseProfileOverlay} />
      </Overlay>

      {/* Connections Overlay */}
      <Overlay isOpen={isConnectionsOverlayOpen} onClose={handleCloseConnectionsOverlay} title="Connections">
        <ConnectionsOverlayContent onClose={handleCloseConnectionsOverlay} />
      </Overlay>

      {/* Support Overlay */}
      <Overlay isOpen={isSupportOverlayOpen} onClose={handleCloseSupportOverlay} title="Support">
        <SupportOverlayContent onClose={handleCloseSupportOverlay} />
      </Overlay>
    </div>
  );
}