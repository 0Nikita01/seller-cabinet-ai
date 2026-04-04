import { apiInstance } from './api-instance';
import type {
  ListingCategory,
  ListingListItem,
  ListingSortColumn,
  ListingSortDirection,
} from '../../features/listings/model/listings.types';

import type { ItemDetails } from '../../features/listing-details/model/listing-details.types';
import type { ListingEditRequestBody } from '../../features/listing-edit/model/listing-edit.types';

export type GetItemsParams = {
  q?: string;
  limit: number;
  skip: number;
  needsRevision?: boolean;
  categories?: ListingCategory[];
  sortColumn?: ListingSortColumn;
  sortDirection?: ListingSortDirection;
};

export type GetItemsResponse = {
  items: ListingListItem[];
  total: number;
};

export const getItems = async (params: GetItemsParams): Promise<GetItemsResponse> => {
  const response = await apiInstance.get<GetItemsResponse>('/items', {
    params: {
      q: params.q ?? '',
      limit: params.limit,
      skip: params.skip,
      needsRevision: params.needsRevision || undefined,
      categories: params.categories?.length ? params.categories.join(',') : undefined,
      sortColumn: params.sortColumn,
      sortDirection: params.sortDirection,
    },
  });

  return response.data;
};

export const getItemById = async (id: number): Promise<ItemDetails> => {
  const response = await apiInstance.get<ItemDetails>(`/items/${id}`);

  return response.data;
};

export const putItemById = async (
  id: number,
  body: ListingEditRequestBody,
): Promise<{ success: true }> => {
  const response = await apiInstance.put<{ success: true }>(`/items/${id}`, body);

  return response.data;
};
