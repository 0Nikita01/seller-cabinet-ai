import { apiInstance } from './api-instance';
import type { ListingEditFormValues } from '../../features/listing-edit/model/listing-edit.types';

type AiDescriptionResult = {
  description: string;
};

type AiPriceResult = {
  priceRanges: Array<{
    condition: 'new' | 'good_used' | 'used_with_defects' | 'resale';
    label: string;
    min: number;
    max: number;
    comment: string;
  }>;
  summary: string;
};

type AiPromptDebug = {
  systemPrompt: string;
  userPrompt: string;
  normalizedItem: Record<string, unknown>;
};

type AiDescriptionResponse = {
  success: true;
  prompt: AiPromptDebug;
  result: AiDescriptionResult;
};

type AiPriceResponse = {
  success: true;
  prompt: AiPromptDebug;
  result: AiPriceResult;
};

const compactObject = (obj: Record<string, unknown>) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => {
      if (typeof value === 'string') return value.trim().length > 0;
      return value !== undefined && value !== null;
    }),
  );
};

const toOptionalNumber = (value: string) => {
  const trimmed = value.trim();
  return trimmed ? Number(trimmed) : undefined;
};

const mapFormValuesToAiItem = (values: ListingEditFormValues) => {
  const baseItem = {
    category: values.category,
    title: values.title.trim(),
    description: values.description.trim() || undefined,
    price: Number(values.price || 0),
    params: {} as Record<string, unknown>,
  };

  switch (values.category) {
    case 'auto':
      baseItem.params = compactObject({
        brand: values.params.brand,
        model: values.params.model,
        yearOfManufacture: toOptionalNumber(values.params.yearOfManufacture),
        transmission: values.params.transmission || undefined,
        mileage: toOptionalNumber(values.params.mileage),
        enginePower: toOptionalNumber(values.params.enginePower),
      });
      return baseItem;

    case 'real_estate':
      baseItem.params = compactObject({
        type: values.params.type || undefined,
        address: values.params.address,
        area: toOptionalNumber(values.params.area),
        floor: toOptionalNumber(values.params.floor),
      });
      return baseItem;

    case 'electronics':
      baseItem.params = compactObject({
        type: values.params.type || undefined,
        brand: values.params.brand,
        model: values.params.model,
        condition: values.params.condition || undefined,
        color: values.params.color,
      });
      return baseItem;

    default:
      return baseItem;
  }
};

export const generateAiDescription = async (
  values: ListingEditFormValues,
  mode: 'generate' | 'improve',
  signal?: AbortSignal,
): Promise<AiDescriptionResponse> => {
  const response = await apiInstance.post<AiDescriptionResponse>(
    '/ai/description',
    {
      item: mapFormValuesToAiItem(values),
      mode,
    },
    { signal },
  );

  return response.data;
};

export const generateAiPrice = async (
  values: ListingEditFormValues,
  signal?: AbortSignal,
): Promise<AiPriceResponse> => {
  const response = await apiInstance.post<AiPriceResponse>(
    '/ai/price',
    {
      item: mapFormValuesToAiItem(values),
    },
    { signal },
  );

  return response.data;
};
