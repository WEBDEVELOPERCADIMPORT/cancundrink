import type { Lang } from '../i18n/config.i18n';

export interface NutrientInfo {
  label?: string;
  amount: string;
  dailyvalue?: string;
  dailyValue?: string;
}

export interface NutritionFacts {
  servingspercontainer?: string;
  servingsize?: string;
  calories: number | string;
  totalfat?: NutrientInfo;
  saturatedfat?: NutrientInfo;
  transfat?: NutrientInfo;
  cholesterol?: NutrientInfo;
  sodium?: NutrientInfo;
  totalcarbohydrates?: NutrientInfo;
  dietaryfiber?: NutrientInfo;
  totalsugars?: NutrientInfo;
  addedsugars?: NutrientInfo;
  protein?: NutrientInfo;
  vitamind?: NutrientInfo;
  calcium?: NutrientInfo;
  iron?: NutrientInfo;
  potassium?: NutrientInfo;

  // Compatibilidad camelCase
  servingsPerContainer?: string;
  servingSize?: string;
  totalFat?: NutrientInfo;
  saturatedFat?: NutrientInfo;
  transFat?: NutrientInfo;
  totalCarbohydrates?: NutrientInfo;
  dietaryFiber?: NutrientInfo;
  totalSugars?: NutrientInfo;
  addedSugars?: NutrientInfo;
  vitaminD?: NutrientInfo;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  categoryslug?: string;
  categories: string[];
  description?: string;
  features?: string[];
  image: string;
  linkvasalsuper?: string;
  ingredients?: string[];
  nutrition?: NutritionFacts;

  // Compatibilidad camelCase
  categorySlug?: string;
  linkVasAlSuper?: string;
}

export type ProductsByLanguage = Record<Lang, Product[]>;
