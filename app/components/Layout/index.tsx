import { AlertProvider } from '../Alert';
import { checkAuth, getUser } from '@/app/lib/dal';
import Link from 'next/link';
import styles from './index.module.scss';
import ClientLayout from './ClientLayout';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const isAuth = await checkAuth();
  const user = await getUser();

  return (
    <AlertProvider>
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <div className={styles.logo}>
            <Link href="/">
              <span className={styles.win}>Win</span>
              <span className={styles.code}>code</span>
            </Link>
          </div>
          <nav className={styles.nav}>
            <ClientLayout isAuth={isAuth} />
            <div className={styles.section}>
              <div className={styles.sectionTitle}>МЕНЮ</div>
              <Link href="/" className={styles.navLink}>
                <span className={styles.linkText}>Главная</span>
              </Link>
              {isAuth && (
                <Link href="/profile" className={styles.navLink}>
                  <span className={styles.linkText}>Профиль</span>
                </Link>
              )}
              {!isAuth && (
                <>
                  <Link href="/sign-in" className={styles.navLink}>
                    <span className={styles.linkText}>Войти</span>
                  </Link>
                  <Link href="/sign-up" className={styles.navLink}>
                    <span className={styles.linkText}>Регистрация</span>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </aside>
        <main className={styles.main}>{children}</main>
      </div>
    </AlertProvider>
  );
}
