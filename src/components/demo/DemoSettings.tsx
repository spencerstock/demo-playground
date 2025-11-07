'use client';

import { useState } from 'react';
import { Toggle } from '../ui/Toggle';
import { Input } from '../ui/Input';
import { useConfig } from '@/lib/contexts/ConfigContext';

type Tab = 'appearance' | 'capabilities' | 'requests';

export function DemoSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('appearance');
  const { config, updateFormAppearance, updateCapabilities, updateRequests } = useConfig();

  return (
    <div className="border-t border-gray-200 bg-gray-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-sm font-medium text-gray-700"
      >
        Demo settings
        <svg 
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6 space-y-4">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('appearance')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'appearance'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Form Appearance
            </button>
            <button
              onClick={() => setActiveTab('capabilities')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'capabilities'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Capabilities
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'requests'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Requests
            </button>
          </div>

          {/* Form Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-4 pt-2">
              <Input
                label="Logo URL"
                value={config.formAppearance.logoUrl}
                onChange={(e) => updateFormAppearance({ logoUrl: e.target.value })}
                placeholder="https://example.com/logo.svg or example.com"
              />
              <Input
                label="App Name"
                value={config.formAppearance.appName}
                onChange={(e) => updateFormAppearance({ appName: e.target.value })}
                placeholder="Your App Name"
              />
            </div>
          )}

          {/* Capabilities Tab */}
          {activeTab === 'capabilities' && (
            <div className="space-y-4 pt-2">
              <Toggle
                label="Sign in with ethereum"
                checked={config.capabilities.signInWithEthereum}
                onChange={(checked) => updateCapabilities({ signInWithEthereum: checked })}
              />
              <Toggle
                label="Request app account"
                description="A dedicated account for your app"
                checked={config.capabilities.requestAppAccount}
                onChange={(checked) => updateCapabilities({ requestAppAccount: checked })}
              />
            </div>
          )}

          {/* Requests Tab */}
          {activeTab === 'requests' && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[15px] text-gray-900">Spend permission</div>
                  <div className="text-sm text-gray-500 mt-0.5">For approval free transactions</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.requests.spendPermission?.enabled || false}
                  onChange={(e) => updateRequests({
                    spendPermission: { 
                      ...config.requests.spendPermission!,
                      enabled: e.target.checked 
                    }
                  })}
                  className="w-5 h-5 accent-black cursor-pointer"
                />
              </div>

              {config.requests.spendPermission?.enabled && (
                <div className="ml-6 space-y-4 p-4 bg-white rounded-lg border border-gray-200">
                  <Input
                    label="Allowance (ETH)"
                    value={config.requests.spendPermission.allowance}
                    onChange={(e) => updateRequests({
                      spendPermission: { 
                        ...config.requests.spendPermission!,
                        allowance: e.target.value 
                      }
                    })}
                    placeholder="0.01"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Frequency
                    </label>
                    <select
                      value={config.requests.spendPermission.frequency}
                      onChange={(e) => updateRequests({
                        spendPermission: { 
                          ...config.requests.spendPermission!,
                          frequency: e.target.value as 'Daily' | 'Weekly' | 'Monthly'
                        }
                      })}
                      className="w-full px-4 py-2.5 text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Ends
                    </label>
                    <select
                      value={config.requests.spendPermission.ends}
                      onChange={(e) => updateRequests({
                        spendPermission: { 
                          ...config.requests.spendPermission!,
                          ends: e.target.value 
                        }
                      })}
                      className="w-full px-4 py-2.5 text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="Never">Never</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[15px] text-gray-900">App account</div>
                  <div className="text-sm text-gray-500 mt-0.5">A dedicated account for your app</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.requests.appAccount?.enabled || false}
                  onChange={(e) => updateRequests({
                    appAccount: { enabled: e.target.checked }
                  })}
                  className="w-5 h-5 accent-black cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

