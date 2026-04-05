import { ItemUpdateIn } from '../types.ts';

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const compactObject = (obj: Record<string, unknown>) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => {
      if (typeof value === 'string') return value.trim().length > 0;
      return value !== undefined && value !== null;
    }),
  );
};

export const normalizeItemForAi = (item: ItemUpdateIn) => {
  const normalizedDescription = isNonEmptyString(item.description)
    ? item.description.trim()
    : undefined;

  return {
    category: item.category,
    title: item.title.trim(),
    price: item.price,
    description: normalizedDescription,
    params: compactObject(item.params as Record<string, unknown>),
  };
};
