import { BasePayConfig } from '@/lib/types';

interface PayerInfoRequest {
  type: string;
  optional?: boolean;
}

interface BasePayParams {
  amount: string;
  to: string;
  testnet?: boolean;
  walletUrl?: string;   
  payerInfo?: {
    requests: PayerInfoRequest[];
    callbackURL?: string;
  };
}

/**
 * Generates Base Pay parameters from the product configuration
 * @param config - The Base Pay configuration object
 * @returns Parameters object that can be used in pay() function
 */
export function generateBasePayParams(config: BasePayConfig): BasePayParams {
  const params: BasePayParams = {
    amount: config.product.price,
    to: config.payment.recipientAddress,
  };

  // Add testnet flag if enabled
  if (config.payment.testnet) {
    params.testnet = true;
  }

  // Build payerInfo if any requests are enabled
  const enabledRequests = Object.entries(config.payerInfo.requests)
    .filter(([, req]) => req.enabled)
    .map(([type, req]) => ({
      type,
      ...(req.optional ? { optional: true } : {}),
    }));

  if (enabledRequests.length > 0) {
    params.payerInfo = {
      requests: enabledRequests,
    };

    // Add callback URL if provided
    if (config.payerInfo.callbackUrl) {
      params.payerInfo.callbackURL = config.payerInfo.callbackUrl;
    }
  }

  return params;
}

