import { useState } from 'react';
import Rating from '@/components/Rating';
import '@/styles/RatingInput.module.css';

interface RatingInputProps {
  name: string;
  value: number;
  onChange: (name: string, value: number) => void;
}

const RatingInput = ({ name, value, onChange }: RatingInputProps) => {
  const [rating, setRating] = useState<number>(value);

  const handleSelect = (nextValue: number) => {
    console.log('test'); 
    onChange(name, nextValue);
  };

  const handleMouseOut = () => {
    setRating(value);
  };
  return (
    <Rating
      className="RatingInput"
      value={rating}
    />
  );
}

export default RatingInput;
