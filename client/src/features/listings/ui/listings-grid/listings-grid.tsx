import ListingCard, { type ListingCardItem } from '../listing-card/listing-card';
import styles from './listings-grid.module.scss';

type ListingsGridProps = {
  listings: ListingCardItem[];
};

const ListingsGrid = ({ listings }: ListingsGridProps) => {
  return (
    <div className={styles.grid}>
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} variant="grid" />
      ))}
    </div>
  );
};

export default ListingsGrid;
