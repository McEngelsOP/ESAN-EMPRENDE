import type { Business } from './business';
import type { Product } from './data';

export type Review = {
  sampleSet?: string;
  id: string;
  productId: string;
  rating: number;
  author: string;
  comment: string;
  createdAt: string;
};

export type Workspace = {
  products: Product[];
  saved: string[];
  business: Business | null;
  reviews: Review[];
  [key: string]: unknown;
};

const STORAGE_PREFIX = 'esan-emprende-demo-v1:';
const PREVIEW_KEY = `${STORAGE_PREFIX}interface-preview`;
const LEGACY_PREVIEW_KEY = `${STORAGE_PREFIX}standalone-preview`;
const EMPTY_WORKSPACE: Workspace = { products: [], saved: [], business: null, reviews: [] };

export function emptyWorkspace(): Workspace {
  return { ...EMPTY_WORKSPACE };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function normalizeImage(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  return value.replace(/^\.\/assets\/([^/]+)\.webp$/i, '/images/$1.jpg');
}

function normalizeProduct(value: unknown): Product {
  if (!isRecord(value) || !isString(value.id) || !value.id) {
    throw new Error('Formato de espacio inválido.');
  }
  const status = value.status;
  const unavailable = status === 'paused' || status === 'deleted';
  const normalizedImage = normalizeImage(value.image);
  const product: Record<string, unknown> = {
    ...value,
    name: isString(value.name) ? value.name : '',
    store: isString(value.store) ? value.store : '',
    owner: isString(value.owner) ? value.owner : '',
    description: isString(value.description) ? value.description : '',
    category: isString(value.category) ? value.category : '',
    image: isString(normalizedImage) ? normalizedImage : '',
    price: typeof value.price === 'number' && Number.isFinite(value.price) ? value.price : 0,
    available: unavailable ? false : value.available !== false,
  };
  if (!isString(product.fulfillment) && isString(product.delivery)) product.fulfillment = product.delivery;
  if (!isString(product.scope) && isString(product.includes)) product.scope = product.includes;
  return product as Product;
}

function normalizeBusiness(value: unknown): Business {
  if (!isRecord(value)) throw new Error('Formato de espacio inválido.');
  return {
    ...value,
    name: isString(value.name) ? value.name : '',
    owner: isString(value.owner) ? value.owner : '',
    description: isString(value.description) ? value.description : '',
    delivery: isString(value.delivery) ? value.delivery : '',
    contact: isString(value.contact) ? value.contact : '',
    cover: normalizeImage(value.cover ?? value.image) as string | undefined,
    logo: normalizeImage(value.logo) as string | undefined,
  } as Business;
}

function normalizeReview(value: unknown): Review {
  if (!isRecord(value)
    || !isString(value.id) || !value.id
    || !isString(value.productId)
    || typeof value.rating !== 'number' || !Number.isInteger(value.rating) || value.rating < 1 || value.rating > 5
    || (value.comment !== undefined && !isString(value.comment))
    || !isString(value.comment) || value.comment.trim().length < 3 || value.comment.length > 500) {
    throw new Error('Formato de espacio inválido.');
  }
  return {
    ...value,
    author: isString(value.author) ? value.author : 'Anónimo',
    createdAt: isString(value.createdAt) ? value.createdAt : '',
  } as Review;
}

/** Parses and normalizes a stored workspace without discarding unknown envelope or record fields. */
export function parseWorkspace(text: string): Workspace {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Formato de espacio inválido.');
  }
  if (!isRecord(parsed)) throw new Error('Formato de espacio inválido.');

  const hasWorkspaceField = ['products', 'saved', 'business', 'reviews'].some(key => key in parsed);
  if (!hasWorkspaceField) throw new Error('Formato de espacio inválido.');
  if ('products' in parsed && !Array.isArray(parsed.products)) throw new Error('Formato de espacio inválido.');
  if ('saved' in parsed && !Array.isArray(parsed.saved)) throw new Error('Formato de espacio inválido.');
  if ('reviews' in parsed && !Array.isArray(parsed.reviews)) throw new Error('Formato de espacio inválido.');
  if ('business' in parsed && parsed.business !== null && !isRecord(parsed.business)) throw new Error('Formato de espacio inválido.');

  try {
    return {
      ...parsed,
      products: (Array.isArray(parsed.products) ? parsed.products : []).map(normalizeProduct),
      saved: (Array.isArray(parsed.saved) ? parsed.saved : []).filter(isString),
      business: parsed.business === null || parsed.business === undefined ? null : normalizeBusiness(parsed.business),
      reviews: (Array.isArray(parsed.reviews) ? parsed.reviews : []).map(normalizeReview),
    } as Workspace;
  } catch {
    throw new Error('Formato de espacio inválido.');
  }
}

