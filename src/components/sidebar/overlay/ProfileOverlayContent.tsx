'use client';

import { Session } from "next-auth";
import Image from "next/image";

interface ProfileOverlayContentProps {
  session: Session | null;
  onClose: () => void;
}

const ProfileOverlayContent = ({
  session,
  onClose
}: ProfileOverlayContentProps) => (
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
        <h3 className="text-lg font-medium text-gray-950 dark:text-gray-50">
          {session?.user?.name || 'User'}
        </h3>
        <p className="text-gray-700 dark:text-gray-200">
          {session?.user?.email || 'No email available'}
        </p>
      </div>
    </div>

    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input
            type="text"
            value={session?.user?.name || ''}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="text"
            value={session?.user?.email || ''}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
          />
        </div>
      </div>
    </div>

    {/* You can add more profile information or actions here */}

    <div className="flex justify-end">
      <button
        onClick={onClose}
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Close
      </button>
    </div>
  </div>
);

export default ProfileOverlayContent;
