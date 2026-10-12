import type { Lang } from '../i18n/config.i18n';

export interface NutrientInfo {
  label?: string;
  amount: string;
  dailyValue?: string;
}

export interface NutritionFacts {
  servingsPerContainer: string;
  servingSize: string;
  calories: number | string;
  totalFat: NutrientInfo;
  saturatedFat: NutrientInfo;
  transFat: NutrientInfo;
  cholesterol: NutrientInfo;
  sodium: NutrientInfo;
  totalCarbohydrates: NutrientInfo;
  dietaryFiber: NutrientInfo;
  totalSugars: NutrientInfo;
  addedSugars: NutrientInfo;
  protein: NutrientInfo;
  vitaminD: NutrientInfo;
  calcium: NutrientInfo;
  iron: NutrientInfo;
  potassium: NutrientInfo;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  categorySlug: string;
  categories: string[];
  description?: string;
  features?: string[];
  image: string;
  linkVasAlSuper?: string;
  ingredients?: string[];
  nutrition?: NutritionFacts;
}

export type ProductsByLanguage = Record<Lang, Product[]>;