function mergeById<T extends { id: string }>(current: T[], incoming: T[]): T[] {
  const result = [...current];
  const seen = new Set(current.map(item => item.id));
  for (const item of incoming) {
    if (!seen.has(item.id)) {
      result.push(item);
      seen.add(item.id);
    }
  }
  return result;
}

/** Keeps current records on ID collisions while appending distinct incoming records. */
export function mergeWorkspace(current: Workspace, incoming: Workspace): Workspace {
  const merged: Workspace = { ...incoming, ...current };
  merged.products = mergeById(current.products, incoming.products);
  merged.reviews = mergeById(current.reviews, incoming.reviews);
  merged.saved = [...new Set([...current.saved, ...incoming.saved])];
  merged.business = current.business && incoming.business
    ? { ...incoming.business, ...current.business }
    : current.business ?? incoming.business;
  return merged;
}

/** Reads the selected workspace and, for preview callers only, merges the standalone demo data. */
export function readWorkspace(key: string, legacy: boolean): Workspace {
  let current = emptyWorkspace();
  let text: string | null = null;
  try {
    text = globalThis.localStorage?.getItem(key) ?? null;
  } catch {
    // Keep the in-memory empty workspace if browser storage is unavailable.
  }
  if (text !== null) current = parseWorkspace(text);

  if (!legacy || key !== PREVIEW_KEY || current.legacyImported === true) return current;
  try {
    const text = globalThis.localStorage?.getItem(LEGACY_PREVIEW_KEY);
    if (text !== null && text !== undefined) current = { ...mergeWorkspace(current, parseWorkspace(text)), legacyImported: true };
  } catch {
    // Legacy data remains untouched; malformed records are not imported.
  }
  return current;
}

export function norm(text: string): string {
  return String(text ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function validPhone(value: unknown): boolean {
  const phone = String(value ?? '').trim();
  return /^(?:\+?51[\s-]?)?9(?:[\d][\s-]?){7}\d$/.test(phone);
}

export function validEmail(value: unknown): boolean {
  return /^[^\s@]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(String(value ?? '').trim());
}

export function validSocial(value: unknown): boolean {
  try {
    const url = new URL(String(value ?? '').trim());
    return (url.protocol === 'https:' || url.protocol === 'http:') && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function contactLinks(business: Business, product?: Product): { label: string; href: string }[] {
  if (product && (product.available === false || product.status === 'paused' || product.status === 'deleted')) return [];
  const name = business.name || 'el emprendimiento';
  const message = product?.kind === 'Idea'
    ? `Hola, vi la idea «${product.name}» de ${name} en ESAN Emprende y me gustaría colaborar.`
    : `Hola, vi ${product ? `«${product.name}» de ` : ''}${name} en ESAN Emprende y quisiera más información.`;
  const links: { label: string; href: string }[] = [];

  if (validPhone(business.whatsapp)) {
    const digits = String(business.whatsapp).replace(/\D/g, '').slice(-9);
    links.push({ label: 'WhatsApp', href: `https://wa.me/51${digits}?text=${encodeURIComponent(message)}` });
  } else if (validPhone(business.contact)) {
    const digits = business.contact.replace(/\D/g, '').slice(-9);
    links.push({ label: 'WhatsApp', href: `https://wa.me/51${digits}?text=${encodeURIComponent(message)}` });
  }

  if (validEmail(business.email)) {
    links.push({ label: 'Enviar correo', href: `mailto:${encodeURIComponent(business.email!.trim()).replace('%40','@')}?subject=${encodeURIComponent('Consulta en ESAN Emprende')}&body=${encodeURIComponent(message)}` });
  } else if (validEmail(business.contact)) {
    links.push({ label: 'Enviar correo', href: `mailto:${encodeURIComponent(business.contact.trim()).replace('%40','@')}?subject=${encodeURIComponent('Consulta en ESAN Emprende')}&body=${encodeURIComponent(message)}` });
  }

  if (validSocial(business.social)) links.push({ label: 'Red social', href: new URL(business.social!.trim()).toString() });
  return links;
}
