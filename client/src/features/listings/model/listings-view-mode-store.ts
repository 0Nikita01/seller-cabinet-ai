import { create } from 'zustand';

export type ListingsViewMode = 'grid' | 'list';

type ListingsViewModeStore = {
  viewMode: ListingsViewMode;
  setViewMode: (mode: ListingsViewMode) => void;
};

export const useListingsViewModeStore = create<ListingsViewModeStore>((set) => ({
  viewMode: 'grid',
  setViewMode: (mode) => set({ viewMode: mode }),
}));
