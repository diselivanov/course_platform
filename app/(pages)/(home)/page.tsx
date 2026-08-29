'use client';

import { useState } from 'react';
import { DiffView, DiffModeEnum } from '@git-diff-view/react';
import { generateDiffFile } from '@git-diff-view/file';
import '@git-diff-view/react/styles/diff-view.css';
import styles from './page.module.scss';

const oldCode = `import { useState } from 'react';

export default function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Hello World</h1>
      <p>Count: {count}</p>
    </div>
  );
}`;

const newCode = `import { useState, useEffect } from 'react';

export default function HomePage() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <div className="container">
      <h1>Hello World!</h1>
      <p>Count: {count}</p>
      {loading && <p>Loading...</p>}
    </div>
  );
}`;

export default function HomePage() {
  const [mode, setMode] = useState<DiffModeEnum>(DiffModeEnum.Split);

  const diffFile = generateDiffFile(
    'old.tsx',
    oldCode,
    'new.tsx',
    newCode,
    'typescript',
    'typescript'
  );

  diffFile.initTheme('light');
  diffFile.init();
  diffFile.buildSplitDiffLines();

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <button
          onClick={() => setMode(DiffModeEnum.Split)}
          className={mode === DiffModeEnum.Split ? styles.active : ''}
        >
          Split
        </button>
        <button
          onClick={() => setMode(DiffModeEnum.Unified)}
          className={mode === DiffModeEnum.Unified ? styles.active : ''}
        >
          Unified
        </button>
      </div>
      <div className={styles.diffWrapper}>
        <DiffView diffFile={diffFile} diffViewMode={mode} diffViewTheme="light" diffViewHighlight />
      </div>
    </div>
  );
}
