import Link from 'next/link';
import { AnchorHTMLAttributes, ReactNode } from 'react';
import styles from './index.module.scss';

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  href: string;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary';
  rounded?: 'default' | 'full';
}

export default function LinkButton({
  children,
  href,
  fullWidth,
  variant = 'primary',

  rounded = 'default',
  className,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={`${styles.button} ${styles[variant]}${
        fullWidth ? styles.fullWidth : ''
      } ${styles[`rounded-${rounded}`]} ${className || ''}`}
      {...props}
    >
      {children}
    </Link>
  );
}
