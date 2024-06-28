import { useEffect, useState, useRef, ChangeEvent } from 'react';
import arrowImg from '@/public/arrow.svg';
import styles from '@/styles/Dropdown.module.css';

interface Option {
  value: string;
  label: string;
}

interface Props {
  className: string;
  name: string;
  value: string;
  options: Option[];
  onChange: (name: string, value: string) => void;
}

export default function Dropdown({
  className,
  name,
  value,
  options,
  onChange,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  function handleInputClick() {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  }

  function handleBlur() {
    setIsOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    window.addEventListener('click', handleClickOutside as EventListener);
    return () => {
      window.removeEventListener('click', handleClickOutside as EventListener);
    };
  }, []);

  const classNames = `${styles.input} ${
    isOpen ? styles.opened : ''
  } ${className}`;
  const selectedOption = options.find((option) => option.value === value);

  return (
    <div
      className={classNames}
      onClick={handleInputClick}
      onBlur={handleBlur}
      ref={inputRef}
    >
      {selectedOption?.label}
      <img
        className={styles.arrow}
        src={arrowImg.src}
        width={12}
        height={9}
        alt="▲"
      />
      {isOpen && (
        <div className={styles.options}>
          {options.map((option) => {
            const selected = value === option.value;
            const optionClassName = `${styles.option} ${
              selected ? styles.selected : ''
            }`;
            return (
              <div
                className={optionClassName}
                key={option.value}
                onClick={() => onChange(name, option.value)}
              >
                {option.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
