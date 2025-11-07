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
      frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Never';
      ends: 'Never' | string;
    };
    appAccount?: {
      enabled: boolean;
    };
  };
}

export interface DemoState {
  currentStep: 'products' | 'product-detail' | 'auth' | 'confirmation' | 'permissions';
  selectedVariant?: string;
  user?: {
    username: string;
    address: string;
  };
}

