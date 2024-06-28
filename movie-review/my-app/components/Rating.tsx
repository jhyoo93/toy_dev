import '@/styles/Rating.module.css';

interface StarProps {
  selected?: boolean;
  rating: number;
  onSelect?: (rating: number) => void;
  onHover?: (rating: number) => void;
}

const Star: React.FC<StarProps> = ({ selected = false, rating, onSelect, onHover }) => {
  const className = `Rating-star ${selected ? 'selected' : ''}`;

  const handleClick = onSelect ? () => onSelect(rating) : undefined;
  const handleMouseOver = onHover ? () => onHover(rating) : undefined;

  return (
    <span
      className={className}
      onClick={handleClick}
      onMouseOver={handleMouseOver}
      style={{ color: selected ? 'gold' : 'gray' }}
    >
      ★
    </span>
  );
};

interface RatingProps {
  value: number;
  className?: string;
}

const Rating: React.FC<RatingProps> = ({ value, className }) => {
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
