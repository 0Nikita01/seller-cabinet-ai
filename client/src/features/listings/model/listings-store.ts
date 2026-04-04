import { create } from 'zustand';

import type {
  ListingCategory,
  ListingSortColumn,
  ListingSortDirection,
  ListingViewMode,
} from './listings.types';

type ListingsStore = {
  viewMode: ListingViewMode;
  search: string;
  selectedCategories: ListingCategory[];
  needsRevision: boolean;
  sortColumn: ListingSortColumn;
  sortDirection: ListingSortDirection;
  currentPage: number;
  itemsPerPage: number;
  setViewMode: (mode: ListingViewMode) => void;
  setSearch: (value: string) => void;
  toggleCategory: (category: ListingCategory) => void;
  setNeedsRevision: (value: boolean) => void;
  setSorting: (sortColumn: ListingSortColumn, sortDirection: ListingSortDirection) => void;
  setCurrentPage: (page: number) => void;
  resetFilters: () => void;
};

const initialState = {
  viewMode: 'grid' as ListingViewMode,
  search: '',
  selectedCategories: [] as ListingCategory[],
  needsRevision: false,
  sortColumn: 'createdAt' as ListingSortColumn,
  sortDirection: 'desc' as ListingSortDirection,
  currentPage: 1,
  itemsPerPage: 10,
};

export const useListingsStore = create<ListingsStore>((set) => ({
  ...initialState,

  setViewMode: (mode) => set({ viewMode: mode }),

  setSearch: (value) =>
    set({
      search: value,
      currentPage: 1,
    }),

  toggleCategory: (category) =>
    set((state) => {
      const exists = state.selectedCategories.includes(category);

      return {
        selectedCategories: exists
          ? state.selectedCategories.filter((item) => item !== category)
          : [...state.selectedCategories, category],
        currentPage: 1,
      };
    }),

  setNeedsRevision: (value) =>
    set({
      needsRevision: value,
      currentPage: 1,
    }),

  setSorting: (sortColumn, sortDirection) =>
    set({
      sortColumn,
      sortDirection,
      currentPage: 1,
    }),

  setCurrentPage: (page) => set({ currentPage: page }),

  resetFilters: () =>
    set({
      search: '',
      selectedCategories: [],
      needsRevision: false,
      sortColumn: 'createdAt',
      sortDirection: 'desc',
      currentPage: 1,
    }),
}));
