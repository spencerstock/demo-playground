'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductConfig, BasePayConfig } from '../types';
import { defaultConfig, defaultBasePayConfig } from '../data/products';

type AnyConfig = ProductConfig | BasePayConfig;

interface ConfigContextType {
  config: AnyConfig;
  updateConfig: (updates: Partial<AnyConfig>) => void;
  updateFormAppearance: (updates: Partial<ProductConfig['formAppearance']>) => void;
  updateCapabilities: (updates: Partial<ProductConfig['capabilities']>) => void;
  updateRequests: (updates: Partial<ProductConfig['requests']>) => void;
  updateTheme: (theme: 'light' | 'dark') => void;
  updateViewMode: (viewMode: 'mobile' | 'desktop') => void;
  // Base Pay specific methods
  updateProduct: (updates: Partial<BasePayConfig['product']>) => void;
  updatePayment: (updates: Partial<BasePayConfig['payment']>) => void;
  updatePayerInfo: (updates: Partial<BasePayConfig['payerInfo']>) => void;
  updatePayerInfoRequest: (type: string, enabled: boolean, optional: boolean) => void;
  updateButtonStyle: (updates: Partial<BasePayConfig['buttonStyle']>) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children, initialConfig }: { children: ReactNode; initialConfig?: AnyConfig }) {
  const searchParams = useSearchParams();
  const [config, setConfig] = useState<AnyConfig>(initialConfig || defaultConfig);

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

  const updateConfig = (updates: Partial<AnyConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const updateFormAppearance = (updates: Partial<ProductConfig['formAppearance']>) => {
    setConfig(prev => {
      if ('formAppearance' in prev) {
        return {
          ...prev,
          formAppearance: { ...prev.formAppearance, ...updates }
        };
      }
      return prev;
    });
  };

  const updateCapabilities = (updates: Partial<ProductConfig['capabilities']>) => {
    setConfig(prev => {
      if ('capabilities' in prev) {
        return {
          ...prev,
          capabilities: { ...prev.capabilities, ...updates }
        };
      }
      return prev;
    });
  };

  const updateRequests = (updates: Partial<ProductConfig['requests']>) => {
    setConfig(prev => {
      if ('requests' in prev) {
        return {
          ...prev,
          requests: { ...prev.requests, ...updates }
        };
      }
      return prev;
    });
  };

  const updateProduct = (updates: Partial<BasePayConfig['product']>) => {
    setConfig(prev => {
      if ('product' in prev) {
        return {
          ...prev,
          product: { ...prev.product, ...updates }
        };
      }
      return prev;
    });
  };

  const updatePayment = (updates: Partial<BasePayConfig['payment']>) => {
    setConfig(prev => {
      if ('payment' in prev) {
        return {
          ...prev,
          payment: { ...prev.payment, ...updates }
        };
      }
      return prev;
    });
  };

  const updatePayerInfo = (updates: Partial<BasePayConfig['payerInfo']>) => {
    setConfig(prev => {
      if ('payerInfo' in prev) {
        return {
          ...prev,
          payerInfo: { ...prev.payerInfo, ...updates }
        };
      }
      return prev;
    });
  };

  const updatePayerInfoRequest = (type: string, enabled: boolean, optional: boolean) => {
    setConfig(prev => {
      if ('payerInfo' in prev) {
        return {
          ...prev,
          payerInfo: {
            ...prev.payerInfo,
            requests: {
              ...prev.payerInfo.requests,
              [type]: { enabled, optional }
            }
          }
        };
      }
      return prev;
    });
  };

  const updateButtonStyle = (updates: Partial<BasePayConfig['buttonStyle']>) => {
    setConfig(prev => {
      if ('buttonStyle' in prev) {
        return {
          ...prev,
          buttonStyle: { ...prev.buttonStyle, ...updates }
        };
      }
      return prev;
    });
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
      updateProduct,
      updatePayment,
      updatePayerInfo,
      updatePayerInfoRequest,
      updateButtonStyle,
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

