import { Product, EcommerceProduct } from '../types';

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
  description:
    'Experience comfort and style with the Modern Desk Chair. Designed for clean aesthetics and ergonomic support, its smooth backrest and cushioned seat ensure all-day comfort.',
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
      enabled: false,
      allowance: '0.01',
      frequency: 'Daily' as const,
      ends: 'Never',
    },
    appAccount: {
      enabled: false,
      mode: 'auto' as const, // auto = on-connect, manual = wallet_addSubAccount
      defaultAccount: 'sub' as const, // sub = app account is default, universal = main account is default
      funding: 'spend-permissions' as const, // spend-permissions = auto-route through main account, manual = direct execution
    },
  },
  theme: 'light' as const,
  viewMode: 'mobile' as const,
};

export const defaultBasePayConfig = {
  productId: 'base-pay' as const,
  product: {
    name: 'Wooden Chair',
    subtitle: 'Comfort meets simplicity',
    imageUrl: '/chair-blue.png',
    price: '1.00',
  },
  formAppearance: {
    showContactInfo: true,
    showShippingInfo: true,
    logoUrl: '',
    appName: '',
  },
  payment: {
    recipientAddress: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
    testnet: true,
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
