import { ButtonHTMLAttributes, ReactNode } from 'react';
import Loader from '@/app/components/Loader';
import styles from './index.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'small';
  loading?: boolean;
}

export default function Button({
  children,
  fullWidth,
  variant = 'primary',
  size = 'default',
  loading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${
        fullWidth ? styles.fullWidth : ''
      } ${className || ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader variant="button" /> : children}
    </button>
  );
}
