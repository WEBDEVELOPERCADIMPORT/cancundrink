import type { Lang } from '../i18n/config.i18n';
import type { Product } from '../types/product';
import categoriesContent from '../data/site-categories-content.json';

export const BACKEND_CONFIG = {
  baseUrl: (typeof process !== 'undefined' && process.env?.BACKEND_API_URL) || '',
  apiKey: (typeof process !== 'undefined' && process.env?.BACKEND_API_KEY) || '',
};

interface BackendItemWrapper {
  id: string;
  data: Product;
  createdAt?: string;
  updatedAt?: string;
}

interface BackendApiResponse {
  status: string;
  message?: string;
  items?: BackendItemWrapper[];
  data?: BackendItemWrapper[] | BackendItemWrapper;
}

/**
 * Normaliza o resuelve el slug de la categoría para el idioma solicitado.
 * Por ejemplo: si en inglés se pasa 'leches-coco', se resuelve a 'coconut-milks'.
 */
export function getCategorySlugForLang(categorySlug: string, lang: Lang): string {
  if (!categorySlug) return '';

  const categories = categoriesContent[lang]?.categories?.categories || categoriesContent.es?.categories?.categories || [];
  const found = categories.find((c: { slugs: string[] }) => c.slugs.includes(categorySlug));

  if (found && Array.isArray(found.slugs)) {
    // slugs[0] = es, slugs[1] = en
    if (lang === 'es' && found.slugs[0]) {
      return found.slugs[0];
    }
    if (lang === 'en' && found.slugs[1]) {
      return found.slugs[1];
    }
  }

  return categorySlug;
}

/**
 * Realiza una petición GET al backend central de contenido para una colección (products-es o products-en)
 * aplicando los filtros dinámicos mediante query params.
 */
export async function fetchFromBackend(
  lang: Lang,
  queryParams: Record<string, string | number | boolean | undefined> = {}
): Promise<Product[]> {
  const collectionName = `products-${lang}`;
  const url = new URL(`${BACKEND_CONFIG.baseUrl}/${collectionName}`);

  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'x-api-key': BACKEND_CONFIG.apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`[Backend API] Request to ${url.toString()} failed with status ${response.status}`);
      return [];
    }

    const json: BackendApiResponse = await response.json();
    const rawItems: BackendItemWrapper[] = json.items || (Array.isArray(json.data) ? json.data : []);

    return rawItems
      .map((item) => item?.data)
      .filter((p): p is Product => Boolean(p && typeof p === 'object'));
  } catch (error) {
    console.error(`[Backend API] Error fetching from ${url.toString()}:`, error);
    return [];
  }
}

/**
 * Obtiene los productos por categoría directamente desde el backend central
 * enviando el categoryslug en el idioma correspondiente.
 */
export async function getProductsByCategoryFromBackend(
  lang: Lang,
  categorySlug: string
): Promise<Product[]> {
  const resolvedCategorySlug = getCategorySlugForLang(categorySlug, lang);

  return await fetchFromBackend(lang, {
    categoryslug: resolvedCategorySlug,
  });
}

/**
 * Obtiene un producto por su id mediante query params (?id=...)
 * directamente desde la API central.
 */
export async function getProductByIdFromBackend(
  lang: Lang,
  id: number | string
): Promise<Product | null> {
  const products = await fetchFromBackend(lang, { id });
  return products[0] ?? null;
}

/**
 * Obtiene un producto por slug (o id numérico) mediante query params
 * directamente desde la API central.
 */
export async function getProductBySlugFromBackend(
  lang: Lang,
  productSlug: string,
  categorySlug?: string
): Promise<Product | null> {
  // Si el parámetro recibido es un ID numérico, buscar usando query params ?id=
  if (!isNaN(Number(productSlug)) && productSlug.trim() !== '') {
    return getProductByIdFromBackend(lang, Number(productSlug));
  }

  // Si es un slug de texto, buscar por ?slug= en el backend
  const products = await fetchFromBackend(lang, { slug: productSlug });

  if (products.length > 0) {
    return products[0];
  }

  // Si no se encontró por slug directamente y se tiene categoría, probar buscar por categoría
  if (categorySlug) {
    const resolvedCat = getCategorySlugForLang(categorySlug, lang);
    const categoryProducts = await fetchFromBackend(lang, { categoryslug: resolvedCat });
    const matched = categoryProducts.find((p) => p.slug === productSlug);
    if (matched) {
      return matched;
    }
  }

  return null;
}
