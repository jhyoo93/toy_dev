import { useState, useTransition } from "react";
import styles from '../styles/MovieList.module.css';
import Link from 'next/link';
import Image from 'next/image';
import Rating from "./Rating";
import { Review } from "@/types/Review";

interface MovieListItemProps {
    item: Review;
  }

  const MovieListItem = ({ item }: MovieListItemProps) => {
    return (
      <li className={styles.movieListItem} key={item.id}>
        <Link href={`/films/${item.id}`}>
          <div className={styles.posterContainer}>
            <Image fill src={item.imgUrl} alt={item.title} objectFit="cover"/>
          </div>
        </Link>
        <div className={styles.info}>
          <h2 className={styles.title}>제목 : {item.title}</h2>
          <div className={styles.starRatingContainer}>
            별점 : <Rating value={item.rating} />
          </div>
        </div>
      </li>
    );
};
export default MovieListItem;