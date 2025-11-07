'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { ProductConfig } from '../types';
import { defaultConfig } from '../data/products';

interface ConfigContextType {
  config: ProductConfig;
  updateConfig: (updates: Partial<ProductConfig>) => void;
  updateFormAppearance: (updates: Partial<ProductConfig['formAppearance']>) => void;
  updateCapabilities: (updates: Partial<ProductConfig['capabilities']>) => void;
  updateRequests: (updates: Partial<ProductConfig['requests']>) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ProductConfig>(defaultConfig);

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

  return (
    <ConfigContext.Provider value={{
      config,
      updateConfig,
      updateFormAppearance,
      updateCapabilities,
      updateRequests
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

