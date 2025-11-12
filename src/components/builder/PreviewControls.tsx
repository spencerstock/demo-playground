'use client';

interface PreviewControlsProps {
  theme: 'light' | 'dark';
  viewMode: 'mobile' | 'desktop';
  onThemeChange: (theme: 'light' | 'dark') => void;
  onViewModeChange: (viewMode: 'mobile' | 'desktop') => void;
  onRefresh: () => void;
}

export function PreviewControls({
  theme,
  viewMode,
  onThemeChange,
  onViewModeChange,
  onRefresh,
}: PreviewControlsProps) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
      {/* Light Mode */}
      <button
        onClick={() => onThemeChange('light')}
        className={`p-2 rounded transition-colors ${
          theme === 'light'
            ? 'bg-gray-100 text-gray-900'
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
        }`}
        title="Light mode"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </button>

      {/* Dark Mode */}
      <button
        onClick={() => onThemeChange('dark')}
        className={`p-2 rounded transition-colors ${
          theme === 'dark'
            ? 'bg-gray-100 text-gray-900'
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
        }`}
        title="Dark mode"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-200" />

      {/* Desktop View */}
      <button
        onClick={() => onViewModeChange('desktop')}
        className={`p-2 rounded transition-colors ${
          viewMode === 'desktop'
            ? 'bg-gray-100 text-gray-900'
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
        }`}
        title="Desktop view"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </button>

      {/* Mobile View */}
      <button
        onClick={() => onViewModeChange('mobile')}
        className={`p-2 rounded transition-colors ${
          viewMode === 'mobile'
            ? 'bg-gray-100 text-gray-900'
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
        }`}
        title="Mobile view"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-200" />

      {/* Refresh */}
      <button
        onClick={onRefresh}
        className="p-2 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
        title="Refresh preview"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    </div>
  );
}
