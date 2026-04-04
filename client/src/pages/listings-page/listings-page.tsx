import { Loader, Pagination } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useQuery } from '@tanstack/react-query';
import { getErrorMessage } from '../../shared/lib/get-error-message';
import PageLayout from '../../shared/ui/page-layout/page-layout';
import ListingsToolbar from '../../features/listings/ui/listings-toolbar/listings-toolbar';
import ListingsFilters from '../../features/listings/ui/listings-filters/listings-filters';
import ListingsGrid from '../../features/listings/ui/listings-grid/listings-grid';
import ListingsList from '../../features/listings/ui/listings-list/listings-list';

import { LISTING_CATEGORY_LABELS } from '../../features/listings/model/listings.constants';
import { useListingsStore } from '../../features/listings/model/listings-store';
import { getItems } from '../../shared/api/items.api';
import styles from './listings-page.module.scss';
import { useEffect } from 'react';

const ListingsPage = () => {
  const viewMode = useListingsStore((state) => state.viewMode);
  const search = useListingsStore((state) => state.search);
  const selectedCategories = useListingsStore((state) => state.selectedCategories);
  const needsRevision = useListingsStore((state) => state.needsRevision);
  const sortColumn = useListingsStore((state) => state.sortColumn);
  const sortDirection = useListingsStore((state) => state.sortDirection);
  const currentPage = useListingsStore((state) => state.currentPage);
  const itemsPerPage = useListingsStore((state) => state.itemsPerPage);
  const setCurrentPage = useListingsStore((state) => state.setCurrentPage);

  const skip = (currentPage - 1) * itemsPerPage;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      'items',
      {
        search,
        selectedCategories,
        needsRevision,
        sortColumn,
        sortDirection,
        currentPage,
        itemsPerPage,
      },
    ],
    queryFn: () =>
      getItems({
        q: search,
        limit: itemsPerPage,
        skip,
        needsRevision,
        categories: selectedCategories,
        sortColumn,
        sortDirection,
      }),
  });

  const listings =
    data?.items.map((item) => ({
      ...item,
      category: LISTING_CATEGORY_LABELS[item.category],
      image: '',
    })) ?? [];

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
  const isEmpty = !isLoading && listings.length === 0;

  useEffect(() => {
    if (!isError) return;

    notifications.show({
      id: 'items-load-error',
      title: 'Ошибка загрузки',
      message: getErrorMessage(error),
      color: 'red',
      autoClose: 4000,
    });
  }, [isError, error]);

  return (
    <PageLayout>
      <main className={styles.page}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Мои объявления</h1>
            <p className={styles.subtitle}>{total} объявления</p>
          </header>

          <ListingsToolbar />

          <div className={styles.content}>
            <aside className={styles.sidebar}>
              <ListingsFilters />
            </aside>

            <section className={styles.listingsSection}>
              {isLoading ? (
                <div className={styles.emptyState}>
                  <Loader size={72} />
                </div>
              ) : isError ? (
                <div className={styles.emptyState}>
                  <h2 className={styles.emptyTitle}>Ошибка загрузки</h2>
                  <p className={styles.emptyText}>Не удалось получить список объявлений.</p>
                </div>
              ) : isEmpty ? (
                <div className={styles.emptyState}>
                  <h2 className={styles.emptyTitle}>Ничего не найдено</h2>
                  <p className={styles.emptyText}>
                    Попробуй изменить поисковый запрос или сбросить фильтры.
                  </p>
                </div>
              ) : viewMode === 'grid' ? (
                <ListingsGrid listings={listings} />
              ) : (
                <ListingsList listings={listings} />
              )}

              {!isLoading && !isError && totalPages > 1 && (
                <div className={styles.pagination}>
                  <Pagination
                    radius="sm"
                    value={currentPage}
                    onChange={setCurrentPage}
                    total={totalPages}
                  />
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </PageLayout>
  );
};

export default ListingsPage;
