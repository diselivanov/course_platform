'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Icon from '../Icon';
import styles from './index.module.scss';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.setAttribute('data-theme', stored);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function ThemeToggleGroup() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.group}>
      <button
        className={`${styles.option} ${theme === 'light' ? styles.active : ''}`}
        onClick={() => {
          if (theme !== 'light') toggleTheme();
        }}
        aria-label="Light theme"
      >
        <Icon name="light_mode" size={16} />
      </button>
      <button
        className={`${styles.option} ${theme === 'dark' ? styles.active : ''}`}
        onClick={() => {
          if (theme !== 'dark') toggleTheme();
        }}
        aria-label="Dark theme"
      >
        <Icon name="dark_mode" size={16} />
      </button>
    </div>
  );
}

export default ThemeToggleGroup;
