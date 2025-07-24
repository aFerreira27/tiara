'use client';

import { useSession } from 'next-auth/react';
import Sidebar from '../../components/Sidebar';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'authenticated') {
    // Add checks for session and session.user
    if (session && session.user) {
      return (
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 p-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p>Welcome, {session.user.name}!</p>
            {/* Display other dashboard content */}
          </div>
        </div>
      );
    } else {
      // Handle the case where session or session.user is undefined despite being authenticated
      return <p>Authenticated, but user data is not available.</p>;
    }
  }

  return <p>Access Denied</p>; // Should not be reached if middleware is working
}
