import { AlertProvider } from '../Alert';
import { ThemeProvider } from '../ThemeToggle';
import { checkAuth } from '@/app/lib/dal';
import styles from './index.module.scss';
import ClientLayout from './ClientLayout';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const isAuth = await checkAuth();

  return (
    <ThemeProvider>
      <AlertProvider>
        <div className={styles.container}>
          <ClientLayout isAuth={isAuth}>{children}</ClientLayout>
        </div>
      </AlertProvider>
    </ThemeProvider>
  );
}
