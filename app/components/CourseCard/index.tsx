import LinkButton from '../LinkButton';
import styles from './index.module.scss';

interface CourseCardProps {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  lessonsCount: number;
}

export default function CourseCard({
  title,
  slug,
  shortDescription,
  lessonsCount,
}: CourseCardProps) {
  const getLessonsText = (count: number) => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'уроков';
    if (lastDigit === 1) return 'урок';
    if (lastDigit >= 2 && lastDigit <= 4) return 'урока';
    return 'уроков';
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{shortDescription}</p>
      <div className={styles.footer}>
        <span className={styles.lessonsCount}>
          {lessonsCount} {getLessonsText(lessonsCount)}
        </span>
        <LinkButton rounded="full" href={`/course/${slug}`}>
          Открыть
        </LinkButton>
      </div>
    </div>
  );
}
