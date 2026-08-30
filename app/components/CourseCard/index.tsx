import Link from 'next/link';
import styles from './index.module.scss';

interface CourseCardProps {
  id: string;
  number: number;
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
  return (
    <Link href={`/course/${slug}`} className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{shortDescription}</p>
      <div className={styles.footer}>
        <span className={styles.lessonsCount}>Уроков: {lessonsCount}</span>
      </div>
      <svg className={styles.glowContainer}>
        <rect pathLength="100" strokeLinecap="round" className={styles.glowBlur} />
        <rect pathLength="100" strokeLinecap="round" className={styles.glowLine} />
      </svg>
    </Link>
  );
}
