import type { ListingEditFormValues } from '../model/listing-edit.types';

export const loadEditDraft = (key: string): ListingEditFormValues | null => {
  const rawValue = localStorage.getItem(key);

  if (!rawValue) return null;

  try {
    return JSON.parse(rawValue) as ListingEditFormValues;
  } catch {
    return null;
  }
};
