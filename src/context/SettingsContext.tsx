import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { settingsAPI } from '../api/client';

interface Settings {
  siteName: string;
  siteDescription: string;
  streamUrl: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
    telegram: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

const defaultSettings: Settings = {
  siteName: 'Cosmos FM',
  siteDescription: 'Официальное радио отеля Cosmos Moscow',
  streamUrl: '',
  contactEmail: '',
  contactPhone: '',
  contactAddress: '',
  social: {
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    telegram: '',
  },
  seo: {
    title: 'Cosmos FM — Радио отеля Cosmos',
    description: 'Слушайте любимые шоу, подкасты и музыку 24/7',
    keywords: 'радио, отель, cosmos, музыка, подкасты',
  },
};

const SettingsContext = createContext<{
  settings: Settings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}>({
  settings: defaultSettings,
  loading: true,
  refreshSettings: async () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const data = await settingsAPI.get();
      if (data && Object.keys(data).length > 0) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: loadSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}