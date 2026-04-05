import { ActionIcon, Select, TextInput } from '@mantine/core';
import { IconLayoutGrid, IconList, IconSearch } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import clsx from 'clsx';

import { useListingsStore } from '../../model/listings-store';
import { LISTING_SORT_OPTIONS } from '../../model/listings.constants';
import type { ListingSortOptionValue, ListingViewMode } from '../../model/listings.types';

import styles from './listings-toolbar.module.scss';

// const sortOptions = [
//   { value: 'newest', label: 'По новизне (сначала новые)' },
//   { value: 'oldest', label: 'По новизне (сначала старые)' },
//   { value: 'price-desc', label: 'Сначала дороже' },
//   { value: 'price-asc', label: 'Сначала дешевле' },
// ];

const viewModes: { value: ListingViewMode; icon: ReactNode; label: string }[] = [
  {
    value: 'grid',
    icon: <IconLayoutGrid size={25} stroke={1.8} />,
    label: 'Показать плиткой',
  },
  {
    value: 'list',
    icon: <IconList size={25} stroke={1.8} />,
    label: 'Показать списком',
  },
];

const ListingsToolbar = () => {
  const viewMode = useListingsStore((state) => state.viewMode);
  const search = useListingsStore((state) => state.search);
  const sortColumn = useListingsStore((state) => state.sortColumn);
  const sortDirection = useListingsStore((state) => state.sortDirection);
  const setViewMode = useListingsStore((state) => state.setViewMode);
  const setSearch = useListingsStore((state) => state.setSearch);
  const setSorting = useListingsStore((state) => state.setSorting);

  const sortValue = `${sortColumn}-${sortDirection}` as ListingSortOptionValue;

  return (
    <div className={styles.toolbar}>
      <div className={styles.search}>
        <TextInput
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          classNames={{
            root: styles.searchRoot,
          }}
          rightSectionWidth={44}
          radius="md"
          placeholder="Найти объявление...."
          rightSection={<IconSearch size={20} stroke={1.8} color="#2f2f35" />}
        />
      </div>

      <div className={styles.controls}>
        <div className={styles.viewSwitcher} aria-label="Переключение режима отображения">
          {viewModes.map((mode) => (
            <ActionIcon
              key={mode.value}
              variant="subtle"
              color="var(--text-secondary)"
              size={25}
              radius="xs"
              aria-label={mode.label}
              onClick={() => setViewMode(mode.value)}
              data-active={viewMode === mode.value || undefined}
              className={clsx(styles.viewButton)}
            >
              {mode.icon}
            </ActionIcon>
          ))}
        </div>

        <Select
          value={sortValue}
          classNames={{
            root: styles.selectRoot,
            input: styles.selectInput,
            dropdown: styles.selectDropdown,
            option: styles.selectOption,
          }}
          styles={{
            input: {
              height: '42px',
              fontSize: '16px',
            },
          }}
          defaultValue="newest"
          data={LISTING_SORT_OPTIONS}
          checkIconPosition="right"
          onChange={(value) => {
            if (!value) return;

            const [column, direction] = value.split('-');

            setSorting(column as 'title' | 'createdAt', direction as 'asc' | 'desc');
          }}
          allowDeselect={false}
        />
      </div>
    </div>
  );
};

export default ListingsToolbar;
