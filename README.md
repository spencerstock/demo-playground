# Base Demo Playground

A demo playground for building and previewing Base blockchain product integrations.

## Overview

This is a **demo builder/preview tool** that allows you to:
- Configure and customize Base product demos (Sign in with Base, Base Pay, Transact)
- Preview demos in a mobile interface
- Generate code snippets for integration

**Note:** This is a preview tool, not a functional payment/auth app. It uses Base UI components for authentic branding but does not process actual payments or authentication.

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **@base-org/account-ui** - Pre-built Base UI components

## Getting Started

1. Install dependencies:
```bash
yarn install
```

2. Run the development server:
```bash
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  app/
    page.tsx                          # Desktop landing page
    products/
      [slug]/
        configure/
          page.tsx                    # Configuration view with preview
    demo/
      layout.tsx                      # Mobile demo wrapper
      page.tsx                        # Products list
      products/
        wooden-chair/
          page.tsx                    # Product detail (e-commerce demo)
        sign-in/
          page.tsx                    # Sign in product page
      auth/
        page.tsx                      # Auth modal
        confirm/
          page.tsx                    # Auth success
        permissions/
          page.tsx                    # Permission screen
  components/
    ui/                               # Core UI components
    products/                         # Product components
    builder/                          # Builder interface components
    demo/                             # Demo interface components
  lib/
    data/
      products.ts                     # Product data
    types/
      index.ts                        # TypeScript types
    contexts/
      ConfigContext.tsx               # Configuration state
```

## Features

### Desktop Builder Interface
- Product selection sidebar
- Configuration forms with live preview
- Mobile preview frame
- Code snippet generation

### Mobile Demo Experience
- Products list
- Product detail pages (e-commerce example)
- Authentication flow with modal
- Permission management screens
- Demo settings panel
- Mobile browser chrome (Safari-style)

### Base UI Integration
- `SignInWithBaseButton` - Authentic Base sign-in button
- `BasePayButton` - Base Pay checkout button
- Both components are visual-only and call your onClick handlers

## Configuration Options

### Sign in with Base
- **Form Appearance**: Contact info, shipping info toggles
- **App Branding**: Logo URL, app name
- **Capabilities**: Sign in with ethereum, request app account
- **Requests**: Spend permissions with allowance/frequency settings

### Base Pay
- Product customization
- Payment display settings

## Design References

See `design-mockups/` directory for the original Figma mockups that guided this implementation.

## SDK Reference

- **SDK Location**: `/Users/spencerstock/src/account-sdk/`
- **UI Package**: `@base-org/account-ui`
- **Documentation**: See `/Users/spencerstock/src/account-sdk/packages/account-ui/README.md`

## Development Notes

1. **Client-Side Rendering**: Base UI components work CSR only. Pages using them have `'use client'` directive.

2. **Mock Data**: The demo uses mock data for:
   - User: "skyr.base.eth"
   - App: "Morpho"
   - Product: Wooden Chair with color variants

3. **No Backend**: This is a frontend-only preview tool. Configuration changes update the UI instantly without API calls.

## Color Scheme

- **Primary Blue**: `#0000FF` (Base brand color)
- **Black**: Buttons, text
- **White**: Backgrounds, cards
- **Gray**: Borders, secondary elements

## Building for Production

```bash
yarn build
yarn start
```

## License

See LICENSE file for details.
