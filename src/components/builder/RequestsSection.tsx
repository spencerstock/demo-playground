'use client';

import { Input } from '../ui/Input';
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
            type="checkbox"
            checked={spendPermission?.enabled || false}
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
                value={spendPermission.ends}
                onChange={(e) => updateRequests({
                  spendPermission: { ...spendPermission, ends: e.target.value }
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
              appAccount: { 
                ...config.requests.appAccount,
                enabled: e.target.checked,
                mode: 'auto', // Always use auto mode for demo
                defaultAccount: config.requests.appAccount?.defaultAccount || 'sub',
                funding: config.requests.appAccount?.funding || 'spend-permissions',
              }
            })}
            className="w-5 h-5 accent-black cursor-pointer"
          />
        </div>

        {config.requests.appAccount?.enabled && (
          <div className="ml-6 space-y-4 p-5 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Default Account
              </label>
              <select
                value={config.requests.appAccount.defaultAccount || 'sub'}
                onChange={(e) => updateRequests({
                  appAccount: { 
                    ...config.requests.appAccount, 
                    defaultAccount: e.target.value as 'sub' | 'universal'
                  }
                })}
                className="w-full px-4 py-2.5 text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="sub">App Account</option>
                <option value="universal">Main Account</option>
              </select>
              <div className="text-xs text-gray-500 mt-1.5">
                Which account to use by default for transactions
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Funding Mode
              </label>
              <select
                value={config.requests.appAccount.funding || 'spend-permissions'}
                onChange={(e) => updateRequests({
                  appAccount: { 
                    ...config.requests.appAccount, 
                    funding: e.target.value as 'spend-permissions' | 'manual'
                  }
                })}
                className="w-full px-4 py-2.5 text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="spend-permissions">Spend Permissions</option>
                <option value="manual">Manual</option>
              </select>
              <div className="text-xs text-gray-500 mt-1.5">
                {config.requests.appAccount.funding === 'spend-permissions'
                  ? 'Automatically route through main account if app account has insufficient balance'
                  : 'Execute directly from app account without automatic fallbacks'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

