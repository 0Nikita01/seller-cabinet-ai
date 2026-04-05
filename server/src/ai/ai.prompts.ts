import type { AiDescriptionRequest, AiPriceRequest } from './ai.types.ts';
import { normalizeItemForAi } from './ai.utils.ts';

export const buildDescriptionPrompt = (payload: AiDescriptionRequest) => {
  const item = normalizeItemForAi(payload.item);

  const systemPrompt = `
    Ты AI-помощник для редактирования объявлений в маркетплейсе.
    Твоя задача — написать качественное описание товара на русском языке.

    Правила:
    1. Используй только факты из входных данных.
    2. Не выдумывай характеристики, которых нет.
    3. Не добавляй дисклеймеры, комментарии о себе или пояснения вне ответа.
    4. Стиль: ясный, естественный, аккуратный, без агрессивной рекламы и кликбейта.
    5. Если данных мало, сделай краткое, но полезное описание.
    6. Верни только JSON по заданной схеме.
  `.trim();

  const jsonSchema = {
    type: 'object',
    properties: {
      description: { type: 'string' },
    },
    required: ['description'],
    additionalProperties: false,
  };

  const userPrompt = `
    Режим: ${payload.mode}
    Данные объявления:
    ${JSON.stringify(item, null, 2)}

    Сгенерируй ${
        payload.mode === 'improve' ? 'улучшенное' : 'новое'
      } описание объявления.
    Верни строго JSON по этой схеме:
    ${JSON.stringify(jsonSchema, null, 2)}
  `.trim();

  return {
    systemPrompt,
    userPrompt,
    jsonSchema,
    debug: {
      normalizedItem: item,
    },
  };
};

export const buildPricePrompt = (payload: AiPriceRequest) => {
  const item = normalizeItemForAi(payload.item);

  const isRealEstate = item.category === 'real_estate';

  const systemPrompt = `
    Ты AI-помощник для оценки ориентировочной рыночной цены объявления.
    Твоя задача — предложить диапазоны цены на основе данных объявления.

    Обязательные правила:
    1. Всегда отвечай только на русском языке.
    2. Все label, comment и summary должны быть только на русском языке.
    3. Поле price передано только как цена продавца, а не как рыночный ориентир, не используй его как основу для оценки.
    3. Названия брендов, моделей и официальных наименований можно оставлять в оригинале.
    4. Используй только входные данные.
    5. Не утверждай, что знаешь рынок абсолютно точно.
    6. Верни только JSON по заданной схеме.
  `.trim();

  const jsonSchema = isRealEstate
    ? {
        type: 'object',
        properties: {
          priceRanges: {
            type: 'array',
            minItems: 2,
            maxItems: 2,
            items: {
              type: 'object',
              properties: {
                condition: {
                  type: 'string',
                  enum: ['new', 'resale'],
                },
                label: { type: 'string' },
                min: { type: 'number' },
                max: { type: 'number' },
                comment: { type: 'string' },
              },
              required: ['condition', 'label', 'min', 'max', 'comment'],
              additionalProperties: false,
            },
          },
          summary: { type: 'string' },
        },
        required: ['priceRanges', 'summary'],
        additionalProperties: false,
      }
    : {
        type: 'object',
        properties: {
          priceRanges: {
            type: 'array',
            minItems: 3,
            maxItems: 3,
            items: {
              type: 'object',
              properties: {
                condition: {
                  type: 'string',
                  enum: ['new', 'good_used', 'used_with_defects'],
                },
                label: { type: 'string' },
                min: { type: 'number' },
                max: { type: 'number' },
                comment: { type: 'string' },
              },
              required: ['condition', 'label', 'min', 'max', 'comment'],
              additionalProperties: false,
            },
          },
          summary: { type: 'string' },
        },
        required: ['priceRanges', 'summary'],
        additionalProperties: false,
      };

  const scenarioInstruction = isRealEstate
    ? `
    Верни 2 сценария цены:
    - new — новое жильё / новостройка
    - resale — вторичка
    `
        : `
    Верни 3 сценария цены:
    - new — новое / идеальное состояние
    - good_used — б/у в хорошем состоянии
    - used_with_defects — б/у с дефектами или срочная продажа
    `;

  const userPrompt = `
    Данные объявления:
    ${JSON.stringify({...item, price: null}, null, 2)}

    Оцени ориентировочную рыночную цену объявления.

    ${scenarioInstruction}

    Важно:
    - весь ответ должен быть только на русском языке;
    - condition должен строго соответствовать допустимым значениям схемы;
    - label и comment должны быть понятны пользователю на русском языке.
    - не используй цену продавца как ориентир рыночной стоимости.

    Верни строго JSON по этой схеме:
    ${JSON.stringify(jsonSchema, null, 2)}
  `.trim();

  return {
    systemPrompt,
    userPrompt,
    jsonSchema,
    debug: {
      normalizedItem: item,
    },
  };
};