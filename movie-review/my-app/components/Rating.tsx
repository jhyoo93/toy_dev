import '@/styles/Rating.module.css';

interface RatingProps {
  value: number;
  className?: string;
}

const Rating = ({ value, className }: RatingProps) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <span key={i} className={className} style={{ color: i < value ? '#7fff00' : 'gray' }}>
        ★
      </span>
    );
  }
  return <div>{stars}</div>;
};

export default Rating;
