import styles from '@/styles/Rating.module.css';

interface RatingProps {
  value: number;
  className?: string;
}

const Rating = ({ value }: RatingProps) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <span key={i} className={i <= value ? styles.filledStar : styles.emptyStar}>
        ★
      </span>
    );
  }
  return <div className={styles.stars}>{stars}</div>;
};

export default Rating;
