import { ReactNode } from 'react';

interface MobileContentContainerProps {
  children: ReactNode;
  viewMode?: 'mobile' | 'desktop';
  variant?: 'default' | 'scrollable' | 'centered' | 'fullscreen';
  showHeader?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/**
 * MobileContentContainer
 *
 * A robust container component that handles spacing and layout
 * consistently across mobile and desktop view modes.
 *
 * Spacing System:
 * - Mobile: Uses native padding (px-6, py-6) for content
 * - Desktop: Uses container padding (px-8, py-8) with fixed dimensions
 *
 * Variants:
 * - default: Standard layout with optional header/footer
 * - scrollable: Content area scrolls, footer stays fixed
 * - centered: Content vertically centered
 * - fullscreen: Full height, no padding (for custom layouts)
 */
export function MobileContentContainer({
  children,
  viewMode = 'mobile',
  variant = 'default',
  showHeader = false,
  header,
  footer,
  className = '',
}: MobileContentContainerProps) {
  const isDesktop = viewMode === 'desktop';

  // Desktop wrapper styles
  const desktopContainerClass = isDesktop
    ? 'w-[375px] bg-white rounded-3xl shadow-xl flex flex-col'
    : '';

  // Height varies by variant
  const desktopHeightClass = isDesktop
    ? variant === 'centered'
      ? 'h-[550px]'
      : variant === 'fullscreen'
        ? 'h-[812px]'
        : 'h-[650px]'
    : '';

  // Background varies by variant
  const mobileBackgroundClass = !isDesktop
    ? variant === 'fullscreen'
      ? 'bg-transparent'
      : 'bg-white'
    : '';

  // Outer container - handles viewport layout
  // For mobile scrollable, use h-screen to constrain to viewport height
  const outerContainerClass = `${
    !isDesktop && variant === 'scrollable' ? 'h-screen' : 'min-h-screen'
  } flex flex-col ${
    isDesktop ? 'bg-transparent items-center justify-center' : mobileBackgroundClass
  }`;

  // Inner container - the actual content box
  const innerContainerClass = `${desktopContainerClass} ${desktopHeightClass} ${
    !isDesktop && variant === 'centered' ? 'flex-1 flex flex-col items-center justify-center' : ''
  } ${!isDesktop && variant === 'scrollable' ? 'flex flex-col h-full' : ''} ${className}`;

  // Content padding - the main spacing control
  const contentPaddingClass = variant === 'fullscreen' ? '' : isDesktop ? 'px-8 py-8' : 'px-6 py-6';

  if (variant === 'scrollable') {
    return (
      <div className={outerContainerClass}>
        <div className={innerContainerClass}>
          {/* Optional Header */}
          {showHeader && (
            <div className={isDesktop ? 'px-8 pt-8 pb-4' : 'px-6 pt-6 pb-4'}>{header}</div>
          )}

          {/* Scrollable Content */}
          <div className={`flex-1 overflow-y-auto ${isDesktop ? 'px-8' : 'px-6'}`}>{children}</div>

          {/* Fixed Footer - Add bottom padding for mobile chrome */}
          {footer && (
            <div className={isDesktop ? 'px-8 pb-8 pt-4' : 'px-6 pb-24 pt-4'}>{footer}</div>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'centered') {
    return (
      <div className={outerContainerClass}>
        <div className={innerContainerClass}>
          <div className={contentPaddingClass}>{children}</div>
        </div>
      </div>
    );
  }

  if (variant === 'fullscreen') {
    return (
      <div className={outerContainerClass}>
        <div className={innerContainerClass}>{children}</div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={outerContainerClass}>
      <div className={innerContainerClass}>
        {showHeader && header && (
          <div className={isDesktop ? 'px-8 pt-8 pb-4' : 'px-6 pt-6 pb-4'}>{header}</div>
        )}

        <div className={contentPaddingClass}>{children}</div>

        {footer && <div className={isDesktop ? 'px-8 pb-8 pt-4' : 'px-6 pb-6 pt-4'}>{footer}</div>}
      </div>
    </div>
  );
}

/**
 * Spacing utilities for consistent spacing within content
 */
export const spacing = {
  // Sections - vertical spacing between major sections
  section: {
    sm: 'mb-4',
    md: 'mb-6',
    lg: 'mb-8',
    xl: 'mb-12',
  },
  // Elements - spacing between elements within a section
  element: {
    xs: 'mb-1',
    sm: 'mb-2',
    md: 'mb-3',
    lg: 'mb-4',
  },
  // Gaps - for flex/grid containers
  gap: {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
    xl: 'gap-6',
  },
} as const;
