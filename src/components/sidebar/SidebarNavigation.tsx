'use client';
import Link from 'next/link';
import React from 'react';
import { DatabaseIcon, RefreshCcwIcon, SearchIcon, FileTextIcon } from 'lucide-react';

const products = [
  { name: 'KrowneBase', href: '/krowne-base', icon: <DatabaseIcon className="w-5 h-5 mr-3" /> },
  { name: 'KrowneSync', href: '/krowne-sync', icon: <RefreshCcwIcon className="w-5 h-5 mr-3" /> },
  { name: 'KrowneLens', href: '/krowne-lens', icon: <SearchIcon className="w-5 h-5 mr-3" /> },
  { name: 'SpecSheetGenerator', href: '/spec-sheet-generator', icon: <FileTextIcon className="w-5 h-5 mr-3" /> },
];

const SidebarNavigation = () => {
  return (
    <ul className="space-y-2">
      {products.map((product) => (
        <li key={product.name}>
          <Link href={product.href} className="flex items-center p-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {product.icon}
            <span className="font-medium">{product.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SidebarNavigation;