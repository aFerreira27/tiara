'use client';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

const SidebarLogo = () => {
  return (
    <Link href="/dashboard">
      <div className="flex items-center justify-center mb-4">
         <Image 
          src="/tiaraLogo.svg" 
          alt="Tiara Logo" 
          width={150} 
          height={150} 
          className="h-auto" 
        />
      </div>
    </Link>
  );
};

export default SidebarLogo;