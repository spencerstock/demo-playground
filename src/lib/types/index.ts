export interface Product {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface EcommerceProduct {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  image: string;
  variants: ProductVariant[];
}

export interface ProductVariant {
  name: string;
  value: string;
}

export interface ProductConfig {
  productId: string;
  formAppearance: {
    showContactInfo: boolean;
    showShippingInfo: boolean;
    logoUrl: string;
    appName: string;
  };
  capabilities: {
    signInWithEthereum: boolean;
    requestAppAccount: boolean;
  };
  requests: {
    spendPermission?: {
      enabled: boolean;
      allowance: string;
      frequency: 'Daily' | 'Weekly' | 'Monthly';
      ends: 'Never' | string;
    };
    appAccount?: {
      enabled: boolean;
      mode?: 'auto' | 'manual'; // auto = on-connect, manual = wallet_addSubAccount
      defaultAccount?: 'sub' | 'universal'; // which account to use by default
      funding?: 'spend-permissions' | 'manual'; // how to fund the app account
    };
  };
  // Preview settings
  theme?: 'light' | 'dark';
  viewMode?: 'mobile' | 'desktop';
  transactDemoMode?: 'mint' | 'transfer';
}

export interface BasePayConfig {
  productId: 'base-pay';
  // Product details
  product: {
    name: string;
    subtitle: string;
    imageUrl: string;
    price: string; // in USD, always used as the payment amount
  };
  formAppearance: {
    showContactInfo: boolean;
    showShippingInfo: boolean;
    logoUrl: string;
    appName: string;
  };
  // Payment settings
  payment: {
    recipientAddress: string; // default: '0x0000000000000000000000000000000000000000'
    testnet: boolean;
  };
  // Payer information collection (optional)
  // Maps to SDK's PayerInfo: { requests: InfoRequest[], callbackURL?: string }
  payerInfo: {
    requests: {
      email: { enabled: boolean; optional: boolean };
      physicalAddress: { enabled: boolean; optional: boolean };
      phoneNumber: { enabled: boolean; optional: boolean };
      name: { enabled: boolean; optional: boolean };
      onchainAddress: { enabled: boolean; optional: boolean };
    };
    callbackUrl?: string;
  };
  // Button styling
  buttonStyle: {
    colorScheme: 'light' | 'dark' | 'system';
  };
  // Preview settings
  theme?: 'light' | 'dark';
  viewMode?: 'mobile' | 'desktop';
}

export interface DemoState {
  currentStep: 'products' | 'product-detail' | 'auth' | 'confirmation' | 'permissions';
  selectedVariant?: string;
  user?: {
    username: string;
    address: string;
  };
}
