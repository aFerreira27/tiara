'use client';

import { useSession } from 'next-auth/react';
import Sidebar from '../../components/Sidebar';

export default function KrowneBase() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <h1>Krowne Base</h1>
    </div>
  )
}

