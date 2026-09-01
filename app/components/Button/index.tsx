import { ButtonHTMLAttributes, ReactNode } from 'react';
import Loader from '@/app/components/Loader';
import styles from './index.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

export default function Button({
  children,
  fullWidth,
  variant = 'primary',
  loading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${
        fullWidth ? styles.fullWidth : ''
      } ${className || ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader variant="button" /> : children}
    </button>
  );
}
