import { TextareaHTMLAttributes, forwardRef, useEffect, useRef } from 'react';
import styles from './index.module.scss';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxLength?: number;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, value, onChange, maxLength, ...props }, ref) => {
    const innerRef = useRef<HTMLTextAreaElement>(null);

    const setRefs = (element: HTMLTextAreaElement | null) => {
      innerRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    const getLineCount = (text: string) => {
      return text.split('\n').length;
    };

    const getMaxHeight = () => {
      const textarea = innerRef.current;
      if (!textarea) return 200;
      const style = window.getComputedStyle(textarea);
      const lineHeight =
        parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.4;
      return lineHeight * 20;
    };

    const autoResize = () => {
      const textarea = innerRef.current;
      if (textarea) {
        textarea.style.height = '80px';
        const scrollHeight = textarea.scrollHeight;
        const maxHeight = getMaxHeight();
        textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
        textarea.style.overflowY = 'hidden';
      }
    };

    useEffect(() => {
      autoResize();
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;

      if (maxLength && newValue.length > maxLength) {
        return;
      }

      if (getLineCount(newValue) > 20) {
        return;
      }

      onChange?.(e);
      autoResize();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter') {
        const currentValue = e.currentTarget.value;
        if (getLineCount(currentValue) >= 20) {
          e.preventDefault();
          return;
        }
      }
    };

    return (
      <div className={styles.wrapper}>
        {label && <label className={styles.label}>{label}</label>}
        <textarea
          ref={setRefs}
          className={`${styles.textarea} ${error ? styles.error : ''} ${className || ''}`}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          {...props}
        />
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
