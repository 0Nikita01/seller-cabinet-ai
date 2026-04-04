import type { ListingEditFormValues } from '../model/listing-edit.types';

export const saveEditDraft = (key: string, values: ListingEditFormValues) => {
  localStorage.setItem(key, JSON.stringify(values));
};
