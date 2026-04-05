import { Button, Checkbox, Switch } from '@mantine/core';

import { LISTING_CATEGORY_OPTIONS } from '../../model/listings.constants';
import { useListingsStore } from '../../model/listings-store';

import styles from './listings-filters.module.scss';

const ListingsFilters = () => {
  const selectedCategories = useListingsStore((state) => state.selectedCategories);
  const needsRevision = useListingsStore((state) => state.needsRevision);
  const toggleCategory = useListingsStore((state) => state.toggleCategory);
  const setNeedsRevision = useListingsStore((state) => state.setNeedsRevision);
  const resetFilters = useListingsStore((state) => state.resetFilters);

  return (
    <>
      <div className={styles.filters}>
        <div className={styles.header}>
          <h2 className={styles.title}>Фильтры</h2>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionTitle}>Категория</p>

          <div className={styles.categories}>
            {LISTING_CATEGORY_OPTIONS.map((category) => (
              <Checkbox
                key={category.value}
                checked={selectedCategories.includes(category.value)}
                label={category.label}
                classNames={{
                  root: styles.checkboxRoot,
                  body: styles.checkboxBody,
                  labelWrapper: styles.checkboxLabelWrapper,
                  label: styles.checkboxLabel,
                  input: styles.checkboxInput,
                  icon: styles.checkboxIcon,
                }}
                onChange={() => toggleCategory(category.value)}
              />
            ))}
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.section}>
          <Switch
            size="md"
            checked={needsRevision}
            label="Только требующие доработок"
            classNames={{
              root: styles.switchRoot,
              body: styles.switchBody,
              labelWrapper: styles.switchLabelWrapper,
              label: styles.switchLabel,
            }}
            onChange={(event) => setNeedsRevision(event.currentTarget.checked)}
          />
        </div>
      </div>
      <div className={styles.btnWrapper}>
        <Button variant="subtle" onClick={resetFilters} className={styles.resetButton}>
          Сбросить фильтры
        </Button>
      </div>
    </>
  );
};

export default ListingsFilters;
