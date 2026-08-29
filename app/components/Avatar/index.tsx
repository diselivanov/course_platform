'use client';

import styles from './index.module.scss';

interface AvatarProps {
  name: string;
  size?: 's' | 'm' | 'l';
}

export default function Avatar({ name, size = 'm' }: AvatarProps) {
  const firstLetter = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <div className={`${styles.avatar} ${styles[size]} ${styles.placeholder}`}>
      <span className={styles.letter}>{firstLetter}</span>
    </div>
  );
}
