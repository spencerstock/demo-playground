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

