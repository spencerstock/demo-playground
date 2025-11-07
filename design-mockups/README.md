# Design Mockups

This directory contains the key design mockups for the demo playground web application.

## Primary User Flows

### Desktop Experience
- **01-desktop-landing-products.png** - Landing page showing three products:
  - Sign in with Base (One click sign-in for apps)
  - Base Pay (Checkout with USDC)
  - Transact (Onchain transactions)
  
- **10-desktop-signin-config.png** - Desktop configuration view for "Sign in with Base" product showing form appearance settings and live preview

### Mobile Experience - Main User Flow

#### Product Selection & Detail
- **03-mobile-products-list.png** - Mobile products list view
- **02-mobile-product-detail-checkout.png** - Product detail page (Wooden Chair example) with:
  - Product image and details ($150)
  - Color selection (Blue, Red, White)
  - Base Pay checkout button
  - Product description
  - Demo settings panel

#### Sign In with Base Flow
- **07-mobile-signin-product-page.png** - "Sign in with Base" product information page
- **04-mobile-signin-modal.png** - Sign into Morpho modal with "Sign in with Base" button
- **08-mobile-signin-confirmation.png** - Permission confirmation screen showing what the app can access
- **05-mobile-authenticated-state.png** - Authenticated state showing "Hello, skyr.base.eth!" with settings gear

#### Base Pay Flow
- **06-mobile-permissions-screen.png** - Allow spend permission screen for Morpho app showing:
  - Transfer limits (0.1 ETH/day)
  - Permission management options
  - Cancel/Confirm actions

## Configuration Screens

These screens show the admin/builder interface for configuring the products:

- **11-mobile-signin-config.png** - Mobile configuration for "Sign in with Base" showing:
  - Form appearance toggles (Contact info, Shipping info)
  - Logo URL field (morpho.org)
  - App Name field (Morpho)

- **12-mobile-signin-capabilities.png** - Capabilities configuration showing:
  - Sign in with ethereum toggle
  - Request app account toggle

- **13-mobile-signin-requests.png** - Requests configuration showing:
  - Spend permission settings (Allowance, Frequency, Ends)
  - Trigger request button
  - App account option

## Key Features to Implement

1. **Responsive Design**: Desktop and mobile layouts
2. **Product Catalog**: Three main products with detail pages
3. **Authentication Flow**: Base sign-in integration
4. **Payment Flow**: Base Pay with USDC
5. **Permission Management**: Spend limits and authorization
6. **Demo Settings Panel**: Configuration interface
7. **Base Branding**: Blue color scheme (#0000FF), "base demo" logo

