'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '../../components/Sidebar';

export default function KrowneLink() {
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
    return null;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <h1>Krowne Link</h1>
    </div>
  );
}
