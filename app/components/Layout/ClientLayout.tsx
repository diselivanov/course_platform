'use client';

import Link from 'next/link';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useAlert } from '../Alert';
import styles from './index.module.scss';
import Icon from '../Icon';
import ThemeToggle from '../ThemeToggle';
import Search from '../Search';

interface ClientLayoutProps {
  isAuth: boolean;
  children: React.ReactNode;
}

interface Lesson {
  id: string;
  number: number;
  title: string;
  slug: string;
}

export default function ClientLayout({ isAuth, children }: ClientLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showAlert } = useAlert();
  const lessonSlug = searchParams.get('lesson');

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseSlug, setCourseSlug] = useState<string | null>(null);

  const showAlertRef = useRef(showAlert);
  useEffect(() => {
    showAlertRef.current = showAlert;
  }, [showAlert]);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) {
      setIsSidebarCollapsed(saved === 'true');
    }
  }, []);

  const loadData = async (slug: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/course/${slug}/lessons-with-progress`);
      const result = await response.json();
      if (result.success) {
        setLessons(result.data.lessons || []);
        setCompletedIds(result.data.completedIds || []);
      } else {
        setLessons([]);
        setCompletedIds([]);
      }
    } catch {
      showAlertRef.current('error', 'Ошибка загрузки уроков');
      setLessons([]);
      setCompletedIds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const match = pathname.match(/^\/course\/([^\/]+)/);
    const slug = match ? match[1] : null;
    setCourseSlug(slug);

    if (slug) {
      router.refresh();
      loadData(slug);
    } else {
      setLessons([]);
      setCompletedIds([]);
      setLoading(false);
    }
  }, [pathname]);

  const toggleProgress = async (lessonId: string, currentCompleted: boolean) => {
    if (!isAuth) return;

    const newCompleted = !currentCompleted;

    setCompletedIds(prev =>
      newCompleted ? [...prev, lessonId] : prev.filter(id => id !== lessonId)
    );

    try {
      const url = `/api/progress/lesson/${lessonId}`;
      const response = await fetch(url, {
        method: newCompleted ? 'POST' : 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        showAlertRef.current('error', result.error || 'Ошибка');
        setCompletedIds(prev =>
          currentCompleted ? [...prev, lessonId] : prev.filter(id => id !== lessonId)
        );
      }
    } catch {
      showAlertRef.current('error', 'Ошибка соединения с сервером');
      setCompletedIds(prev =>
        currentCompleted ? [...prev, lessonId] : prev.filter(id => id !== lessonId)
      );
    }
  };

  const isCoursePage = pathname.startsWith('/course/');

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const newState = !prev;
      localStorage.setItem('sidebarCollapsed', String(newState));
      return newState;
    });
  };

  return (
    <>
      <aside className={`${styles.sidebar} ${isSidebarCollapsed ? styles.collapsed : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <Link href="/">
              <span className={styles.win}>Win</span>
              <span className={styles.code}>code</span>
            </Link>
          </div>

          <div className={styles.navActions}>
            <button className={styles.toggleButton} onClick={toggleSidebar}>
              <Icon name="sidebar" size={14} />
            </button>
            <Search />
            <ThemeToggle />
          </div>
        </div>

        <nav className={styles.nav}>
          {isCoursePage && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
                {lessons.length > 0 && <span className={styles.sectionCourse}>КУРС</span>}
              </div>
              {lessons.map(lesson => {
                const isActive = lessonSlug === lesson.slug;
                const isCompleted = completedIds.includes(lesson.id);

                return (
                  <div key={lesson.id} className={styles.linkWrapper}>
                    <Link
                      href={`/course/${courseSlug}?lesson=${lesson.slug}`}
                      className={`${styles.link} ${isActive ? styles.active : ''}`}
                    >
                      <span className={styles.linkText}>
                        {lesson.number}. {lesson.title}
                      </span>
                      {isAuth && (
                        <button
                          className={`${styles.checkbox} ${isCompleted ? styles.completed : ''}`}
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleProgress(lesson.id, isCompleted);
                          }}
                        >
                          <div className={styles.checkboxInner}>
                            {isCompleted ? <Icon name="check_mark" size={13} /> : null}
                          </div>
                        </button>
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
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
      {isMounted && isSidebarCollapsed && (
        <div className={styles.floatingNavActions}>
          <button className={styles.toggleButton} onClick={toggleSidebar}>
            <Icon name="sidebar" size={14} />
          </button>
          <Search />
          <ThemeToggle />
        </div>
      )}
      <main className={styles.main}>
        <div className={styles.mainContent}>{children}</div>
        <footer className={styles.footer}>© 2026 Wincode</footer>
      </main>
    </>
  );
}
