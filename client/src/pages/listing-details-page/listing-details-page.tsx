import { Alert, Button, Loader } from '@mantine/core';
import { IconAlertCircle, IconArrowLeft, IconPencil } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';

import listingPlaceholder from '../../assets/card_placeHolder.png';
import { getItemCharacteristics } from '../../features/listing-details/lib/get-item-characteristics';
import { formatItemDate } from '../../features/listing-details/lib/format-item-date';
import { getItemMissingFields } from '../../features/listing-details/lib/get-item-missing-fields';
import { getErrorMessage } from '../../shared/lib/get-error-message';
import { getItemById } from '../../shared/api/items.api';
import PageLayout from '../../shared/ui/page-layout/page-layout';
import styles from './listing-details-page.module.scss';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU').format(price);
};

const ListingDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const itemId = Number(id);
  const isValidItemId = Number.isFinite(itemId);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['item-details', itemId],
    queryFn: () => getItemById(itemId),
    enabled: isValidItemId,
    retry: false,
  });

  if (!isValidItemId) {
    return (
      <PageLayout>
        <main className={styles.page}>
          <div className={styles.container}>
            <div className={styles.stateBox}>
              <h1 className={styles.stateTitle}>Некорректный идентификатор</h1>
              <p className={styles.stateText}>Не удалось определить объявление для просмотра.</p>
              <Button onClick={() => navigate('/ads')}>Вернуться к объявлениям</Button>
            </div>
          </div>
        </main>
      </PageLayout>
    );
  }

  if (isLoading) {
    return (
      <PageLayout>
        <div className={styles.loaderState}>
          <Loader size={92} />
        </div>
      </PageLayout>
    );
  }

  if (isError || !data) {
    return (
      <PageLayout>
        <main className={styles.page}>
          <div className={styles.container}>
            <div className={styles.stateBox}>
              <h1 className={styles.stateTitle}>Ошибка загрузки</h1>
              <p className={styles.stateText}>{getErrorMessage(error)}</p>
              <Button onClick={() => navigate('/ads')}>Вернуться к объявлениям</Button>
            </div>
          </div>
        </main>
      </PageLayout>
    );
  }

  const characteristics = getItemCharacteristics(data);
  const missingFields = getItemMissingFields(data);
  const hasRevisionAlert = data.needsRevision && missingFields.length > 0;
  const description = data.description?.trim() ? data.description : 'Отсутствует';
  const wasUpdated = data.createdAt !== data.updatedAt;

  return (
    <PageLayout>
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.backLinkWrapper}>
            <Link to="/ads" className={styles.backLink}>
              <IconArrowLeft size={18} />
              <span>К списку объявлений</span>
            </Link>
          </div>

          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <h1 className={styles.title}>{data.title}</h1>

              <Link to={`/ads/${data.id}/edit`} className={styles.editLink}>
                <Button leftSection={<IconPencil size={18} />} radius="md">
                  Редактировать
                </Button>
              </Link>
            </div>

            <div className={styles.headerRight}>
              <p className={styles.price}>{formatPrice(data.price)} ₽</p>
              <p className={styles.dateText}>Опубликовано: {formatItemDate(data.createdAt)}</p>
              {wasUpdated && (
                <p className={styles.dateText}>Отредактировано: {formatItemDate(data.updatedAt)}</p>
              )}
            </div>
          </header>

          <div className={styles.divider} />

          <section className={styles.mainSection}>
            <div className={styles.imageBlock}>
              <img className={styles.image} src={listingPlaceholder} alt={data.title} />
            </div>

            <div className={styles.infoBlock}>
              {hasRevisionAlert && (
                <Alert
                  variant="light"
                  color="orange"
                  radius="md"
                  icon={<IconAlertCircle size={20} />}
                  className={styles.alert}
                >
                  <div className={styles.alertContent}>
                    <p className={styles.alertTitle}>Требуются доработки</p>
                    <p className={styles.alertText}>У объявления не заполнены поля:</p>
                    <ul className={styles.alertList}>
                      {missingFields.map((field) => (
                        <li key={field}>{field}</li>
                      ))}
                    </ul>
                  </div>
                </Alert>
              )}

              <div className={styles.characteristicsBlock}>
                <h2 className={styles.sectionTitle}>Характеристики</h2>

                <div className={styles.characteristicsList}>
                  {characteristics.length > 0 ? (
                    characteristics.map((item) => (
                      <div key={item.label} className={styles.characteristicRow}>
                        <span className={styles.characteristicLabel}>{item.label}</span>
                        <span className={styles.characteristicValue}>{item.value}</span>
                      </div>
                    ))
                  ) : (
                    <p className={styles.emptyCharacteristics}>Характеристики отсутствуют</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className={styles.descriptionSection}>
            <h2 className={styles.sectionTitle}>Описание</h2>
            <p className={styles.description}>{description}</p>
          </section>
        </div>
      </main>
    </PageLayout>
  );
};

export default ListingDetailsPage;
