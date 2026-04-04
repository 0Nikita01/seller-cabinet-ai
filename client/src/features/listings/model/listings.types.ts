export type ListingViewMode = 'grid' | 'list';

export type ListingCategory = 'auto' | 'real_estate' | 'electronics';

export type ListingSortColumn = 'title' | 'createdAt';
export type ListingSortDirection = 'asc' | 'desc';

export type ListingListItem = {
  id: number;
  category: ListingCategory;
  title: string;
  price: number;
  needsRevision: boolean;
};

export type ListingCategoryOption = {
  value: ListingCategory;
  label: string;
};

export type ListingSortOptionValue =
  | 'createdAt-desc'
  | 'createdAt-asc'
  | 'title-asc'
  | 'title-desc';
