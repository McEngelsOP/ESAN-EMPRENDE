import { test, expect } from '@playwright/test';
import type { Business } from '../src/lib/business';
import type { Product } from '../src/lib/data';
import { parseWorkspace, type Workspace } from '../src/lib/workspace';
import { SAMPLE_SET, sampleCatalog, sampleStoreInfo, createDemoWorkspace, addDemoData, removeDemoData, restoreDemoCatalog, isSampleRecord, getDemoMetrics } from '../src/lib/demo-content';

const business: Business = { id: 'user-business', name: 'Mi taller real', owner: 'Usuario', description: 'Una descripción escrita por el usuario para conservar.', delivery: 'A coordinar', contact: '' };
const product: Product = { id: 'user-product', brandId: business.id, name: 'Mi publicación', store: business.name, owner: business.owner, category: 'Arte y papelería', kind: 'Producto', description: 'Una propuesta creada por el usuario.', price: 20, image: '', available: true };
const userWorkspace = (): Workspace => ({ business: { ...business }, products: [{ ...product }], saved: ['user-product'], reviews: [{ id: 'user-review', productId: 'user-product', rating: 4, author: 'Usuario', comment: 'Este comentario debe conservarse.', createdAt: '2026-10-29' }], extraData: { keep: true } });

test('el catálogo sintético tiene identidad, variedad y estados completos', () => {
  expect(sampleCatalog).toHaveLength(18);
  expect(Object.keys(sampleStoreInfo)).toHaveLength(9);
  expect(new Set(sampleCatalog.map(item => item.id)).size).toBe(sampleCatalog.length);
  expect(sampleCatalog.filter(item => !item.available)).toHaveLength(2);
  for (const item of sampleCatalog) {
    expect(isSampleRecord(item)).toBe(true);
    expect(item.id).toMatch(/^sample-/);
    expect(item.brandId).toBe(sampleStoreInfo[item.store].id);
    if (item.kind === 'Servicio') { expect(item.scope).toBeTruthy(); expect(item.timeline).toBeTruthy(); }
    if (item.kind === 'Idea') { expect(item.collaborators).toBeTruthy(); expect(item.stage).toBeTruthy(); expect(item.price).toBe(0); }
  }
});

test('la siembra es idempotente y no comparte referencias mutables', () => {
  const first = createDemoWorkspace();
  expect(first.products).toHaveLength(5);
  expect(first.saved).toHaveLength(3);
  expect(first.reviews).toHaveLength(6);
  expect(first.demoInitialized).toBe(true);
  expect(addDemoData(first)).toEqual(first);
  first.products[0].name = 'Edición local';
  expect(createDemoWorkspace().products[0].name).not.toBe('Edición local');
  expect(first.products.every(item => item.brandId === first.business?.id)).toBe(true);
});

test('cargar ejemplos no sustituye el negocio ni añade publicaciones propias de otra marca', () => {
  const original = userWorkspace();
  const seeded = addDemoData(original);
  expect(seeded.business).toEqual(original.business);
  expect(seeded.products).toEqual(original.products);
  expect(seeded.reviews.some(item => item.productId.startsWith('sample-own-'))).toBe(false);
  expect(seeded.extraData).toEqual({ keep: true });
  expect(addDemoData(seeded)).toEqual(seeded);
});

test('quitar ejemplos conserva contenido y campos del usuario, incluidas reseñas sobre ejemplos', () => {
  const seeded = createDemoWorkspace();
  const current: Workspace = {
    ...seeded,
    products: [...seeded.products, { ...product }],
    saved: [...seeded.saved, product.id],
    reviews: [...seeded.reviews, { id: 'user-review', productId: 'sample-cookies', rating: 5, author: 'Usuario', comment: 'Reseña escrita por el usuario.', createdAt: '2026-10-29' }],
    extraData: { keep: true },
  };
  const cleaned = removeDemoData(current);
  expect(cleaned.business).toBeNull();
  expect(cleaned.products).toEqual([product]);
  expect(cleaned.saved).toEqual([product.id]);
  expect(cleaned.reviews).toHaveLength(1);
  expect(cleaned.reviews[0].id).toBe('user-review');
  expect(cleaned.extraData).toEqual({ keep: true });
  expect(cleaned.sampleCatalogHidden).toBe(true);
  expect(cleaned.demoInitialized).toBe(true);
  expect(removeDemoData(cleaned)).toEqual(cleaned);
});

