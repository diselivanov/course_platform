import Link from 'next/link';
import { AlertProvider } from '../Alert';
import { checkAuth, getUser } from '@/app/lib/dal';
import LinkButton from '../LinkButton';
import Avatar from '../Avatar';
import styles from './index.module.scss';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const isAuth = await checkAuth();
  const user = await getUser();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          Wincode
        </Link>

        <div className={styles.section}>
          {isAuth && user ? (
            <>
              <Link href="/profile">
                <Avatar name={user.name} size="s" />
              </Link>
            </>
          ) : (
            <LinkButton variant="secondary" size="small" href="/sign-in">
              Войти
            </LinkButton>
          )}
        </div>
      </header>
      <main className={styles.main}>
        <AlertProvider>{children}</AlertProvider>
      </main>
    </div>
  );
}
