import Fastify from 'fastify';
import cors from '@fastify/cors';

import items from 'data/items.json' with { type: 'json' };
import { Item } from 'src/types.ts';
import { ItemsGetInQuerySchema, ItemUpdateInSchema } from 'src/validation.ts';
import { treeifyError, ZodError } from 'zod';
import { doesItemNeedRevision } from './src/utils.ts';

import { ollamaGenerate } from './src/ai/ollama.client.ts';
import { buildDescriptionPrompt, buildPricePrompt } from './src/ai/ai.prompts.ts';

const ITEMS = items as Item[];

const fastify = Fastify({
  logger: true,
});

await fastify.register((await import('@fastify/middie')).default);

// Искуственная задержка ответов, чтобы можно было протестировать состояния загрузки
fastify.use((_, __, next) =>
  new Promise(res => setTimeout(res, 300 + Math.random() * 700)).then(next),
);

// Настройка CORS
await fastify.register(cors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
});

interface ItemGetRequest extends Fastify.RequestGenericInterface {
  Params: {
    id: string;
  };
}

fastify.post('/ai/description', async (request, reply) => {
  const payload = request.body as {
    item: {
      category: 'auto' | 'real_estate' | 'electronics';
      title: string;
      description?: string;
      price: number;
      params: Record<string, unknown>;
    };
    mode: 'generate' | 'improve';
  };

  try {
    const promptData = buildDescriptionPrompt(payload);

    const ollamaResult = await ollamaGenerate({
      model: 'llama3',
      systemPrompt: promptData.systemPrompt,
      prompt: promptData.userPrompt,
      format: promptData.jsonSchema,
    });

    const rawContent = ollamaResult.response ?? '{}';
    const parsed = JSON.parse(rawContent) as { description: string };

    reply.send({
      success: true,
      prompt: {
        systemPrompt: promptData.systemPrompt,
        userPrompt: promptData.userPrompt,
        normalizedItem: promptData.debug.normalizedItem,
      },
      result: parsed,
    });
  } catch (error) {
    console.error(error);
    reply.status(500).send({
      success: false,
      error: error instanceof Error ? error.message : 'AI description request failed',
    });
  }
});

fastify.post('/ai/price', async (request, reply) => {
  const payload = request.body as {
    item: {
      category: 'auto' | 'real_estate' | 'electronics';
      title: string;
      description?: string;
      price: number;
      params: Record<string, unknown>;
    };
  };

  try {
    const promptData = buildPricePrompt(payload);

    const ollamaResult = await ollamaGenerate({
      model: 'llama3',
      systemPrompt: promptData.systemPrompt,
      prompt: promptData.userPrompt,
      format: promptData.jsonSchema,
    });

    const rawContent = ollamaResult.response ?? '{}';
    const parsed = JSON.parse(rawContent) as {
      priceRanges: Array<{
        condition: 'new' | 'good_used' | 'used_with_defects' | 'resale';
        label: string;
        min: number;
        max: number;
        comment: string;
      }>;
      summary: string;
    };

    reply.send({
      success: true,
      prompt: {
        systemPrompt: promptData.systemPrompt,
        userPrompt: promptData.userPrompt,
        normalizedItem: promptData.debug.normalizedItem,
      },
      result: parsed,
    });
  } catch (error) {
    console.error(error);
    reply.status(500).send({
      success: false,
      error: error instanceof Error ? error.message : 'AI price request failed',
    });
  }
});

fastify.get<ItemGetRequest>('/items/:id', (request, reply) => {
  const itemId = Number(request.params.id);

  if (!Number.isFinite(itemId)) {
    reply
      .status(400)
      .send({ success: false, error: 'Item ID path param should be a number' });
    return;
  }

  const item = ITEMS.find(item => item.id === itemId);

  if (!item) {
    reply
      .status(404)
      .send({ success: false, error: "Item with requested id doesn't exist" });
    return;
  }

  return {
    ...item,
    needsRevision: doesItemNeedRevision(item),
  };
});

interface ItemsGetRequest extends Fastify.RequestGenericInterface {
  Querystring: {
    q?: string;
    limit?: string;
    skip?: string;
    categories?: string;
    needsRevision?: string;
  };
}

fastify.get<ItemsGetRequest>('/items', (request, reply) => {
  const {
    q,
    limit,
    skip,
    needsRevision,
    categories,
    sortColumn,
    sortDirection,
  } = ItemsGetInQuerySchema.parse(request.query);

  const filteredItems = ITEMS.filter(item => {
    return (
      item.title.toLowerCase().includes(q.toLowerCase()) &&
      (!needsRevision || doesItemNeedRevision(item)) &&
      (!categories?.length ||
        categories.some(category => item.category === category))
    );
  });

  return {
    items: filteredItems
      .toSorted((item1, item2) => {
        let comparisonValue = 0;

        if (!sortDirection) return comparisonValue;

        if (sortColumn === 'title') {
          comparisonValue = item1.title.localeCompare(item2.title);
        } else if (sortColumn === 'createdAt') {
          comparisonValue =
            new Date(item1.createdAt).valueOf() -
            new Date(item2.createdAt).valueOf();
        }

        return (sortDirection === 'desc' ? -1 : 1) * comparisonValue;
      })
      .slice(skip, skip + limit)
      .map(item => ({
        id: item.id,
        category: item.category,
        title: item.title,
        price: item.price,
        needsRevision: doesItemNeedRevision(item),
      })),
    total: filteredItems.length,
  };
});

interface ItemUpdateRequest extends Fastify.RequestGenericInterface {
  Params: {
    id: string;
  };
}

fastify.put<ItemUpdateRequest>('/items/:id', (request, reply) => {
  const itemId = Number(request.params.id);

  if (!Number.isFinite(itemId)) {
    reply
      .status(400)
      .send({ success: false, error: 'Item ID path param should be a number' });
    return;
  }

  const itemIndex = ITEMS.findIndex(item => item.id === itemId);

  if (itemIndex === -1) {
    reply
      .status(404)
      .send({ success: false, error: "Item with requested id doesn't exist" });
    return;
  }

  try {
    const parsedData = ItemUpdateInSchema.parse({
      category: ITEMS[itemIndex].category,
      ...(request.body as {}),
    });

    ITEMS[itemIndex] = {
      id: ITEMS[itemIndex].id,
      createdAt: ITEMS[itemIndex].createdAt,
      updatedAt: new Date().toISOString(),
      ...parsedData,
    };

    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      reply.status(400).send({ success: false, error: treeifyError(error) });
      return;
    }

    throw error;
  }
});

const rawPort = process.env.PORT;
const port = rawPort ? Number(rawPort) : 8080;

if (!Number.isInteger(port) || port < 0 || port > 65535) {
  throw new Error(`Invalid PORT value: ${rawPort}`);
}

fastify.listen({ port }, function (err, _address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  fastify.log.debug(`Server is listening on port ${port}`);
});
