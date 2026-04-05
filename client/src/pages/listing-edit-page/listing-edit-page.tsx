import { Button, Popover, Loader, Select, TextInput, Textarea } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';

import { clearEditDraft } from '../../features/listing-edit/lib/clear-edit-draft';
import { getEditDefaultValues } from '../../features/listing-edit/lib/get-edit-default-values';
import { getEditDraftKey } from '../../features/listing-edit/lib/get-edit-draft-key';
import { loadEditDraft } from '../../features/listing-edit/lib/load-edit-draft';
import { mapFormValuesToRequest } from '../../features/listing-edit/lib/map-form-values-to-request';
import { saveEditDraft } from '../../features/listing-edit/lib/save-edit-draft';
import { listingEditSchema } from '../../features/listing-edit/model/listing-edit.schema';
import type { ListingEditFormValues } from '../../features/listing-edit/model/listing-edit.types';
import { getItemById, putItemById } from '../../shared/api/items.api';
import { getErrorMessage } from '../../shared/lib/get-error-message';
import PageLayout from '../../shared/ui/page-layout/page-layout';
import styles from './listing-edit-page.module.scss';

import { debugGenerateDescription, debugGeneratePrice } from '../../shared/api/ai.api';

const categoryOptions = [
  { value: 'auto', label: 'Авто' },
  { value: 'real_estate', label: 'Недвижимость' },
  { value: 'electronics', label: 'Электроника' },
];

const autoTransmissionOptions = [
  { value: 'automatic', label: 'Автомат' },
  { value: 'manual', label: 'Механика' },
];

const realEstateTypeOptions = [
  { value: 'flat', label: 'Квартира' },
  { value: 'house', label: 'Дом' },
  { value: 'room', label: 'Комната' },
];

const electronicsTypeOptions = [
  { value: 'phone', label: 'Телефон' },
  { value: 'laptop', label: 'Ноутбук' },
  { value: 'misc', label: 'Другое' },
];

const electronicsConditionOptions = [
  { value: 'new', label: 'Новый' },
  { value: 'used', label: 'Б/у' },
];

const AUTO_WARNING_FIELDS: Array<keyof ListingEditFormValues['params']> = [
  'brand',
  'model',
  'yearOfManufacture',
  'transmission',
  'mileage',
  'enginePower',
];

const REAL_ESTATE_WARNING_FIELDS: Array<keyof ListingEditFormValues['params']> = [
  'type',
  'address',
  'area',
  'floor',
];

const ELECTRONICS_WARNING_FIELDS: Array<keyof ListingEditFormValues['params']> = [
  'type',
  'brand',
  'model',
  'condition',
  'color',
];

const isEmptyValue = (value: unknown) => {
  if (typeof value === 'string') {
    return value.trim() === '';
  }

  return value === undefined || value === null;
};

const generateDescriptionSuggestion = async (values: ListingEditFormValues) => {
  await new Promise((resolve) => window.setTimeout(resolve, 900));

  const categoryLabelMap = {
    auto: 'автомобиля',
    real_estate: 'объекта недвижимости',
    electronics: 'товара',
  } as const;

  return `${values.title} — отличный вариант для тех, кто ищет качественное предложение в категории ${
    categoryLabelMap[values.category]
  }. Объявление можно дополнить ключевыми характеристиками и преимуществами, чтобы оно выглядело привлекательнее для покупателей.`;
};

const generatePriceSuggestion = async (values: ListingEditFormValues) => {
  await new Promise((resolve) => window.setTimeout(resolve, 800));

  const currentPrice = Number(values.price || 0);

  if (!currentPrice) {
    return '100000';
  }

  return String(Math.round(currentPrice * 1.05));
};

const ListingEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const itemId = Number(id);
  const isValidItemId = Number.isFinite(itemId);
  const draftKey = isValidItemId ? getEditDraftKey(itemId) : '';
  const draftWasHandledRef = useRef(false);

  const [descriptionSuggestion, setDescriptionSuggestion] = useState<string | null>(null);
  const [priceSuggestion, setPriceSuggestion] = useState<string | null>(null);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isGeneratingPrice, setIsGeneratingPrice] = useState(false);
  const [isPricePopoverOpened, setIsPricePopoverOpened] = useState(false);
  const [isDescriptionPopoverOpened, setIsDescriptionPopoverOpened] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['item-edit', itemId],
    queryFn: () => getItemById(itemId),
    enabled: isValidItemId,
    retry: false,
  });

  const defaultValues = useMemo<ListingEditFormValues>(
    () => ({
      category: 'auto',
      title: '',
      price: '',
      description: '',
      params: {
        brand: '',
        model: '',
        yearOfManufacture: '',
        transmission: '',
        mileage: '',
        enginePower: '',
        type: '',
        address: '',
        area: '',
        floor: '',
        condition: '',
        color: '',
      },
    }),
    [],
  );

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, touchedFields, isValid },
  } = useForm<ListingEditFormValues>({
    resolver: zodResolver(listingEditSchema),
    defaultValues,
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const selectedCategory = useWatch({
    control,
    name: 'category',
  });

  const descriptionValue = useWatch({
    control,
    name: 'description',
  });

  const paramsValues = useWatch({
    control,
    name: 'params',
  });

  const formValues = useWatch({
    control,
  });

  useEffect(() => {
    if (!data || !draftKey || draftWasHandledRef.current) return;

    const serverValues = getEditDefaultValues(data);
    const draftValues = loadEditDraft(draftKey);

    if (draftValues) {
      reset(draftValues);

      notifications.show({
        title: 'Черновик восстановлен',
        message: 'Мы восстановили несохранённые изменения из браузера.',
        color: 'yellow',
      });

      draftWasHandledRef.current = true;
      return;
    }

    reset(serverValues);
    draftWasHandledRef.current = true;
  }, [data, draftKey, reset]);

  useEffect(() => {
    if (!draftKey || !formValues) return;
    if (isLoading || !data) return;

    const timeoutId = window.setTimeout(() => {
      saveEditDraft(draftKey, formValues as ListingEditFormValues);
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [draftKey, formValues, isLoading, data]);

  const isWarningField = (fieldName: keyof ListingEditFormValues['params']) => {
    switch (selectedCategory) {
      case 'auto':
        return AUTO_WARNING_FIELDS.includes(fieldName) && isEmptyValue(paramsValues?.[fieldName]);

      case 'real_estate':
        return (
          REAL_ESTATE_WARNING_FIELDS.includes(fieldName) && isEmptyValue(paramsValues?.[fieldName])
        );

      case 'electronics':
        return (
          ELECTRONICS_WARNING_FIELDS.includes(fieldName) && isEmptyValue(paramsValues?.[fieldName])
        );

      default:
        return false;
    }
  };

  const handleGenerateDescription = async () => {
    try {
      setIsGeneratingDescription(true);

      const values = getValues();
      const mode = values.description.trim() ? 'improve' : 'generate';
      const result = await debugGenerateDescription(values, mode);

      console.log('DESCRIPTION PROMPT RESPONSE:', result);
      setDescriptionSuggestion(result.prompt.userPrompt);
      setIsDescriptionPopoverOpened(true);
    } catch (generationError) {
      notifications.show({
        title: 'Ошибка AI',
        message: getErrorMessage(generationError),
        color: 'red',
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleApplyDescription = () => {
    if (!descriptionSuggestion) return;

    setValue('description', descriptionSuggestion, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setDescriptionSuggestion(null);
    setIsDescriptionPopoverOpened(false);
  };

  const handleGeneratePrice = async () => {
    try {
      setIsGeneratingPrice(true);

      const values = getValues();
      const result = await debugGeneratePrice(values);

      console.log('PRICE PROMPT RESPONSE:', result);
      setPriceSuggestion(result.prompt.userPrompt);
      setIsPricePopoverOpened(true);
    } catch (generationError) {
      notifications.show({
        title: 'Ошибка AI',
        message: getErrorMessage(generationError),
        color: 'red',
      });
    } finally {
      setIsGeneratingPrice(false);
    }
  };

  const handleApplyPrice = () => {
    if (!priceSuggestion) return;

    setValue('price', priceSuggestion, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setPriceSuggestion(null);
    setIsPricePopoverOpened(false);
  };

  const updateMutation = useMutation({
    mutationFn: (values: ListingEditFormValues) =>
      putItemById(itemId, mapFormValuesToRequest(values)),
    onSuccess: async () => {
      if (draftKey) {
        clearEditDraft(draftKey);
      }

      queryClient.removeQueries({
        queryKey: ['item-details', itemId],
        exact: true,
      });

      await queryClient.invalidateQueries({
        queryKey: ['item-edit', itemId],
      });

      await queryClient.invalidateQueries({
        queryKey: ['items'],
      });

      notifications.show({
        title: 'Изменения сохранены',
        message: 'Объявление успешно обновлено',
        color: 'green',
      });

      navigate(`/ads/${itemId}`);
    },
    onError: (mutationError) => {
      notifications.show({
        title: 'Ошибка сохранения',
        message: getErrorMessage(mutationError),
        color: 'red',
      });
    },
  });

  const onSubmit = (values: ListingEditFormValues) => {
    updateMutation.mutate(values);
  };

  if (!isValidItemId) {
    return (
      <PageLayout>
        <main className={styles.page}>
          <div className={styles.container}>
            <div className={styles.stateBox}>
              <h1 className={styles.stateTitle}>Некорректный идентификатор</h1>
              <p className={styles.stateText}>
                Не удалось определить объявление для редактирования.
              </p>
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
              <Button onClick={() => navigate(`/ads/${itemId}`)}>Вернуться к объявлению</Button>
            </div>
          </div>
        </main>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.backLinkWrapper}>
            <Link to={`/ads/${itemId}`} className={styles.backLink}>
              К объявлению
            </Link>
          </div>

          <header className={styles.header}>
            <h1 className={styles.title}>Редактирование объявления</h1>
          </header>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.grid}>
              <div className={styles.leftColumn}>
                <div className={styles.field}>
                  <label className={styles.label}>
                    Категория <span className={styles.required}>*</span>
                  </label>

                  <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <Select
                        data={categoryOptions}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        error={touchedFields.category ? errors.category?.message : undefined}
                      />
                    )}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    Название <span className={styles.required}>*</span>
                  </label>
                  <TextInput
                    {...register('title')}
                    error={touchedFields.title ? errors.title?.message : undefined}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    Цена <span className={styles.required}>*</span>
                  </label>

                  <div className={styles.inlineFieldRow}>
                    <div className={styles.inlineFieldInput}>
                      <TextInput
                        {...register('price')}
                        inputMode="numeric"
                        error={touchedFields.price ? errors.price?.message : undefined}
                      />
                    </div>

                    <Popover
                      opened={isPricePopoverOpened}
                      onChange={setIsPricePopoverOpened}
                      position="top-start"
                      withArrow
                      shadow="md"
                      radius="sm"
                      width={360}
                    >
                      <Popover.Target>
                        <Button
                          type="button"
                          variant="light"
                          onClick={handleGeneratePrice}
                          loading={isGeneratingPrice}
                          loaderProps={{ size: 48 }}
                          className={styles.aiButton}
                        >
                          {priceSuggestion ? 'Повторить запрос' : 'Узнать рыночную цену'}
                        </Button>
                      </Popover.Target>

                      <Popover.Dropdown className={styles.aiPopover}>
                        <div className={styles.aiPopoverContent}>
                          <p className={styles.aiSuggestionTitle}>Ответ AI:</p>
                          <p className={styles.aiSuggestionText}>
                            {priceSuggestion
                              ? `${Number(priceSuggestion).toLocaleString('ru-RU')} ₽`
                              : 'Нет данных для отображения.'}
                          </p>

                          <div className={styles.aiSuggestionActions}>
                            <Button type="button" size="xs" onClick={handleApplyPrice}>
                              Применить
                            </Button>

                            <Button
                              type="button"
                              size="xs"
                              variant="default"
                              onClick={() => setIsPricePopoverOpened(false)}
                            >
                              Закрыть
                            </Button>
                          </div>
                        </div>
                      </Popover.Dropdown>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.categoryBlock}>
              <h2 className={styles.sectionTitle}>Характеристики</h2>

              {selectedCategory === 'auto' && (
                <div className={styles.paramsGrid}>
                  <div
                    className={styles.paramField}
                    data-warning={isWarningField('brand') || undefined}
                  >
                    <TextInput label="Бренд" {...register('params.brand')} />
                  </div>

                  <div
                    className={styles.paramField}
                    data-warning={isWarningField('model') || undefined}
                  >
                    <TextInput label="Модель" {...register('params.model')} />
                  </div>

                  <div
                    className={styles.paramField}
                    data-warning={isWarningField('yearOfManufacture') || undefined}
                  >
                    <TextInput
                      label="Год выпуска"
                      {...register('params.yearOfManufacture')}
                      error={
                        touchedFields.params?.yearOfManufacture
                          ? errors.params?.yearOfManufacture?.message
                          : undefined
                      }
                    />
                  </div>

                  <div
                    className={styles.paramField}
                    data-warning={isWarningField('transmission') || undefined}
                  >
                    <Controller
                      control={control}
                      name="params.transmission"
                      render={({ field }) => (
                        <Select
                          label="Коробка передач"
                          data={autoTransmissionOptions}
                          value={field.value}
                          onChange={(value) => field.onChange(value ?? '')}
                        />
                      )}
                    />
                  </div>

                  <div
                    className={styles.paramField}
                    data-warning={isWarningField('mileage') || undefined}
                  >
                    <TextInput
                      label="Пробег"
                      {...register('params.mileage')}
                      error={
                        touchedFields.params?.mileage ? errors.params?.mileage?.message : undefined
                      }
                    />
                  </div>

                  <div
                    className={styles.paramField}
                    data-warning={isWarningField('enginePower') || undefined}
                  >
                    <TextInput
                      label="Мощность двигателя"
                      {...register('params.enginePower')}
                      error={
                        touchedFields.params?.enginePower
                          ? errors.params?.enginePower?.message
                          : undefined
                      }
                    />
                  </div>
                </div>
              )}

              {selectedCategory === 'real_estate' && (
                <div className={styles.paramsGrid}>
                  <div
                    className={styles.paramField}
                    data-warning={isWarningField('type') || undefined}
                  >
                    <Controller
                      control={control}
                      name="params.type"
                      render={({ field }) => (
                        <Select
                          label="Тип"
                          data={realEstateTypeOptions}
                          value={field.value}
                          onChange={(value) => field.onChange(value ?? '')}
                        />
                      )}
                    />
                  </div>

                  <div
                    className={styles.paramField}
                    data-warning={isWarningField('address') || undefined}
                  >
                    <TextInput label="Адрес" {...register('params.address')} />
                  </div>

                  <div
                    className={styles.paramField}
                    data-warning={isWarningField('area') || undefined}
                  >
                    <TextInput
                      label="Площадь"
                      {...register('params.area')}
                      error={touchedFields.params?.area ? errors.params?.area?.message : undefined}
                    />
                  </div>

                  <div
                    className={styles.paramField}
                    data-warning={isWarningField('floor') || undefined}
                  >
                    <TextInput
                      label="Этаж"
                      {...register('params.floor')}
                      error={
                        touchedFields.params?.floor ? errors.params?.floor?.message : undefined
                      }
                    />
                  </div>
                </div>
              )}

              {selectedCategory === 'electronics' && (
                <div className={styles.paramsGrid}>
                  <div
                    className={styles.paramField}
                    data-warning={isWarningField('type') || undefined}
                  >
                    <Controller
                      control={control}
                      name="params.type"
                      render={({ field }) => (
                        <Select
                          label="Тип"
                          data={electronicsTypeOptions}
                          value={field.value}
                          onChange={(value) => field.onChange(value ?? '')}
                        />
                      )}
                    />
                  </div>

                  <div
                    className={styles.paramField}
                    data-warning={isWarningField('brand') || undefined}
                  >
                    <TextInput label="Бренд" {...register('params.brand')} />
                  </div>

                  <div
                    className={styles.paramField}
                    data-warning={isWarningField('model') || undefined}
                  >
                    <TextInput label="Модель" {...register('params.model')} />
                  </div>

                  <div
                    className={styles.paramField}
                    data-warning={isWarningField('condition') || undefined}
                  >
                    <Controller
                      control={control}
                      name="params.condition"
                      render={({ field }) => (
                        <Select
                          label="Состояние"
                          data={electronicsConditionOptions}
                          value={field.value}
                          onChange={(value) => field.onChange(value ?? '')}
                        />
                      )}
                    />
                  </div>

                  <div
                    className={styles.paramField}
                    data-warning={isWarningField('color') || undefined}
                  >
                    <TextInput label="Цвет" {...register('params.color')} />
                  </div>
                </div>
              )}
            </div>

            <div className={styles.descriptionBlock}>
              <label className={styles.label}>Описание</label>

              <Textarea
                {...register('description')}
                resize="vertical"
                maxLength={1000}
                error={touchedFields.description ? errors.description?.message : undefined}
              />

              <div className={styles.descriptionFooter}>
                <Popover
                  opened={isDescriptionPopoverOpened}
                  onChange={setIsDescriptionPopoverOpened}
                  position="top-start"
                  withArrow
                  shadow="md"
                  width={420}
                >
                  <Popover.Target>
                    <Button
                      type="button"
                      variant="light"
                      size="xs"
                      onClick={handleGenerateDescription}
                      loading={isGeneratingDescription}
                      loaderProps={{ size: 48 }}
                    >
                      {descriptionValue?.trim() ? 'Улучшить описание' : 'Придумать описание'}
                    </Button>
                  </Popover.Target>

                  <Popover.Dropdown className={styles.aiPopover}>
                    <div className={styles.aiPopoverContent}>
                      <p className={styles.aiSuggestionTitle}>Ответ AI:</p>
                      <p className={styles.aiSuggestionText}>
                        {descriptionSuggestion ?? 'Нет данных для отображения.'}
                      </p>

                      <div className={styles.aiSuggestionActions}>
                        <Button type="button" size="xs" onClick={handleApplyDescription}>
                          Применить
                        </Button>

                        <Button
                          type="button"
                          size="xs"
                          variant="default"
                          onClick={() => setIsDescriptionPopoverOpened(false)}
                        >
                          Закрыть
                        </Button>
                      </div>
                    </div>
                  </Popover.Dropdown>
                </Popover>
                <div className={styles.counter}>{descriptionValue?.length ?? 0}/1000</div>
              </div>
            </div>

            <div className={styles.actions}>
              <Button
                type="submit"
                loading={updateMutation.isPending}
                disabled={!isValid || updateMutation.isPending}
              >
                Сохранить
              </Button>

              <Button component={Link} to={`/ads/${itemId}`} variant="default">
                Отменить
              </Button>
            </div>
          </form>
        </div>
      </main>
    </PageLayout>
  );
};

export default ListingEditPage;
