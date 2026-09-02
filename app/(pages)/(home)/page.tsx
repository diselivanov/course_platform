import { prisma } from '@/app/lib/prisma';
import { checkAdmin } from '@/app/lib/dal';
import CourseCard from '@/app/components/CourseCard';
import LinkButton from '@/app/components/LinkButton';
import { Metadata } from 'next';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Курсы',
};

export default async function HomePage() {
  const isAdmin = await checkAdmin();

  const courses = await prisma.course.findMany({
    orderBy: { number: 'asc' },
    include: {
      lessons: {
        select: { id: true },
      },
    },
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Курсы</h1>
        {isAdmin && <LinkButton href="/course/create">Создать курс</LinkButton>}
      </div>

      {courses.length === 0 ? (
        <div className={styles.empty}>Курсы пока не добавлены</div>
      ) : (
        <div className={styles.grid}>
          {courses.map(course => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              slug={course.slug}
              shortDescription={course.shortDescription}
              lessonsCount={course.lessons.length}
            />
          ))}
        </div>
      )}
    </div>
  );
}
