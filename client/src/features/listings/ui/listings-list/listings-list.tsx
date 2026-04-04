import ListingCard, { type ListingCardItem } from '../listing-card/listing-card';
import styles from './listings-list.module.scss';

type ListingsListProps = {
  listings: ListingCardItem[];
};

const ListingsList = ({ listings }: ListingsListProps) => {
  return (
    <div className={styles.list}>
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} variant="list" />
      ))}
    </div>
  );
};

export default ListingsList;
