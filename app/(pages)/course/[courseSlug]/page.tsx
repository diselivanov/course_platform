import { prisma } from '@/app/lib/prisma';
import { checkAdmin } from '@/app/lib/dal';
import LinkButton from '@/app/components/LinkButton';
import VideoPlayer from '@/app/components/VideoPlayer';
import DiffView from '@/app/components/DiffView';
import { DiffViewModeProvider } from './DiffViewControls';
import DiffViewControls from './DiffViewControls';
import Link from 'next/link';
import styles from './page.module.scss';
import { notFound } from 'next/navigation';

interface CoursePageProps {
  params: Promise<{ courseSlug: string }>;
  searchParams: Promise<{ lesson?: string }>;
}

export default async function CoursePage({ params, searchParams }: CoursePageProps) {
  const { courseSlug } = await params;
  const { lesson: lessonSlug } = await searchParams;

  const isAdmin = await checkAdmin();

  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      lessons: {
        orderBy: { number: 'asc' },
        include: {
          files: {
            orderBy: { number: 'asc' },
          },
        },
      },
    },
  });

  if (!course) {
    return notFound();
  }

  const selectedLesson = lessonSlug ? course.lessons.find(l => l.slug === lessonSlug) : null;

  return (
    <DiffViewModeProvider>
      <div className={styles.container}>
        {isAdmin && !selectedLesson && (
          <div className={styles.adminActions}>
            <LinkButton href={`/course/${courseSlug}/edit`}>Править курс</LinkButton>
            <LinkButton href={`/course/${courseSlug}/lesson/create`}>Создать урок</LinkButton>
          </div>
        )}

        {isAdmin && selectedLesson && (
          <div className={styles.adminActions}>
            <LinkButton href={`/course/${courseSlug}/lesson/${selectedLesson.slug}/edit`}>
              Править урок
            </LinkButton>
            <LinkButton href={`/course/${courseSlug}/lesson/${selectedLesson.slug}/file/create`}>
              Создать файл
            </LinkButton>
          </div>
        )}

        {!selectedLesson ? (
          <>
            <h1 className={styles.title}>Курс: {course.title}</h1>

            <VideoPlayer youtubeUrl={course.youtubeUrl} vkUrl={course.vkUrl} />

            <div
              className={styles.htmlContent}
              dangerouslySetInnerHTML={{ __html: course.fullDescription }}
            />
          </>
        ) : (
          <>
            <div className={styles.lessonHeader}>
              <h1 className={styles.lessonTitle}>
                Урок {selectedLesson.number}: {selectedLesson.title}
              </h1>
              <Link href={`/course/${courseSlug}`} className={styles.courseLink}>
                Курс: {course.title}
              </Link>
            </div>

            <VideoPlayer youtubeUrl={selectedLesson.youtubeUrl} vkUrl={selectedLesson.vkUrl} />

            {selectedLesson.description && (
              <div className={styles.section}>
                <div
                  className={styles.htmlContent}
                  dangerouslySetInnerHTML={{ __html: selectedLesson.description }}
                />
              </div>
            )}

            {selectedLesson.files.length > 0 && (
              <div className={styles.section}>
                <div className={styles.filesHeader}>
                  <h2>Файлы</h2>
                  <DiffViewControls />
                </div>
                <div className={styles.files}>
                  {selectedLesson.files.map(file => (
                    <DiffView
                      key={file.id}
                      id={file.id}
                      number={file.number}
                      title={file.title}
                      status={file.status}
                      oldCode={file.oldCode || ''}
                      newCode={file.newCode || ''}
                      courseSlug={courseSlug}
                      lessonSlug={selectedLesson.slug}
                      isAdmin={isAdmin}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DiffViewModeProvider>
  );
}
