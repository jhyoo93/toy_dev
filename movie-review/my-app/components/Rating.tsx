import styles from '@/styles/Rating.module.css';

interface RatingProps {
  value: number;
  className?: string;
}

const Rating = ({ value, className }: RatingProps) => {
  const stars = [];
  let filledStars;

  if (value <= 2) {
    filledStars = 1;
  } else if (value <= 5) {
    filledStars = 2;
  } else if (value <= 7) {
    filledStars = 3;
  } else if (value <= 9) {
    filledStars = 4;
  } else {
    filledStars = 5;
  }

  for (let i = 0; i < 5; i++) {
    stars.push(
      <span key={i} className={`${styles.star} ${i < filledStars ? styles.filledStar : ''}`}>
        ★
      </span>
    );
  }

  return <div className={`${styles.stars} ${className}`}>{stars}</div>;
};

export default Rating;
