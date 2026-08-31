'use client';

import Link from 'next/link';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useAlert } from '../Alert';
import styles from './index.module.scss';
import Icon from '../Icon';

interface ClientLayoutProps {
  isAuth: boolean;
}

interface Lesson {
  id: string;
  number: number;
  title: string;
  slug: string;
}

export default function ClientLayout({ isAuth }: ClientLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showAlert } = useAlert();
  const lessonSlug = searchParams.get('lesson');

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseSlug, setCourseSlug] = useState<string | null>(null);

  const showAlertRef = useRef(showAlert);
  useEffect(() => {
    showAlertRef.current = showAlert;
  }, [showAlert]);

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

  if (!isCoursePage) {
    return null;
  }

  const completedCount = completedIds.length;
  const totalCount = lessons.length;

  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>
        {totalCount > 0 && (
          <span className={styles.sectionCourse}>
            КУРС 🎓
            <span className={styles.progressCounter}>
              Уроков: {completedCount} из {totalCount}
            </span>
          </span>
        )}
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
  );
}
