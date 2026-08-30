'use client';

import { useState, createContext, useContext, ReactNode } from 'react';
import { DiffModeEnum } from '@git-diff-view/react';
import styles from './page.module.scss';

const DiffViewModeContext = createContext<{
  viewMode: DiffModeEnum;
  setViewMode: (mode: DiffModeEnum) => void;
}>({
  viewMode: DiffModeEnum.Split,
  setViewMode: () => {},
});

export function DiffViewModeProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<DiffModeEnum>(DiffModeEnum.Split);
  return (
    <DiffViewModeContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </DiffViewModeContext.Provider>
  );
}

export function useDiffViewMode() {
  return useContext(DiffViewModeContext);
}

export default function DiffViewControls() {
  const { viewMode, setViewMode } = useDiffViewMode();

  return (
    <div className={styles.viewControls}>
      <button
        className={`${styles.viewButton} ${viewMode === DiffModeEnum.Split ? styles.active : ''}`}
        onClick={() => setViewMode(DiffModeEnum.Split)}
      >
        Split
      </button>
      <button
        className={`${styles.viewButton} ${viewMode === DiffModeEnum.Unified ? styles.active : ''}`}
        onClick={() => setViewMode(DiffModeEnum.Unified)}
      >
        Unified
      </button>
    </div>
  );
}
