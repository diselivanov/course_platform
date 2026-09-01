import { AlertProvider } from '../Alert';
import { ThemeProvider } from '../ThemeToggle';
import { checkAuth, getUser } from '@/app/lib/dal';
import Link from 'next/link';
import ThemeToggle from '../ThemeToggle';
import Avatar from '../Avatar';
import styles from './index.module.scss';
import ClientLayout from './ClientLayout';
import LinkButton from '../LinkButton';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const isAuth = await checkAuth();
  const user = isAuth ? await getUser() : null;

  return (
    <ThemeProvider>
      <AlertProvider>
        <div className={styles.container}>
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <Link href="/" className={styles.logo}>
                Wincode
              </Link>
            </div>
            <div className={styles.headerRight}>
              <ThemeToggle />
              {isAuth && user && <Avatar name={user.name} />}
              {!isAuth && (
                <LinkButton href={`/sign-in`} variant="secondary">
                  Войти
                </LinkButton>
              )}
            </div>
          </header>
          <ClientLayout isAuth={isAuth}>{children}</ClientLayout>
        </div>
      </AlertProvider>
    </ThemeProvider>
  );
}
