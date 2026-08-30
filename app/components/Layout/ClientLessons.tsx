'use client';

import Link from 'next/link';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './index.module.scss';

interface ClientLessonsProps {
  courseSlug: string;
  lessons: {
    id: string;
    number: number;
    title: string;
    slug: string;
  }[];
}

export default function ClientLessons({ courseSlug, lessons }: ClientLessonsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lessonSlug = searchParams.get('lesson');

  useEffect(() => {
    router.refresh();
  }, [pathname]);

  return (
    <>
      {lessons.map(lesson => {
        const isActive = lessonSlug === lesson.slug;
        return (
          <div key={lesson.id} className={styles.linkWrapper}>
            <Link
              href={`/course/${courseSlug}?lesson=${lesson.slug}`}
              className={`${styles.link} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.linkText}>
                {lesson.number}. {lesson.title}
              </span>
            </Link>
          </div>
        );
      })}
    </>
  );
}
