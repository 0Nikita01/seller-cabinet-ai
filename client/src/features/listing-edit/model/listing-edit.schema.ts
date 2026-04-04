import { z } from 'zod';

const requiredString = (message: string) => z.string().trim().min(1, message);

const optionalNumberString = (message: string) =>
  z
    .string()
    .trim()
    .refine((value) => value === '' || !Number.isNaN(Number(value)), message);

export const listingEditSchema = z.object({
  category: z.enum(['auto', 'real_estate', 'electronics']),
  title: requiredString('Введите название объявления'),
  price: z
    .string()
    .trim()
    .min(1, 'Введите цену')
    .refine((value) => !Number.isNaN(Number(value)), 'Цена должна быть числом')
    .refine((value) => Number(value) >= 0, 'Цена не может быть отрицательной'),
  description: z.string().max(1000, 'Максимальная длина описания — 1000 символов'),
  params: z.object({
    brand: z.string(),
    model: z.string(),
    yearOfManufacture: optionalNumberString('Год выпуска должен быть числом'),
    transmission: z.enum(['automatic', 'manual', '']),
    mileage: optionalNumberString('Пробег должен быть числом'),
    enginePower: optionalNumberString('Мощность должна быть числом'),
    type: z.enum(['flat', 'house', 'room', 'phone', 'laptop', 'misc', '']),
    address: z.string(),
    area: optionalNumberString('Площадь должна быть числом'),
    floor: optionalNumberString('Этаж должен быть числом'),
    condition: z.enum(['new', 'used', '']),
    color: z.string(),
  }),
});

export type ListingEditSchema = z.infer<typeof listingEditSchema>;
