# USDC Faucet Components

Reusable components for claiming testnet USDC on Base Sepolia.

## Components

### `USDCFaucetButton`

A styled button component that triggers the faucet modal.

**Usage:**

```tsx
import { USDCFaucetButton } from '@/components/faucet';

function MyPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <USDCFaucetButton onClick={() => setShowModal(true)} />
    </div>
  );
}
```

**Props:**

- `onClick: () => void` - Callback when the button is clicked

**Features:**

- USDC logo in blue circle
- "Testnet USDC required" title
- "Get sepolia USDC on Base" subtitle
- Right arrow icon
- Hover effects

---

### `USDCFaucetModal`

A modal component that handles the complete faucet claim flow.

**Usage:**

```tsx
import { USDCFaucetModal } from '@/components/faucet';

function MyPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button onClick={() => setShowModal(true)}>Get USDC</button>
      <USDCFaucetModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
```

**Props:**

- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Callback when modal should close

**Features:**

- Multi-stage flow: Sign In → Claim → Success/Error
- Base Account SDK integration for wallet connection
- CDP SDK integration for faucet claims (via API route)
- Transaction hash with BaseScan link
- Error handling with user-friendly messages
- Responsive design
- Accessible (ESC key support, click outside to close would need to be added)

---

## Complete Example

Here's a complete example combining both components:

```tsx
'use client';

import { useState } from 'react';
import { USDCFaucetButton, USDCFaucetModal } from '@/components/faucet';

export default function MyPage() {
  const [showFaucetModal, setShowFaucetModal] = useState(false);

  return (
    <div className="p-8">
      <h1>My Demo Page</h1>

      <div className="mt-4">
        <USDCFaucetButton onClick={() => setShowFaucetModal(true)} />
      </div>

      <USDCFaucetModal isOpen={showFaucetModal} onClose={() => setShowFaucetModal(false)} />
    </div>
  );
}
```

---

## Flow Stages

The modal progresses through the following stages:

1. **signIn** - Initial state, prompts user to sign in with Base Account SDK
2. **claiming** - After sign-in, shows user address and "Claim Now" button
3. **success** - Shows success message and transaction hash with BaseScan link
4. **error** - Shows error message with close button

---

## Requirements

### Frontend Dependencies

- `@base-org/account` - For wallet connection
- `next/image` - For optimized image loading

### Backend Dependencies

- `@coinbase/cdp-sdk` - For faucet claims
- CDP API credentials (see main FAUCET_SETUP.md)

### API Route

The modal requires the `/api/faucet/claim` endpoint to be set up. See:

- `src/app/api/faucet/claim/route.ts`
- `src/app/api/faucet/README.md`

---

## Customization

### Styling

Both components use Tailwind CSS classes. You can customize:

- Colors (currently uses blue-600 for primary, green for success, red for error)
- Spacing and padding
- Border radius (rounded-xl, rounded-3xl)
- Typography

### Network

To change the network, update:

- `appChainIds: [84532]` in `USDCFaucetModal.tsx` (84532 = Base Sepolia)
- Network parameter in `/api/faucet/claim/route.ts`

### Token

To change the token being claimed:

- Update the API route to request different token types
- Update UI text and logos accordingly

---

## Notes

- The modal manages its own internal state (stage, address, txHash, errors)
- State resets when the modal is closed
- The parent component only needs to manage the `isOpen` state
- Console logs are included for debugging
- TypeScript types are fully defined
