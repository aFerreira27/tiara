'use client';
import type { Session } from 'next-auth';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';

// Import or define your icons here (example using placeholder circles or ideally an icon library)
const ProductIcon = () => <span className="mr-2 inline-block w-4 h-4 bg-blue-500 rounded-full"></span>;
const UserIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const LinkIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
const LifeBuoyIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2a10 10 0 100 20 10 10 0 000-20zm0 16a6 6 0 100-12 6 6 0 000 12z" /></svg>;
const LogOutIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const SettingsIcon = () => <span className="mr-2 inline-block w-4 h-4 bg-green-500 rounded-full"></span>;
const XIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

// Define the PopoverTrigger component
const PopoverTrigger = React.forwardRef<HTMLButtonElement, {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  togglePopover: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  className?: string;
}>(({ className, onClick, togglePopover, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={className}
      onClick={(event) => {
        onClick?.(event);
        togglePopover(event);
      }}
      {...props}
    >
      {children}
    </button>
  );
});
PopoverTrigger.displayName = "PopoverTrigger";

// Overlay Component
const Overlay = ({ isOpen, onClose, title, children }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <XIcon />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Profile Overlay Content
const ProfileContent = ({ session }: { session: Session | null }) => (
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

// Connections Overlay Content
const ConnectionsContent = () => {
  const [connections, setConnections] = React.useState({
    salesforce: { connected: false, status: 'Not connected' },
    autoquotes: { connected: true, status: 'Connected' },
    salespad: { connected: false, status: 'Not connected' },
    krowne: { connected: true, status: 'Connected' }
  });

  const handleConnect = (service: string) => {
    setConnections(prev => ({
      ...prev,
      [service]: { connected: true, status: 'Connected' }
    }));
  };

  const handleDisconnect = (service: string) => {
    setConnections(prev => ({
      ...prev,
      [service]: { connected: false, status: 'Not connected' }
    }));
  };

  const services = [
    { key: 'salesforce', name: 'Salesforce', icon: '☁️' },
    { key: 'autoquotes', name: 'AutoQuotes', icon: '📋' },
    { key: 'salespad', name: 'SalesPad', icon: '💼' },
    { key: 'krowne', name: 'Krowne.com', icon: '🔗' }
  ];

  return (
    <div className="space-y-4">
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Connect your account to third-party services to sync data and streamline your workflow.
      </p>
      
      <div className="space-y-3">
        {services.map((service) => {
          const connection = connections[service.key as keyof typeof connections];
          return (
            <div key={service.key} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{service.icon}</div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{service.name}</p>
                  <p className={`text-sm ${connection.connected ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {connection.status}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                {connection.connected ? (
                  <>
                    <button 
                      className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    >
                      Configure
                    </button>
                    <button 
                      onClick={() => handleDisconnect(service.key)}
                      className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => handleConnect(service.key)}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Need help connecting?</h4>
        <p className="text-sm text-blue-700 dark:text-blue-200 mb-3">
          Visit our documentation for step-by-step integration guides.
        </p>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          View Integration Docs →
        </button>
      </div>
    </div>
  );
};

// Support Overlay Content
const SupportContent = () => {
  const [activeTab, setActiveTab] = React.useState('faq');

  const tabs = [
    { id: 'faq', label: 'FAQ', icon: '❓' },
    { id: 'bug', label: 'Report a Bug', icon: '🐛' },
    { id: 'docs', label: 'Docs', icon: '📚' }
  ];

  const faqItems = [
    {
      question: "How do I connect my Salesforce account?",
      answer: "Go to Connections and click 'Connect' next to Salesforce. You'll be redirected to authenticate with your Salesforce credentials."
    },
    {
      question: "Why isn't my data syncing?",
      answer: "Check your connection status in the Connections tab. If connected, try refreshing the sync or contact support."
    },
    {
      question: "How do I generate a spec sheet?",
      answer: "Navigate to the Spec Sheet Generator from the sidebar and follow the step-by-step wizard."
    },
    {
      question: "Can I export my data?",
      answer: "Yes, most data can be exported to CSV or PDF format from the respective module's export options."
    }
  ];

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'faq' && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {faqItems.map((item, index) => (
                <details key={index} className="group">
                  <summary className="flex cursor-pointer items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">{item.question}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-25 dark:bg-gray-800/50 rounded-b-lg -mt-1">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
            <div className="text-center pt-4">
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                View All FAQs →
              </button>
            </div>
          </div>
        )}

        {activeTab === 'bug' && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Report a Bug</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Help us improve by reporting any issues you encounter.
            </p>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bug Category
                </label>
                <select className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option>Select a category</option>
                  <option>Login Issues</option>
                  <option>Data Sync Problems</option>
                  <option>UI/Display Issues</option>
                  <option>Performance Issues</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea 
                  rows={4}
                  placeholder="Please describe the issue in detail..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Steps to Reproduce
                </label>
                <textarea 
                  rows={3}
                  placeholder="1. Go to... 2. Click on... 3. Expected vs actual result..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className="w-full px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
              >
                Submit Bug Report
              </button>
            </form>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Documentation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Access comprehensive guides and documentation for all features.
            </p>
            
            <div className="space-y-3">
              <a href="#" className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                <div className="text-blue-600 dark:text-blue-400">📖</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Getting Started Guide</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Learn the basics and set up your account</p>
                </div>
                <div className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">→</div>
              </a>
              
              <a href="#" className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                <div className="text-green-600 dark:text-green-400">🔗</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Integration Guides</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Connect with Salesforce, AutoQuotes, and more</p>
                </div>
                <div className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">→</div>
              </a>
              
              <a href="#" className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                <div className="text-purple-600 dark:text-purple-400">⚙️</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">API Documentation</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Developer resources and API reference</p>
                </div>
                <div className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">→</div>
              </a>
              
              <a href="#" className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                <div className="text-orange-600 dark:text-orange-400">🎥</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Video Tutorials</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Step-by-step video guides</p>
                </div>
                <div className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">→</div>
              </a>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Need more help?</h4>
              <p className="text-sm text-blue-700 dark:text-blue-200 mb-3">
                Can&apos;t find what you&apos;re looking for? Our support team is here to help.
              </p>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Contact Support →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Sidebar() {
  const { data: session } = useSession();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

  const products = [
    { name: 'KrowneSync', href: '/krowne-sync' },
    { name: 'KrowneLink', href: '/krowne-link' },
    { name: 'KrowneBase', href: '/krowne-base' },
    { name: 'Spec Sheet Generator', href: '/spec-sheet-generator' },
  ];

  // Close popover when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // Don't close if clicking inside the popover
      if (isPopoverOpen && !target.closest('[data-popover]')) {
        setIsPopoverOpen(false);
      }
    };

    if (isPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopoverOpen]);

  const togglePopover = (event?: React.MouseEvent<HTMLButtonElement>) => {
    if (event && !isPopoverOpen) {
      const rect = event.currentTarget.getBoundingClientRect();
      setPopoverPosition({
        top: rect.top - 10, // Position above the button
        left: rect.left,
      });
    }
    
    setIsPopoverOpen(!isPopoverOpen);
  };

  const openOverlay = (overlayType: string) => {
    console.log('Opening overlay:', overlayType);
    setActiveOverlay(overlayType);
    setIsPopoverOpen(false); // Close popover when opening overlay
  };

  const closeOverlay = () => {
    console.log('Closing overlay');
    setActiveOverlay(null);
  };

  return (
    <>
      <div className="flex flex-col justify-between h-full bg-gray-200 dark:bg-gray-700 w-64 relative">
        <nav className="flex flex-col p-4">
          <Image 
            src="/tiaraLogo.svg" 
            alt="Tiara Logo" 
            width={150}
            height={150}
            className="mb-4"
          />
          <h2 className="text-lg font-bold mb-4">Products</h2>
          <ul>
            {products.map((product) => (
              <li key={product.name} className="mb-2">
                <Link href={product.href} className="text-blue-600 hover:underline dark:text-blue-400 flex items-center">
                  <ProductIcon />
                  {product.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* User Info and Settings Button */}
        <div className="p-4 border-t border-gray-300 dark:border-gray-600">
          <PopoverTrigger 
            togglePopover={togglePopover}
            className="mt-4 w-full text-left flex items-center text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-600 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors border border-gray-200 dark:border-gray-500"
          >
            {session?.user ? (
              <>
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={40}
                    height={40}
                    className="rounded-full mr-4"
                  />
                )}
                <div className="flex flex-col flex-1">
                  <p className="text-base font-medium leading-tight">{session.user.name || 'User'}</p>
                  {session.user.email && <p className="text-sm leading-tight text-gray-500 dark:text-gray-400">{session.user.email}</p>}
                </div>
                <div className="ml-2">
                  {isPopoverOpen ? '▲' : '▼'}
                </div>
              </>
            ) : (
              <div className="flex items-center">
                <SettingsIcon />
                Loading user info...
                <div className="ml-auto">
                  {isPopoverOpen ? '▲' : '▼'}
                </div>
              </div>
            )}
          </PopoverTrigger>
        </div>
      </div>

      {/* Fixed Position Popover - Outside sidebar container */}
      {isPopoverOpen && (
        <div 
          data-popover
          className="fixed rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 text-gray-700 dark:text-gray-200 shadow-lg z-[9999] w-56"
          style={{
            top: `${popoverPosition.top}px`,
            left: `${popoverPosition.left}px`,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="px-1">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openOverlay('profile');
              }}
              className="relative flex cursor-pointer select-none items-center gap-3 rounded-md px-3 py-2.5 text-sm outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left font-medium"
            >
              <div className="text-gray-500 dark:text-gray-400">
                <UserIcon />
              </div>
              <span>Profile</span>
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openOverlay('connections');
              }}
              className="relative flex cursor-pointer select-none items-center gap-3 rounded-md px-3 py-2.5 text-sm outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left font-medium"
            >
              <div className="text-gray-500 dark:text-gray-400">
                <LinkIcon />
              </div>
              <span>Connections</span>
            </button>
          </div>
          
          <div className="my-2 h-px bg-gray-200 dark:bg-gray-600 mx-2"></div>
          
          <div className="px-1">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openOverlay('support');
              }}
              className="relative flex cursor-pointer select-none items-center gap-3 rounded-md px-3 py-2.5 text-sm outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left font-medium"
            >
              <div className="text-gray-500 dark:text-gray-400">
                <LifeBuoyIcon />
              </div>
              <span>Support</span>
            </button>
          </div>
          
          <div className="my-2 h-px bg-gray-200 dark:bg-gray-600 mx-2"></div>
          
          <div className="px-1">
            <button 
              onClick={() => signOut({ callbackUrl: '/' })} 
              className="relative flex cursor-pointer select-none items-center gap-3 rounded-md px-3 py-2.5 text-sm outline-none transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left text-red-600 dark:text-red-400 font-medium"
            >
              <div className="text-red-500 dark:text-red-400">
                <LogOutIcon />
              </div>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Debug info - remove this later */}
      {activeOverlay && (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-2 rounded z-[10000]">
          Active overlay: {activeOverlay}
        </div>
      )}

      {/* Overlays */}
      <Overlay 
        isOpen={activeOverlay === 'profile'} 
        onClose={closeOverlay} 
        title="Profile"
      >
        <ProfileContent session={session} />
      </Overlay>

      <Overlay 
        isOpen={activeOverlay === 'connections'} 
        onClose={closeOverlay} 
        title="Connections"
      >
        <ConnectionsContent />
      </Overlay>

      <Overlay 
        isOpen={activeOverlay === 'support'} 
        onClose={closeOverlay} 
        title="Support"
      >
        <SupportContent />
      </Overlay>
    </>
  );
}