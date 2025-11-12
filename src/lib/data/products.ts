import { Product, EcommerceProduct, ProductConfig } from '../types';

export const baseProducts: Product[] = [
  {
    id: 'sign-in',
    name: 'Sign in with Base',
    description: 'One click sign-in for apps',
    icon: 'signin',
  },
  {
    id: 'base-pay',
    name: 'Base Pay',
    description: 'Checkout with USDC',
    icon: 'payment',
  },
  {
    id: 'transact',
    name: 'Transact',
    description: 'Onchain transactions',
    icon: 'transaction',
  },
];

export const woodenChair: EcommerceProduct = {
  id: 'wooden-chair',
  name: 'Wooden Chair',
  subtitle: 'Comfort meets simplicity',
  description: 'Experience comfort and style with the Modern Desk Chair. Designed for clean aesthetics and ergonomic support, its smooth backrest and cushioned seat ensure all-day comfort, while blue accents on the seat and wheels add a vibrant pop to your workspace.',
  price: 150,
  image: '/chair-blue.png', // We'll need to add this
  variants: [
    { name: 'Blue', value: 'blue' },
    { name: 'Red', value: 'red' },
    { name: 'White', value: 'white' },
  ],
};

export const defaultConfig = {
  productId: 'sign-in',
  formAppearance: {
    showContactInfo: true,
    showShippingInfo: true,
    logoUrl: '',
    appName: '',
  },
  capabilities: {
    signInWithEthereum: true,
    requestAppAccount: true,
  },
  requests: {
    spendPermission: {
      enabled: true,
      allowance: '0.01',
      frequency: 'Daily' as const,
      ends: 'Never',
    },
    appAccount: {
      enabled: false,
      mode: 'auto', // auto = on-connect, manual = wallet_addSubAccount
      defaultAccount: 'sub', // sub = app account is default, universal = main account is default
      funding: 'spend-permissions', // spend-permissions = auto-route through main account, manual = direct execution
    },
  },
  theme: 'light' as const,
  viewMode: 'mobile' as const,
};

export const defaultTransactConfig: ProductConfig = {
  ...defaultConfig,
  productId: 'transact',
  formAppearance: {
    ...defaultConfig.formAppearance,
  },
  capabilities: {
    ...defaultConfig.capabilities,
    signInWithEthereum: true,
    requestAppAccount: true,
  },
  requests: {
    spendPermission: {
      enabled: true,
      allowance: '0.05',
      frequency: 'Weekly',
      ends: 'Never',
    },
    appAccount: {
      enabled: true,
      mode: 'auto',
      defaultAccount: 'sub',
      funding: 'spend-permissions',
    },
  },
};

export const defaultBasePayConfig = {
  productId: 'base-pay' as const,
  product: {
    name: 'Wooden Chair',
    subtitle: 'Comfort meets simplicity',
    imageUrl: '/chair-blue.png',
    price: '150.00',
  },
  payment: {
    recipientAddress: '0x0000000000000000000000000000000000000000',
    testnet: true,
    enableTelemetry: true,
  },
  payerInfo: {
    requests: {
      email: { enabled: false, optional: false },
      physicalAddress: { enabled: false, optional: false },
      phoneNumber: { enabled: false, optional: false },
      name: { enabled: false, optional: false },
      onchainAddress: { enabled: false, optional: false },
    },
    callbackUrl: '',
  },
  buttonStyle: {
    colorScheme: 'light' as const,
  },
  theme: 'light' as const,
  viewMode: 'mobile' as const,
};

