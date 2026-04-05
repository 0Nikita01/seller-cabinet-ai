import { apiInstance } from './api-instance';
import type { ListingEditFormValues } from '../../features/listing-edit/model/listing-edit.types';

type AiPromptResponse = {
  success: true;
  prompt: {
    systemPrompt: string;
    userPrompt: string;
    jsonSchema: Record<string, unknown>;
    normalizedItem: Record<string, unknown>;
  };
};

const compactObject = (obj: Record<string, unknown>) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => {
      if (typeof value === 'string') return value.trim().length > 0;
      return value !== undefined && value !== null;
    }),
  );
};

const mapFormValuesToAiItem = (values: ListingEditFormValues) => {
  return {
    category: values.category,
    title: values.title.trim(),
    description: values.description.trim() || undefined,
    price: Number(values.price || 0),
    params: compactObject(values.params as Record<string, unknown>),
  };
};

export const debugGenerateDescription = async (
  values: ListingEditFormValues,
  mode: 'generate' | 'improve',
): Promise<AiPromptResponse> => {
  const response = await apiInstance.post<AiPromptResponse>('/ai/description', {
    item: mapFormValuesToAiItem(values),
    mode,
  });

  return response.data;
};

export const debugGeneratePrice = async (
  values: ListingEditFormValues,
): Promise<AiPromptResponse> => {
  const response = await apiInstance.post<AiPromptResponse>('/ai/price', {
    item: mapFormValuesToAiItem(values),
  });

  return response.data;
};