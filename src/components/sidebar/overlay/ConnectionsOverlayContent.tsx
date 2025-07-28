'use client';
import React from 'react';

interface ConnectionsOverlayContentProps {
  onClose: () => void;
}

const ConnectionsOverlayContent = ({
  onClose
}: ConnectionsOverlayContentProps) => {
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
};

export default ConnectionsOverlayContent;