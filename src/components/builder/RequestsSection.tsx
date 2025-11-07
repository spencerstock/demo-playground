'use client';

import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useConfig } from '@/lib/contexts/ConfigContext';

export function RequestsSection() {
  const { config, updateRequests } = useConfig();
  const spendPermission = config.requests.spendPermission;

  return (
    <div className="space-y-6">
      <h3 className="text-[15px] font-semibold text-gray-900">Requests</h3>
      
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[15px] text-gray-900">Spend permission</div>
            <div className="text-sm text-gray-500 mt-0.5">For approval free transactions</div>
          </div>
          <input
            type="radio"
            checked={spendPermission?.enabled}
            onChange={(e) => updateRequests({
              spendPermission: { ...spendPermission!, enabled: e.target.checked }
            })}
            className="w-5 h-5 accent-black cursor-pointer"
          />
        </div>

        {spendPermission?.enabled && (
          <div className="ml-6 space-y-4 p-5 bg-gray-50 rounded-lg">
            <Input
              label="Allowance (ETH)"
              value={spendPermission.allowance}
              onChange={(e) => updateRequests({
                spendPermission: { ...spendPermission, allowance: e.target.value }
              })}
              placeholder="0.01"
            />

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Frequency
              </label>
              <select
                value={spendPermission.frequency}
                onChange={(e) => updateRequests({
                  spendPermission: { 
                    ...spendPermission, 
                    frequency: e.target.value as 'Daily' | 'Weekly' | 'Monthly' | 'Never'
                  }
                })}
                className="w-full px-4 py-2.5 text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Never">Never</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Ends
              </label>
              <select
                value={spendPermission.ends}
                onChange={(e) => updateRequests({
                  spendPermission: { ...spendPermission, ends: e.target.value }
                })}
                className="w-full px-4 py-2.5 text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Never">Never</option>
              </select>
            </div>

            <Button className="w-full">Trigger request</Button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <div className="text-[15px] text-gray-900">App account</div>
            <div className="text-sm text-gray-500 mt-0.5">A dedicated account for your app</div>
          </div>
          <input
            type="radio"
            checked={config.requests.appAccount?.enabled}
            onChange={(e) => updateRequests({
              appAccount: { enabled: e.target.checked }
            })}
            className="w-5 h-5 accent-black cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

