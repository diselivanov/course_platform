import { TextareaHTMLAttributes, forwardRef } from 'react';
import styles from './index.module.scss';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className={styles.wrapper}>
        {label && <label className={styles.label}>{label}</label>}
        <textarea
          ref={ref}
          className={`${styles.textarea} ${error ? styles.error : ''} ${className || ''}`}
          onChange={handleChange}
          {...props}
        />
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
