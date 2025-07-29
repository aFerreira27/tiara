'use client';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

const SidebarLogo = () => {
  return (
    <Link
      href="/dashboard"
      className="w-full outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus:border-none focus:shadow-none hover:shadow-none active:shadow-none border-none shadow-none ring-0"
      style={{ boxShadow: 'none', outline: 'none', border: 'none' }}
    >
      <div className="flex items-center justify-center mb-4 w-full">
        <Image
          src="/tiaraLogo.svg"
          alt="Tiara Logo"
          width={5000}
          height={3000}
          className="h-auto w-full object-contain"
        />
      </div>
    </Link>
  );
};

export default SidebarLogo;