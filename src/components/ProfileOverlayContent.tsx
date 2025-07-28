'use client';
import type { Session } from 'next-auth';
import Image from 'next/image';
import React from 'react';

const ProfileOverlayContent = ({ session }: { session: Session | null }) => (
  <div className="space-y-4">
    <div className="flex items-center space-x-4">
      {session?.user?.image && (
        <Image
          src={session.user.image}
          alt={session.user.name || 'User'}
          width={80}
          height={80}
          className="rounded-full"
        />
      )}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {session?.user?.name || 'User'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {session?.user?.email || 'No email available'}
        </p>
      </div>
    </div>
    
    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <p className="mt-1 text-sm text-gray-900 dark:text-white">{session?.user?.name || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <p className="mt-1 text-sm text-gray-900 dark:text-white">{session?.user?.email || 'N/A'}</p>
        </div>
      </div>
    </div>
    
    <div className="flex justify-end pt-4">
      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        Edit Profile
      </button>
    </div>
  </div>
);

export default ProfileOverlayContent;