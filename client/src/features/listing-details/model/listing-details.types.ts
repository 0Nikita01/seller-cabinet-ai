export type ItemCategory = 'auto' | 'real_estate' | 'electronics';

export type AutoTransmission = 'automatic' | 'manual';
export type RealEstateType = 'flat' | 'house' | 'room';
export type ElectronicsType = 'phone' | 'laptop' | 'misc';
export type ElectronicsCondition = 'new' | 'used';

export type AutoItemParams = {
  brand?: string;
  model?: string;
  yearOfManufacture?: number;
  transmission?: AutoTransmission;
  mileage?: number;
  enginePower?: number;
};

export type RealEstateItemParams = {
  type?: RealEstateType;
  address?: string;
  area?: number;
  floor?: number;
};

export type ElectronicsItemParams = {
  type?: ElectronicsType;
  brand?: string;
  model?: string;
  condition?: ElectronicsCondition;
  color?: string;
};

export type AutoItemDetails = {
  id: number;
  category: 'auto';
  title: string;
  description?: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  needsRevision: boolean;
  params: AutoItemParams;
};

export type RealEstateItemDetails = {
  id: number;
  category: 'real_estate';
  title: string;
  description?: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  needsRevision: boolean;
  params: RealEstateItemParams;
};

export type ElectronicsItemDetails = {
  id: number;
  category: 'electronics';
  title: string;
  description?: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  needsRevision: boolean;
  params: ElectronicsItemParams;
};

export type ItemDetails = AutoItemDetails | RealEstateItemDetails | ElectronicsItemDetails;

export type ItemCharacteristic = {
  label: string;
  value: string;
};
