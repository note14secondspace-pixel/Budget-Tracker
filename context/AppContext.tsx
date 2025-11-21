
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { LanguageCode, ThemeMode, Transaction, TranslationSchema } from '../types';
import { TRANSLATIONS } from '../constants';

// --- Interfaces ---
interface AppContextType {
  // Theme
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  // Language
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  isRTL: boolean;
  // Data
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  importTransactions: (txs: Transaction[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to generate ID safely (defined outside to be available for initialization)
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for insecure contexts or older browsers
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- State Initialization ---
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as ThemeMode) || 'system';
  });

  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('language');
    return (saved as LanguageCode) || 'en';
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('transactions');
      const parsed = saved ? JSON.parse(saved) : [];
      // Sanitize: Ensure all transactions have IDs to fix legacy/broken data
      if (Array.isArray(parsed)) {
        return parsed.map((tx: any) => ({
          ...tx,
          id: String(tx.id || generateId()) // Force string
        }));
      }
      return [];
    } catch (e) {
      return [];
    }
  });

  // --- Theme Logic ---
  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    localStorage.setItem('theme', theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      applyTheme(theme === 'dark');
    }
  }, [theme]);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
  }, []);

  // --- Language Logic ---
  const isRTL = language === 'ar';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    localStorage.setItem('language', language);
  }, [language, isRTL]);

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback((path: string): string => {
    const keys = path.split('.');
    let current: any = TRANSLATIONS[language];
    
    for (const key of keys) {
      if (current[key] === undefined) {
        console.warn(`Missing translation for ${path} in ${language}`);
        return path;
      }
      current = current[key];
    }
    return current as string;
  }, [language]);

  // --- Transaction Logic ---
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = useCallback((tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: generateId(),
    };
    setTransactions(prev => [newTx, ...prev]);
  }, []);

  const editTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, ...updates } : tx));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  }, []);

  const importTransactions = useCallback((newTransactions: Transaction[]) => {
    setTransactions(prev => {
      const existingIds = new Set(prev.map(t => t.id));
      
      // Sanitize imported data: ensure IDs exist and prevent duplicates
      const validNewTransactions = newTransactions.map(t => ({
        ...t,
        id: String(t.id || generateId()) // Generate ID if missing in import and force string
      })).filter(t => !existingIds.has(t.id));

      return [...validNewTransactions, ...prev];
    });
  }, []);

  return (
    <AppContext.Provider value={{
      theme, setTheme,
      language, setLanguage, t, isRTL,
      transactions, addTransaction, editTransaction, deleteTransaction, importTransactions
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
