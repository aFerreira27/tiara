'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '../../components/Sidebar';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }
    if (!session) {
      router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null; // Or an access denied message
  }

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
}
