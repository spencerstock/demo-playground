import { ProductConfig } from '@/lib/types';

interface WalletConnectParams {
  version: string;
  capabilities?: {
    signInWithEthereum?: {
      chainId: string;
      nonce: string;
    };
    spendPermissions?: {
      [chainId: number]: Array<{
        token: string;
        allowance: string;
        period: number;
      }>;
    };
    subAccounts?: {
      creation: string;
      defaultAccount: string;
      funding: string;
    };
  };
}

/**
 * Generates wallet_connect parameters from the product configuration
 * @param config - The product configuration object
 * @returns Parameters object that can be used in provider.request({ method: 'wallet_connect', params: [...] })
 */
export function generateWalletConnectParams(config: ProductConfig): WalletConnectParams[] {
  // Check if this is a valid ProductConfig (not BasePayConfig)
  if (!('formAppearance' in config) || !('requests' in config) || !('capabilities' in config)) {
    throw new Error('Invalid configuration: This function only works with Sign in with Base product');
  }

  const capabilities: WalletConnectParams['capabilities'] = {};

  // Check if we have any capabilities to add
  const hasCapabilities =
    config.capabilities.signInWithEthereum ||
    config.requests.appAccount?.enabled ||
    config.requests.spendPermission?.enabled;

  if (hasCapabilities) {
    // Sign in with Ethereum
    if (config.capabilities.signInWithEthereum) {
      capabilities.signInWithEthereum = {
        chainId: '0x2105', // Base mainnet
        nonce: Math.random().toString(36).substring(2, 15),
      };
    }

    // App Account (subAccounts)
    if (config.requests.appAccount?.enabled) {
      const defaultAccount = config.requests.appAccount.defaultAccount || 'sub';
      const funding = config.requests.appAccount.funding || 'spend-permissions';

      capabilities.subAccounts = {
        creation: 'on-connect', // Auto-create app account during wallet_connect
        defaultAccount,
        funding,
      };
    }

    // Spend permissions
    if (config.requests.spendPermission?.enabled) {
      const allowanceInWei = parseFloat(config.requests.spendPermission.allowance) * 1e6; // USDC has 6 decimals
      const periodMap = { Daily: 86400, Weekly: 604800, Monthly: 2592000 };
      const period =
        periodMap[config.requests.spendPermission.frequency as keyof typeof periodMap] || 86400;

      capabilities.spendPermissions = {
        8453: [
          {
            token: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
            allowance: `0x${allowanceInWei.toString(16)}`,
            period,
          },
        ],
      };
    }
  }

  return [
    {
      version: '1',
      ...(Object.keys(capabilities).length > 0 ? { capabilities } : { capabilities: {} }),
    },
  ];
}

/**
 * Generates the SDK configuration object
 * @param config - The product configuration object
 * @returns SDK configuration object for createBaseAccountSDK
 */
export function generateSDKConfig(config: ProductConfig) {
  // Check if this is a valid ProductConfig (not BasePayConfig)
  if (!('formAppearance' in config) || !('requests' in config) || !('capabilities' in config)) {
    throw new Error('Invalid configuration: This function only works with Sign in with Base product');
  }

  const sdkConfig: any = {
    appName: config.formAppearance.appName,
    appChainIds: [8453], // Base mainnet
  };

  // Add logo URL if present
  if (config.formAppearance.logoUrl) {
    sdkConfig.appLogoUrl = config.formAppearance.logoUrl;
  }

  // Add subAccounts configuration if app account is enabled
  if (config.requests.appAccount?.enabled) {
    const defaultAccount = config.requests.appAccount.defaultAccount || 'sub';
    const funding = config.requests.appAccount.funding || 'spend-permissions';

    sdkConfig.subAccounts = {
      creation: 'on-connect', // Auto-create app account during wallet_connect
      defaultAccount,
      funding,
    };
  }

  return sdkConfig;
}

