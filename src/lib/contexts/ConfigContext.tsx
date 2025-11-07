'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductConfig } from '../types';
import { defaultConfig } from '../data/products';

interface ConfigContextType {
  config: ProductConfig;
  updateConfig: (updates: Partial<ProductConfig>) => void;
  updateFormAppearance: (updates: Partial<ProductConfig['formAppearance']>) => void;
  updateCapabilities: (updates: Partial<ProductConfig['capabilities']>) => void;
  updateRequests: (updates: Partial<ProductConfig['requests']>) => void;
  updateTheme: (theme: 'light' | 'dark') => void;
  updateViewMode: (viewMode: 'mobile' | 'desktop') => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const [config, setConfig] = useState<ProductConfig>(defaultConfig);

  // Load config from URL parameters if available
  useEffect(() => {
    const configParam = searchParams.get('config');
    if (configParam) {
      try {
        const parsedConfig = JSON.parse(decodeURIComponent(configParam));
        setConfig(parsedConfig);
      } catch (error) {
        console.error('Failed to parse config from URL:', error);
      }
    }
  }, [searchParams]);

  const updateConfig = (updates: Partial<ProductConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const updateFormAppearance = (updates: Partial<ProductConfig['formAppearance']>) => {
    setConfig(prev => ({
      ...prev,
      formAppearance: { ...prev.formAppearance, ...updates }
    }));
  };

  const updateCapabilities = (updates: Partial<ProductConfig['capabilities']>) => {
    setConfig(prev => ({
      ...prev,
      capabilities: { ...prev.capabilities, ...updates }
    }));
  };

  const updateRequests = (updates: Partial<ProductConfig['requests']>) => {
    setConfig(prev => ({
      ...prev,
      requests: { ...prev.requests, ...updates }
    }));
  };

  const updateTheme = (theme: 'light' | 'dark') => {
    setConfig(prev => ({ ...prev, theme }));
  };

  const updateViewMode = (viewMode: 'mobile' | 'desktop') => {
    setConfig(prev => ({ ...prev, viewMode }));
  };

  return (
    <ConfigContext.Provider value={{
      config,
      updateConfig,
      updateFormAppearance,
      updateCapabilities,
      updateRequests,
      updateTheme,
      updateViewMode
    }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider');
  }
  return context;
}

