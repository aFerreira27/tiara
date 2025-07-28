'use client';
import React from 'react';

interface SupportOverlayContentProps {
  onClose: () => void;
}

const SupportOverlayContent = ({
  onClose
}: SupportOverlayContentProps) => {
  const [activeTab, setActiveTab] = React.useState('faq');

  const tabs = [
    { id: 'faq', label: 'FAQ', icon: '❓' },
    { id: 'bug', label: 'Report a Bug', icon: '🐛' },
    { id: 'docs', label: 'Docs', icon: '📚' }
  ];

  const faqItems = [
    {
      question: "How do I connect my Salesforce account?",
      answer: "Go to Connections and click 'Connect' next to Salesforce. You&apos;ll be redirected to authenticate with your Salesforce credentials."
    },
    {
      question: "Why isn&apos;t my data syncing?",
      answer: "Check your connection status in the Connections tab. If connected, try refreshing the sync or contact support."
    },
    {
      question: "How do I generate a spec sheet?",
      answer: "Navigate to the Spec Sheet Generator from the sidebar and follow the step-by-step wizard."
    },
    {
      question: "Can I export my data?",
      answer: "Yes, most data can be exported to CSV or PDF format from the respective module&apos;s export options."
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

export default SupportOverlayContent;