test('quitar ejemplos respeta un identificador reservado que ya pertenecía a un registro del usuario', () => {
  const own = { ...product, id: 'sample-cookies' };
  const current = { ...userWorkspace(), products: [own], saved: [own.id] };
  expect(removeDemoData(current).products).toEqual([own]);
  expect(removeDemoData(current).saved).toEqual([own.id]);
  expect(removeDemoData(current).business).toEqual(business);
});

test('conserva y promueve el perfil si tiene publicaciones creadas por el usuario', () => {
  const seeded = createDemoWorkspace();
  const own = { ...product, brandId: seeded.business!.id, store: seeded.business!.name };
  const cleaned = removeDemoData({ ...seeded, products: [...seeded.products, own] });
  expect(cleaned.products).toEqual([own]);
  expect(cleaned.business?.id).toBe(seeded.business!.id);
  expect(cleaned.business?.name).toBe(seeded.business!.name);
  expect(isSampleRecord(cleaned.business)).toBe(false);
  expect(getDemoMetrics(cleaned.business)).toBeNull();
  expect(addDemoData(cleaned).products).toEqual([own]);

  const byName = { ...own, brandId: undefined };
  expect(removeDemoData({ ...seeded, products: [...seeded.products, byName] }).business?.id).toBe(seeded.business!.id);
});

test('quitar ejemplos limpia favoritos del catálogo anterior sin borrar un registro propio con el mismo ID', () => {
  const current = { ...userWorkspace(), saved: ['cookies', 'bag', product.id] };
  expect(removeDemoData(current).saved).toEqual([product.id]);
  const own = { ...product, id: 'cookies' };
  const collision = { ...current, products: [...current.products, own] };
  expect(removeDemoData(collision).saved).toEqual(['cookies', product.id]);
  expect(removeDemoData(collision).products).toEqual(collision.products);
});

test('restaurar solo el catálogo no resucita la tienda ni cambia los registros del usuario', () => {
  const original = userWorkspace();
  const cleaned = removeDemoData(addDemoData(original));
  const restored = restoreDemoCatalog(cleaned);
  expect(restored.sampleCatalogHidden).toBe(false);
  expect(restored.business).toEqual(original.business);
  expect(restored.products).toEqual(original.products);
  expect(restored.reviews).toEqual(original.reviews);
  expect(restoreDemoCatalog(restored)).toEqual(restored);
});

test('exportación e importación conservan marcadores y la decisión de no resembrar', () => {
  const sample = createDemoWorkspace();
  const imported = parseWorkspace(JSON.stringify(sample));
  expect(isSampleRecord(imported.business)).toBe(true);
  expect(imported.products.every(isSampleRecord)).toBe(true);
  expect(imported.reviews.every(isSampleRecord)).toBe(true);
  const cleaned = parseWorkspace(JSON.stringify(removeDemoData(imported)));
  expect(cleaned.sampleCatalogHidden).toBe(true);
  expect(cleaned.demoInitialized).toBe(true);
  expect(cleaned.products).toEqual([]);
});

test('las métricas solo existen para el perfil marcado y sus totales son coherentes', () => {
  expect(getDemoMetrics(null)).toBeNull();
  expect(getDemoMetrics(business)).toBeNull();
  const seeded = createDemoWorkspace();
  const metrics = getDemoMetrics(seeded.business)!;
  expect(metrics.label).toBe('Actividad simulada');
  expect(metrics.sampleSet).toBe(SAMPLE_SET);
  expect(metrics.days.reduce((sum, day) => sum + day.visits, 0)).toBe(metrics.visits);
  expect(getDemoMetrics(removeDemoData(seeded).business)).toBeNull();
});
