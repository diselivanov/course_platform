'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import Icon from '../Icon';
import styles from './index.module.scss';

type AlertType = 'error' | 'success' | 'info';

interface AlertItem {
  id: string;
  type: AlertType;
  message: string;
}

interface AlertContextValue {
  showAlert: (type: AlertType, message: string) => void;
}

const AlertContext = createContext<AlertContextValue | null>(null);

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  return context;
}

interface AlertProviderProps {
  children: ReactNode;
}

const ICON_MAP: Record<AlertType, ReactNode> = {
  error: <Icon name="cross" size={18} />,
  success: <Icon name="check_mark" size={20} />,
  info: null,
};

export function AlertProvider({ children }: AlertProviderProps) {
  const [alert, setAlert] = useState<AlertItem | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearAlert = useCallback(() => {
    setIsExiting(true);
    setIsVisible(false);
    timeoutRef.current = setTimeout(() => {
      setAlert(null);
      setIsExiting(false);
    }, 300);
  }, []);

  const showAlert = useCallback(
    (type: AlertType, message: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Сначала скрываем текущий алерт
      if (alert) {
        setIsExiting(true);
        setIsVisible(false);
        setTimeout(() => {
          setAlert({ id: Date.now().toString(), type, message });
          setIsExiting(false);
          setIsVisible(true);

          timeoutRef.current = setTimeout(() => {
            clearAlert();
          }, 5000);
        }, 300);
        return;
      }

      setAlert({ id: Date.now().toString(), type, message });
      setIsVisible(true);
      setIsExiting(false);

      timeoutRef.current = setTimeout(() => {
        clearAlert();
      }, 5000);
    },
    [alert, clearAlert]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <div className={`${styles.container} ${isExiting ? styles.exiting : ''}`}>
          <div className={`${styles.alert} ${styles[alert.type]}`}>
            {ICON_MAP[alert.type] && <span className={styles.icon}>{ICON_MAP[alert.type]}</span>}
            <span className={styles.message}>{alert.message}</span>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}
