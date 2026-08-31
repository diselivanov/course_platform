import Link from 'next/link';
import { AnchorHTMLAttributes, ReactNode } from 'react';
import styles from './index.module.scss';

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  href: string;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'small';
}

export default function LinkButton({
  children,
  href,
  fullWidth,
  variant = 'primary',
  size = 'default',
  className,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${
        fullWidth ? styles.fullWidth : ''
      } ${className || ''}`}
      {...props}
    >
      {children}
    </Link>
  );
}
