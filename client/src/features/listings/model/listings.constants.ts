import type { ListingCategoryOption, ListingSortOptionValue } from './listings.types';

export const LISTING_CATEGORY_OPTIONS: ListingCategoryOption[] = [
  { value: 'auto', label: 'Авто' },
  { value: 'real_estate', label: 'Недвижимость' },
  { value: 'electronics', label: 'Электроника' },
];

export const LISTING_SORT_OPTIONS: { value: ListingSortOptionValue; label: string }[] = [
  { value: 'createdAt-desc', label: 'По новизне (сначала новые)' },
  { value: 'createdAt-asc', label: 'По новизне (сначала старые)' },
  { value: 'title-asc', label: 'По названию (А-Я)' },
  { value: 'title-desc', label: 'По названию (Я-А)' },
];

export const LISTING_CATEGORY_LABELS = {
  auto: 'Авто',
  real_estate: 'Недвижимость',
  electronics: 'Электроника',
} as const;
