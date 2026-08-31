import LinkButton from '../LinkButton';
import Icon from '../Icon';
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
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{shortDescription}</p>
      <div className={styles.footer}>
        <span className={styles.lessonsCount}>Уроков: {lessonsCount}</span>
        <LinkButton href={`/course/${slug}`}>
          Перейти <Icon name="arrow_right" size={14} />
        </LinkButton>
      </div>
    </div>
  );
}
