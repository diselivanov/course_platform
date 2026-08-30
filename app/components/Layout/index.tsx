import { AlertProvider } from '../Alert';
import { checkAuth, getUser } from '@/app/lib/dal';
import Link from 'next/link';
import { headers } from 'next/headers';
import { prisma } from '@/app/lib/prisma';
import styles from './index.module.scss';
import ClientLessons from './ClientLessons';
import ClientLayout from './ClientLayout';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const isAuth = await checkAuth();
  const user = await getUser();

  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  const courseMatch = pathname.match(/^\/course\/([^\/]+)/);
  const courseSlug = courseMatch ? courseMatch[1] : null;

  const isCoursePage = pathname.startsWith('/course/');

  let course: {
    id: string;
    slug: string;
    title: string;
    lessons: {
      id: string;
      number: number;
      title: string;
      slug: string;
    }[];
  } | null = null;

  if (courseSlug) {
    course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      include: {
        lessons: {
          orderBy: { number: 'asc' },
          select: {
            id: true,
            number: true,
            title: true,
            slug: true,
          },
        },
      },
    });
  }

  const lessons = course?.lessons || [];

  return (
    <ClientLayout>
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <div className={styles.logo}>
            <Link href="/">Wincode</Link>
          </div>
          <nav className={styles.nav}>
            {isCoursePage && course ? (
              <ClientLessons key={courseSlug} courseSlug={course.slug} lessons={lessons} />
            ) : (
              <>
                <Link href="/" className={styles.navLink}>
                  <span className={styles.linkText}>Главная</span>
                </Link>
                {isAuth && user && (
                  <>
                    <Link href="/profile" className={styles.navLink}>
                      <span className={styles.linkText}>Профиль</span>
                    </Link>
                  </>
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
              </>
            )}
          </nav>
        </aside>
        <main className={styles.main}>
          <AlertProvider>{children}</AlertProvider>
        </main>
      </div>
    </ClientLayout>
  );
}
