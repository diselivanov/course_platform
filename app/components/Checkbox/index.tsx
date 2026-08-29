'use client';

import Icon from '../Icon';
import styles from './index.module.scss';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: number;
  disabled?: boolean;
}

export default function Checkbox({ checked, onChange, size = 20, disabled = false }: CheckboxProps) {
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <button
      className={`${styles.checkbox} ${checked ? styles.checked : ''} ${disabled ? styles.disabled : ''}`}
      onClick={handleClick}
      type="button"
      aria-checked={checked}
      role="checkbox"
      disabled={disabled}
      style={{ width: size, height: size }}
    >
      {checked && <Icon name="check_mark" size={size * 0.6} />}
    </button>
  );
}
