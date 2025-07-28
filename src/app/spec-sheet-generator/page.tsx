'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';

export default function SpecSheetGenerator() {
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
    <AppLayout>
      <div>
        <h1>Spec Sheet Generator</h1>
        {/* Add your spec sheet generator components here */}
      </div>
    </AppLayout>
  );
}