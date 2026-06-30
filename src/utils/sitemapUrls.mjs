import fs from 'fs';
import path from 'path';

const baseUrl = 'https://cancundrink.com';
const languages = ['es', 'en'];
const homeSectionIds = ['hero', 'skills', 'about-koko', 'categories', 'reviews', 'places', 'questions'];

const productsPath = path.resolve('./src/data/products/products.json');
const categoriesPath = path.resolve('./src/data/site-categories-content.json');

/**
 * @template T
 * @param {string} filePath
 * @returns {T}
 */
function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

/** @type {{ products: Array<{ slug: string; categories: string[] }> }} */
const productsData = readJson(productsPath);

/** @type {{ es: { categories: { categories: Array<{ slugs: string[] }> } } }} */
const categoriesData = readJson(categoriesPath);

const categoryEntries = categoriesData.es.categories.categories;

const localizedCategorySlugSets = {
  es: new Set(categoryEntries.map((category) => category.slugs[0]).filter(Boolean)),
  en: new Set(categoryEntries.map((category) => category.slugs[1]).filter(Boolean)),
};

/**
 * @param {string[]} urls
 * @returns {string[]}
 */
function unique(urls) {
  return [...new Set(urls)];
}

export function getProductSitemapUrls() {
  const urls = languages.flatMap((lang) => {
    const validCategorySlugs = localizedCategorySlugSets[lang];

    return productsData.products.flatMap((product) => {
      const localizedCategorySlugs = product.categories.filter((categorySlug) => validCategorySlugs.has(categorySlug));

      return localizedCategorySlugs.map((categorySlug) => `${baseUrl}/${lang}/${categorySlug}/${product.slug}`);
    });
  });

  return unique(urls);
}

export function getCategorySitemapUrls() {
  const urls = categoryEntries.flatMap((category) => {
    const esSlug = category.slugs[0];
    const enSlug = category.slugs[1];

    return [
      esSlug ? `${baseUrl}/es/${esSlug}` : null,
      enSlug ? `${baseUrl}/en/${enSlug}` : null,
    ].filter(Boolean);
  });

  return unique(urls);
}

export function getHomeSitemapUrls() {
  const baseHomeUrls = languages.map((lang) => `${baseUrl}/${lang}/`);
  const sectionUrls = languages.flatMap((lang) =>
    homeSectionIds.map((sectionId) => `${baseUrl}/${lang}/#${sectionId}`)
  );

  return unique([...baseHomeUrls, ...sectionUrls]);
}

export function getAllSitemapUrls() {
  return unique([
    ...getHomeSitemapUrls(),
    ...getCategorySitemapUrls(),
    ...getProductSitemapUrls(),
  ]);
}
