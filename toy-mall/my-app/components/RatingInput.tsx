import { useState } from 'react';
import Rating from '@/components/Rating';
import '@/styles/RatingInput.module.css';

interface RatingInputProps {
  name: string;
  value: number;
  onChange: (name: string, value: number) => void;
}

const RatingInput: React.FC<RatingInputProps> = ({ name, value, onChange }) => {
  const [rating, setRating] = useState<number>(value);

  const handleSelect = (nextValue: number) => {
    onChange(name, nextValue);
  };

  const handleMouseOut = () => {
    setRating(value);
  };
  return (
    <Rating
      className="RatingInput"
      value={rating}
      onSelect={handleSelect}
      onHover={setRating}
      onMouseOut={handleMouseOut}
    />
  );
}

export default RatingInput;
