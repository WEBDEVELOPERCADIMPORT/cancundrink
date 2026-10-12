import fs from 'fs';
import path from 'path';
import type { Lang } from '../i18n/config.i18n';
import type { ProductsByLanguage } from '../types/product';

const baseUrl = 'https://cancundrink.com';
const languages: Lang[] = ['es', 'en'];
const homeSectionIds = ['hero', 'skills', 'about-koko', 'categories', 'reviews', 'places', 'questions'];

const productsPath = path.resolve('./src/data/products/products.data.json');
const categoriesPath = path.resolve('./src/data/site-categories-content.json');

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

const productsData: ProductsByLanguage = readJson<ProductsByLanguage>(productsPath);

interface CategoryEntry {
  slugs: string[];
  title: string;
}

interface CategoriesJson {
  es: { categories: { categories: CategoryEntry[] } };
  en: { categories: { categories: CategoryEntry[] } };
}

const categoriesData = readJson<CategoriesJson>(categoriesPath);
const categoryEntries = categoriesData.es.categories.categories;

const localizedCategorySlugSets: Record<Lang, Set<string>> = {
  es: new Set(categoryEntries.map((category) => category.slugs[0]).filter(Boolean)),
  en: new Set(categoryEntries.map((category) => category.slugs[1]).filter(Boolean)),
};

function unique(urls: string[]): string[] {
  return [...new Set(urls)];
}

export function getProductSitemapUrls(): string[] {
  const urls = languages.flatMap((lang) => {
    const validCategorySlugs = localizedCategorySlugSets[lang];
    const products = productsData[lang] || [];

    return products.flatMap((product) => {
      const categorySlugs =
        product.categorySlug && validCategorySlugs.has(product.categorySlug)
          ? [product.categorySlug]
          : (product.categories || []).filter((categorySlug) => validCategorySlugs.has(categorySlug));

      return categorySlugs.map((categorySlug) => `${baseUrl}/${lang}/${categorySlug}/${product.slug}`);
    });
  });

  return unique(urls);
}

export function getCategorySitemapUrls(): string[] {
  const urls = categoryEntries.flatMap((category) => {
    const esSlug = category.slugs[0];
    const enSlug = category.slugs[1];

    return [
      esSlug ? `${baseUrl}/es/${esSlug}` : null,
      enSlug ? `${baseUrl}/en/${enSlug}` : null,
    ].filter(Boolean) as string[];
  });

  return unique(urls);
}

export function getHomeSitemapUrls(): string[] {
  const baseHomeUrls = languages.map((lang) => `${baseUrl}/${lang}/`);
  const sectionUrls = languages.flatMap((lang) =>
    homeSectionIds.map((sectionId) => `${baseUrl}/${lang}/#${sectionId}`)
  );

  return unique([...baseHomeUrls, ...sectionUrls]);
}

export function getAllSitemapUrls(): string[] {
  return unique([
    ...getHomeSitemapUrls(),
    ...getCategorySitemapUrls(),
    ...getProductSitemapUrls(),
  ]);
}
