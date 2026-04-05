import { ItemUpdateIn } from '../types.ts';

export type AiDescriptionRequest = {
  item: ItemUpdateIn;
  mode: 'generate' | 'improve';
};

export type AiPriceRequest = {
  item: ItemUpdateIn;
};

export type AiDescriptionResponse = {
  description: string;
};

export type AiPriceRangeCondition = 'new' | 'good_used' | 'used_with_defects';

export type AiPriceResponse = {
  priceRanges: Array<{
    condition: AiPriceRangeCondition;
    label: string;
    min: number;
    max: number;
    comment: string;
  }>;
  summary: string;
};