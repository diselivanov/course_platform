import { AlertProvider } from '../Alert';
import { checkAuth, getUser } from '@/app/lib/dal';
import LinkButton from '../LinkButton';
import Link from 'next/link';
import styles from './index.module.scss';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const isAuth = await checkAuth();
  const user = await getUser();

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>Wincode</div>
        <nav className={styles.nav}>
          <Link href="/" className={styles.link}>
            Главная
          </Link>
          {isAuth && user && (
            <>
              <Link href="/profile" className={styles.link}>
                Профиль
              </Link>
            </>
          )}
          {!isAuth && (
            <LinkButton variant="secondary" size="small" href="/sign-in">
              Войти
            </LinkButton>
          )}
        </nav>
      </aside>
      <main className={styles.main}>
        <AlertProvider>{children}</AlertProvider>
      </main>
    </div>
  );
}
