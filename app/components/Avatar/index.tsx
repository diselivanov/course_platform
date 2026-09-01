'use client';

import Link from 'next/link';
import styles from './index.module.scss';

interface AvatarProps {
  name: string;
}

export default function Avatar({ name }: AvatarProps) {
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <Link href="/profile" className={styles.avatar}>
      {initial}
    </Link>
  );
}
