# Mobile Content Spacing System

This document explains the robust spacing system for mobile view components.

## Overview

The new spacing system provides:

- ✅ **Consistent spacing** across mobile and desktop views
- ✅ **Easy configuration** through a centralized component
- ✅ **Semantic spacing scales** for predictable layouts
- ✅ **Automatic padding handling** based on view mode

## Components

### MobileContentContainer

The main wrapper component that handles all spacing logic for mobile/desktop views.

**Location:** `src/components/demo/MobileContentContainer.tsx`

#### Props

```typescript
interface MobileContentContainerProps {
  children: ReactNode;
  viewMode?: 'mobile' | 'desktop';
  variant?: 'default' | 'scrollable' | 'centered' | 'fullscreen';
  showHeader?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}
```

#### Variants

1. **`default`** - Standard layout with optional header/footer
   - Use for simple content pages
   - Content gets standard padding

2. **`scrollable`** - Scrollable content with fixed header/footer
   - Use when content might overflow
   - Header and footer stay fixed at top/bottom
   - Content area scrolls independently

3. **`centered`** - Content vertically and horizontally centered
   - Use for sign-in pages, simple forms
   - Content is centered in viewport

4. **`fullscreen`** - No padding, full control
   - Use when you need complete layout control
   - Useful for custom layouts

#### Automatic Spacing

The container automatically applies:

- **Mobile**: `px-6 py-6` for content padding
- **Desktop**: `px-8 py-8` for content padding
- **Desktop**: Fixed width (`375px`) and height (varies by variant)
- **Desktop**: Rounded corners and shadow for card appearance

## Spacing Utilities

Export `spacing` object provides semantic spacing scales:

```typescript
import { spacing } from '@/components/demo/MobileContentContainer';
```

### Section Spacing

Vertical spacing between major sections:

```typescript
spacing.section.sm; // 'mb-4'  - 16px
spacing.section.md; // 'mb-6'  - 24px
spacing.section.lg; // 'mb-8'  - 32px
spacing.section.xl; // 'mb-12' - 48px
```

**Example:**

```tsx
<div className={spacing.section.lg}>
  <h1>Major Section</h1>
</div>
```

### Element Spacing

Spacing between elements within a section:

```typescript
spacing.element.xs; // 'mb-1' - 4px
spacing.element.sm; // 'mb-2' - 8px
spacing.element.md; // 'mb-3' - 12px
spacing.element.lg; // 'mb-4' - 16px
```

**Example:**

```tsx
<h1 className={spacing.element.md}>Title</h1>
<p>Description text</p>
```

### Gap Spacing

For flex/grid containers:

```typescript
spacing.gap.xs; // 'gap-1' - 4px
spacing.gap.sm; // 'gap-2' - 8px
spacing.gap.md; // 'gap-3' - 12px
spacing.gap.lg; // 'gap-4' - 16px
spacing.gap.xl; // 'gap-6' - 24px
```

**Example:**

```tsx
<div className={`flex ${spacing.gap.md}`}>
  <Button>Cancel</Button>
  <Button>Confirm</Button>
</div>
```

## Usage Examples

### Example 1: Centered Page (Sign-In)

```tsx
<MobileContentContainer viewMode={viewMode} variant="centered">
  <div className="flex flex-col items-center">
    <div className={spacing.section.lg}>
      <Logo />
    </div>

    <div className={`text-center ${spacing.section.lg}`}>
      <h1 className={spacing.element.md}>Sign in with Base</h1>
      <p>Description text</p>
    </div>

    <SignInButton />
  </div>
</MobileContentContainer>
```

### Example 2: Scrollable Page with Header/Footer

```tsx
const header = (
  <div className="flex items-center justify-between">
    <span>Signed in as user</span>
    <SettingsButton />
  </div>
);

const footer = (
  <div className={`flex ${spacing.gap.md}`}>
    <Button variant="secondary">Cancel</Button>
    <Button>Confirm</Button>
  </div>
);

<MobileContentContainer
  viewMode={viewMode}
  variant="scrollable"
  showHeader={true}
  header={header}
  footer={footer}
>
  <h1 className={spacing.element.sm}>Title</h1>
  <p className={spacing.section.lg}>Description</p>

  <div className={spacing.section.lg}>{/* Long content that might need scrolling */}</div>
</MobileContentContainer>;
```

### Example 3: Default Page

```tsx
<MobileContentContainer viewMode={viewMode} variant="default">
  <h1 className={spacing.section.md}>Page Title</h1>

  <div className={spacing.section.lg}>
    <h2 className={spacing.element.sm}>Section 1</h2>
    <p>Content here</p>
  </div>

  <div className={spacing.section.lg}>
    <h2 className={spacing.element.sm}>Section 2</h2>
    <p>More content</p>
  </div>
</MobileContentContainer>
```

## Migration Guide

### Before (Old Approach)

```tsx
<div
  className={`min-h-screen flex flex-col ${isDesktop ? 'bg-transparent items-center justify-center' : 'bg-white'}`}
>
  <div
    className={`${isDesktop ? 'w-[375px] h-[600px] bg-white rounded-3xl shadow-xl p-8' : 'px-6 py-6'}`}
  >
    <h1 className="mb-6">Title</h1>
    <p className="mb-8">Content</p>
  </div>
</div>
```

### After (New Approach)

```tsx
<MobileContentContainer viewMode={viewMode} variant="default">
  <h1 className={spacing.section.md}>Title</h1>
  <p className={spacing.section.lg}>Content</p>
</MobileContentContainer>
```

## Benefits

1. **No More Manual Padding Logic** - Container handles all padding automatically
2. **Consistent Spacing** - Use semantic scales instead of arbitrary values
3. **Easy Updates** - Change spacing in one place, affects all components
4. **View Mode Agnostic** - Same code works for mobile and desktop
5. **Better Maintainability** - Clear hierarchy with section/element/gap spacing

## Tips

- Use `spacing.section.*` for major vertical spacing between sections
- Use `spacing.element.*` for smaller spacing between related elements
- Use `spacing.gap.*` for flex/grid container gaps
- Prefer `scrollable` variant when content might exceed viewport height
- Use `centered` variant for authentication/simple forms
- The container automatically handles desktop card styling (rounded corners, shadow, fixed width)

## Files Updated

The following files have been migrated to the new system:

- ✅ `src/app/demo/page.tsx`
- ✅ `src/app/demo/products/sign-in/page.tsx`
- ✅ `src/app/demo/products/wooden-chair/page.tsx`
- ✅ `src/app/demo/auth/confirm/page.tsx`
- ✅ `src/app/demo/auth/permissions/page.tsx`
- ✅ `src/app/demo/auth/page.tsx` (partial - modal only)
