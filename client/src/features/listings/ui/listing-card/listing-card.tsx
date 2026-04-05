import { Badge } from '@mantine/core';
import { Link } from 'react-router-dom';
import listingPlaceholder from '../../../../assets/card_placeHolder.png';
import clsx from 'clsx';

import styles from './listing-card.module.scss';

export type ListingCardItem = {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  needsRevision: boolean;
};

export type ListingCardVariant = 'grid' | 'list';

type ListingCardProps = {
  listing: ListingCardItem;
  variant?: ListingCardVariant;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU').format(price);
};

const ListingCard = ({ listing, variant = 'grid' }: ListingCardProps) => {
  const { id, title, price, category, image, needsRevision } = listing;

  return (
    <Link to={`/ads/${id}`} className={styles.link}>
      <article
        className={clsx(styles.card, {
          [styles.cardGrid]: variant === 'grid',
          [styles.cardList]: variant === 'list',
        })}
      >
        <div className={styles.imageWrapper}>
          <img
            className={styles.image}
            src={image || listingPlaceholder}
            alt={title || 'Изображение объявления'}
          />
        </div>

        <div className={styles.content}>
          <div className={styles.meta}>
            <p className={styles.category}>{category}</p>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.price}>{formatPrice(price)} ₽</p>
          </div>

          {needsRevision && (
            <Badge
              className={styles.badge}
              styles={{
                root: {
                  padding: '10px 10px',
                  backgroundColor: 'var(--bg-bage)',
                },
                label: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textTransform: 'none',
                  fontSize: '13px',
                  fontWeight: 400,
                },
              }}
              radius="xs"
            >
              <span className={styles.badge__dot}></span>
              <span className={styles.badge__text}>Требует доработок</span>
            </Badge>
          )}
        </div>
      </article>
    </Link>
  );
};

export default ListingCard;
