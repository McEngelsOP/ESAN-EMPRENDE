import type { Business } from './business';
import { initialProducts, type Product } from './data';
import type { Review, Workspace } from './workspace';

/** Synthetic fixtures only. This module never reads storage or calls a service. */
export const SAMPLE_SET = 'esan-aea-v1' as const;
type SampleMarker = { sampleSet: typeof SAMPLE_SET };
type SampleBusiness = Business & SampleMarker;
type SampleReview = Review & SampleMarker;

export type SampleStoreInfo = SampleMarker & {
  id: string;
  name: string;
  owner: string;
  description: string;
  category: string;
  career: string;
  cycle: number;
  cover: string;
};

const store = (id: string, name: string, owner: string, category: string, description: string, career: string, cycle: number, cover: string): SampleStoreInfo => ({
  id: `sample-store-${id}`, name, owner, category, description, career, cycle, cover, sampleSet: SAMPLE_SET,
});

/** Names, academic information and stories below are all fictitious. */
const stores: SampleStoreInfo[] = [
  store('miga', 'Miga & Mood', 'Valeria Montes', 'Comida y bebidas', 'Repostería en pequeñas tandas para una pausa entre clases. En este ejemplo preparamos cookies y brownies por encargo.', 'Administración y Gerencia', 6, '/images/cookies.jpg'),
  store('entre-clases', 'Entre Clases', 'Diego Salazar', 'Moda y accesorios', 'Accesorios y merchandising para acompañar la vida universitaria. Un proyecto ficticio que diseña para grupos y promociones.', 'Marketing', 5, '/images/bag.jpg'),
  store('raiz', 'Raíz', 'Lucía Herrera', 'Hogar y bienestar', 'Plantas pequeñas y detalles para dar vida al escritorio. Cada propuesta de ejemplo incluye una guía sencilla de cuidados.', 'Ingeniería Industrial', 7, '/images/plant.jpg'),
  store('aurea', 'Áurea Studio', 'Camila Ríos', 'Moda y accesorios', 'Accesorios de líneas sencillas y colecciones pequeñas. Esta marca ficticia reúne piezas para usar todos los días.', 'Marketing', 4, '/images/jewelry.jpg'),
  store('pausa', 'Pausa Café', 'Mateo Vega', 'Comida y bebidas', 'Café para acompañar proyectos, conversaciones y buenas pausas. Las presentaciones y los precios son datos de demostración.', 'Economía', 6, '/images/coffee.jpg'),
  store('papel', 'Papel & Punto', 'Andrea Paredes', 'Arte y papelería', 'Papelería e identidad visual para ordenar lo que imaginas. Un taller ficticio con libretas, láminas y servicios creativos.', 'Administración y Marketing', 5, '/images/notebook.jpg'),
  store('nodo', 'Nodo Studio', 'Sebastián Campos', 'Soluciones tech', 'Páginas web y automatizaciones para emprendimientos que empiezan. Explicamos el alcance antes de proponer una solución.', 'Ingeniería de Sistemas', 8, 'tech'),
  store('circular', 'Circular Campus', 'Mariana León', 'Soluciones tech', 'Ideas colaborativas para aprovechar mejor lo que ya tenemos. Este proyecto ficticio busca validar soluciones con estudiantes.', 'Ingeniería de Sistemas', 6, 'idea'),
  store('trazo', 'Trazo Colectivo', 'Renato Flores', 'Servicios', 'Diseño y comunicación para proyectos estudiantiles. Un estudio ficticio que ayuda a convertir apuntes en presentaciones claras.', 'Diseño y Comunicación', 5, '/images/notebook.jpg'),
];

export const sampleStoreInfo: Record<string, SampleStoreInfo> = Object.fromEntries(stores.map(item => [item.name, item]));
export const sampleStoresById: Record<string, SampleStoreInfo> = Object.fromEntries(stores.map(item => [item.id, item]));

type OfferInput = Pick<Product, 'name' | 'category' | 'price' | 'image' | 'description' | 'available'>
  & Partial<Pick<Product, 'kind' | 'images' | 'fulfillment' | 'scope' | 'timeline' | 'collaborators' | 'stage'>>;

function offer(id: string, storeName: string, values: OfferInput): Product {
  const info = sampleStoreInfo[storeName];
  return {
    ...values,
    id: `sample-${id}`,
    brandId: info.id,
    store: info.name,
    owner: info.owner,
    sampleSet: SAMPLE_SET,
    status: values.available ? 'published' : 'paused',
  };
}

/** Catalogue fixtures stay separate from the editable publications of one business. */
export const sampleCatalog: Product[] = [
  offer('cookies', 'Miga & Mood', { name: 'Cookies de chocolate · pack de 3', category: 'Comida y bebidas', kind: 'Producto', price: 12, image: '/images/cookies.jpg', description: 'Cookies con trozos de chocolate, preparadas en pequeñas tandas. Pack ilustrativo de tres unidades; la fotografía es de referencia.', fulfillment: 'Ejemplo: coordinación previa y entrega en el campus.', available: true }),
  offer('brownies', 'Miga & Mood', { name: 'Brownies para compartir', category: 'Comida y bebidas', kind: 'Producto', price: 22, image: '/images/cookies.jpg', description: 'Una caja de cuatro brownies para compartir después de clases. Producto ficticio para probar el catálogo y sus filtros.', fulfillment: 'Ejemplo: pedidos con un día de anticipación.', available: true }),
  offer('mochila', 'Entre Clases', { name: 'Mochila para todos tus planes', category: 'Moda y accesorios', kind: 'Producto', price: 89, image: '/images/bag.jpg', description: 'Mochila de uso diario con espacio para apuntes y accesorios. Propuesta de ejemplo: no existe stock ni una venta asociada.', fulfillment: 'Ejemplo: consultar colores y coordinar entrega.', available: true }),
  offer('merch', 'Entre Clases', { name: 'Merch para tu grupo', category: 'Moda y accesorios', kind: 'Producto', price: 45, image: '/images/bag.jpg', description: 'Una propuesta ficticia de accesorios personalizados para grupos estudiantiles. El diseño final se definiría con el creador.', fulfillment: 'Ejemplo: producción por encargo, previa coordinación.', available: true }),
  offer('planta', 'Raíz', { name: 'Un poquito de verde', category: 'Hogar y bienestar', kind: 'Producto', price: 28, image: '/images/plant.jpg', description: 'Planta pequeña con maceta y una tarjeta de cuidados. Un detalle de ejemplo para acompañar el escritorio de estudio.', fulfillment: 'Ejemplo: recojo coordinado en el campus.', available: true }),
  offer('kit-verde', 'Raíz', { name: 'Kit para tu rincón de estudio', category: 'Hogar y bienestar', kind: 'Producto', price: 42, image: '/images/plant.jpg', description: 'Conjunto ilustrativo de planta, maceta y guía de cuidados. Está pausado para mostrar cómo se ve una propuesta no disponible.', fulfillment: 'Ejemplo pausado, sin entregas disponibles.', available: false }),
  offer('accesorios', 'Áurea Studio', { name: 'Detalles que te acompañan', category: 'Moda y accesorios', kind: 'Producto', price: 35, image: '/images/jewelry.jpg', description: 'Una selección ficticia de accesorios para los días de universidad. La imagen funciona como referencia del estilo de la marca.', fulfillment: 'Ejemplo: elección de modelo y entrega coordinada.', available: true }),
  offer('pulseras', 'Áurea Studio', { name: 'Pulseras para combinar', category: 'Moda y accesorios', kind: 'Producto', price: 24, image: '/images/jewelry.jpg', description: 'Pack ilustrativo de pulseras de diseño sencillo. Permite probar favoritos, filtros de precio y el perfil del emprendimiento.', fulfillment: 'Ejemplo: consultar modelos antes de coordinar.', available: true }),
  offer('cafe', 'Pausa Café', { name: 'Café para una buena pausa', category: 'Comida y bebidas', kind: 'Producto', price: 32, image: '/images/coffee.jpg', description: 'Presentación ficticia de café tostado de 250 gramos. Las opciones de molienda y el origen se muestran solo como ejemplo.', fulfillment: 'Ejemplo: coordinar molienda y recojo.', available: true }),
  offer('cafe-compartir', 'Pausa Café', { name: 'Una pausa para compartir', category: 'Comida y bebidas', kind: 'Producto', price: 54, image: '/images/coffee.jpg', description: 'Pack ilustrativo de café para compartir con tu grupo de estudio. No corresponde a una campaña ni una promoción real.', fulfillment: 'Ejemplo: presentación y entrega por coordinación.', available: true }),
  offer('libreta', 'Papel & Punto', { name: 'Aquí empiezan tus ideas', category: 'Arte y papelería', kind: 'Producto', price: 24, image: '/images/notebook.jpg', description: 'Libreta ficticia para apuntes, dibujos y proyectos. Una publicación de ejemplo con información breve y precio en soles.', fulfillment: 'Ejemplo: elegir diseño y coordinar recojo.', available: true }),
  offer('laminas', 'Papel & Punto', { name: 'Láminas para organizarte', category: 'Arte y papelería', kind: 'Producto', price: 18, image: '/images/notebook.jpg', description: 'Láminas ilustrativas para planificar entregas y tareas. Este ejemplo está agotado para probar el estado de disponibilidad.', fulfillment: 'Ejemplo agotado, sin stock real.', available: false }),
  offer('web', 'Nodo Studio', { name: 'Tu primera página web', category: 'Soluciones tech', kind: 'Servicio', price: 250, image: 'tech', description: 'Servicio ficticio para presentar un emprendimiento en una página clara y adaptable al celular.', scope: 'Una landing de hasta cinco secciones, formulario de contacto y una ronda de ajustes. No incluye dominio ni pagos.', timeline: 'Ejemplo: de 7 a 10 días después de recibir el contenido.', available: true }),
  offer('automatizacion', 'Nodo Studio', { name: 'Automatiza esas tareas', category: 'Soluciones tech', kind: 'Servicio', price: 0, image: 'tech', description: 'Propuesta ilustrativa para reducir tareas repetitivas en un pequeño negocio. El precio se define según el alcance.', scope: 'Revisión de un proceso, propuesta de automatización y prototipo de una tarea acordada.', timeline: 'Ejemplo: diagnóstico inicial de 2 días; ejecución a coordinar.', available: true }),
  offer('apuntes', 'Circular Campus', { name: 'Una segunda vida a tus apuntes', category: 'Soluciones tech', kind: 'Idea', price: 0, image: 'idea', description: 'Idea ficticia para intercambiar materiales de estudio propios y reducir impresiones. Busca validar necesidades con estudiantes.', stage: 'Validación', collaborators: 'Estudiantes de diseño, desarrollo y comunicación que quieran entrevistar usuarios y probar un prototipo.', available: true }),
  offer('campus-circular', 'Circular Campus', { name: 'Un campus que reutiliza', category: 'Hogar y bienestar', kind: 'Idea', price: 0, image: '/images/plant.jpg', description: 'Propuesta ficticia para encontrar un nuevo uso a objetos universitarios en buen estado mediante encuentros coordinados.', stage: 'Exploración', collaborators: 'Personas interesadas en sostenibilidad, logística y diseño de experiencias para definir un primer piloto.', available: true }),
  offer('identidad', 'Trazo Colectivo', { name: 'Identidad para tu emprendimiento', category: 'Servicios', kind: 'Servicio', price: 120, image: '/images/notebook.jpg', description: 'Servicio ficticio de identidad visual inicial para un proyecto que recién empieza.', scope: 'Logo tipográfico, paleta de color y una plantilla de publicación. Incluye dos propuestas iniciales y una revisión.', timeline: 'Ejemplo: de 5 a 7 días hábiles, previa coordinación.', available: true }),
  offer('presentaciones', 'Trazo Colectivo', { name: 'Dale forma a tu presentación', category: 'Servicios', kind: 'Servicio', price: 65, image: '/images/notebook.jpg', description: 'Servicio ilustrativo para ordenar el contenido y diseño de una presentación estudiantil.', scope: 'Diseño de hasta diez diapositivas con contenido proporcionado por el estudiante y una ronda de ajustes.', timeline: 'Ejemplo: de 3 a 4 días después de recibir el contenido.', available: true }),
];

const demoBusiness: SampleBusiness = {
  id: 'sample-business-entre-apuntes',
  name: 'Taller Entre Apuntes',
  owner: 'Sofía Torres · perfil ficticio',
  description: 'Un taller ficticio de papelería y diseño para acompañar tus proyectos entre clases. Úsalo para probar la edición del perfil y de sus publicaciones.',
  delivery: 'Ejemplo: entregas coordinadas en el campus y servicios por acuerdo previo.',
  contact: '',
  category: 'Arte y papelería',
  cover: '/images/notebook.jpg',
  sampleSet: SAMPLE_SET,
};

const ownOffer = (id: string, values: OfferInput): Product => ({
  ...values,
  id: `sample-own-${id}`,
  brandId: demoBusiness.id,
  store: demoBusiness.name,
  owner: demoBusiness.owner,
  sampleSet: SAMPLE_SET,
  status: values.available ? 'published' : 'paused',
});

const ownProducts: Product[] = [
  ownOffer('libreta', { name: 'Libreta para nuevas ideas', kind: 'Producto', category: 'Arte y papelería', price: 26, image: '/images/notebook.jpg', description: 'Una libreta de ejemplo para tus proyectos. Puedes editar su nombre, precio y disponibilidad sin afectar datos reales.', fulfillment: 'Coordinación ficticia en el campus, con un día de anticipación.', available: true }),
  ownOffer('planificador', { name: 'Planificador entre clases', kind: 'Producto', category: 'Arte y papelería', price: 18, image: '/images/notebook.jpg', description: 'Planificador semanal ficticio para ordenar entregas y actividades. Este ejemplo empieza agotado para probar su reactivación.', fulfillment: 'Ejemplo agotado. Reactívalo para probar el cambio de estado.', available: false }),
  ownOffer('identidad', { name: 'Diseño para tu primera marca', kind: 'Servicio', category: 'Servicios', price: 90, image: '/images/notebook.jpg', description: 'Servicio ficticio de diseño inicial para una idea estudiantil. Los campos de alcance y plazo también se pueden editar.', scope: 'Una propuesta de logo, una paleta y una plantilla editable. Una ronda de ajustes.', timeline: 'Ejemplo: 5 días hábiles después de recibir la información.', available: true }),
  ownOffer('plantillas', { name: 'Plantillas para tu proyecto', kind: 'Servicio', category: 'Servicios', price: 0, image: 'tech', description: 'Servicio ficticio que se cotiza según el número de plantillas y el contenido del proyecto.', scope: 'Diagnóstico y diseño de plantillas de presentación o publicaciones, con alcance por acordar.', timeline: 'Ejemplo: diagnóstico de 1 día; entrega según alcance.', available: true }),
  ownOffer('biblioteca', { name: 'Biblioteca de recursos compartidos', kind: 'Idea', category: 'Soluciones tech', price: 0, image: 'idea', description: 'Idea ficticia para reunir plantillas y recursos creados por estudiantes, con permisos claros para reutilizarlos.', stage: 'Prototipo', collaborators: 'Estudiantes de diseño y desarrollo para probar una biblioteca pequeña de recursos propios.', available: true }),
];

const review = (id: string, productId: string, rating: number, author: string, comment: string, day: number): SampleReview => ({
  id: `sample-review-${id}`, productId, rating, author, comment,
  createdAt: `2026-10-${String(day).padStart(2, '0')}T12:00:00.000Z`, sampleSet: SAMPLE_SET,
});

const demoReviews: SampleReview[] = [
  review('cookies-1', 'sample-cookies', 5, 'Paula · ejemplo', 'Reseña ficticia: la descripción permite entender qué incluye el pack y cómo se coordinaría.', 24),
  review('cookies-2', 'sample-cookies', 4, 'Luis · ejemplo', 'Comentario de demostración para ver el promedio de estrellas y la lista de reseñas.', 26),
  review('web', 'sample-web', 5, 'Valentina · ejemplo', 'Reseña ficticia: el alcance y el plazo ayudan a comparar este servicio.', 27),
  review('planta', 'sample-planta', 4, 'Bruno · ejemplo', 'Opinión simulada para probar el detalle de una propuesta. No acredita una compra.', 25),
  review('own-libreta', 'sample-own-libreta', 5, 'Daniela · ejemplo', 'Comentario ficticio para revisar la presentación de la tienda y sus publicaciones.', 28),
  review('own-identidad', 'sample-own-identidad', 4, 'Joaquín · ejemplo', 'Reseña de ejemplo: los entregables del servicio se presentan con claridad.', 29),
];

const initialSaved = ['sample-cookies', 'sample-web', 'sample-apuntes'];
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

/** A marker, not a mutable name or an ID prefix, determines which records may be removed. */
export function isSampleRecord(value: unknown): value is SampleMarker {
  return value !== null && typeof value === 'object' && (value as { sampleSet?: unknown }).sampleSet === SAMPLE_SET;
}

function appendById<T extends { id: string }>(current: T[], incoming: T[]): T[] {
  const ids = new Set(current.map(item => item.id));
  return [...current, ...incoming.filter(item => !ids.has(item.id)).map(clone)];
}

/** Adds fixtures without replacing an existing profile, publication or review. */
export function addDemoData(current: Workspace): Workspace {
  const business = current.business ?? clone(demoBusiness);
  const canAddOwn = isSampleRecord(business);
  const additions = canAddOwn ? ownProducts.map(product => ({ ...product, store: business.name, owner: business.owner, brandId: business.id })) : [];
  const products = appendById(current.products, additions);
  const visibleIds = new Set([...sampleCatalog, ...products].map(product => product.id));
  return {
    ...current,
    business,
    products,
    saved: [...new Set([...current.saved, ...initialSaved])],
    reviews: appendById(current.reviews, demoReviews.filter(item => visibleIds.has(item.productId))),
    sampleCatalogHidden: false,
    demoInitialized: true,
    sampleDatasetVersion: SAMPLE_SET,
  };
}

export function createDemoWorkspace(): Workspace {
  return addDemoData({ business: null, products: [], saved: [], reviews: [] });
}

/** Removes fixtures only; user-authored records and unknown workspace fields remain intact. */
export function removeDemoData(current: Workspace): Workspace {
  const userProducts = current.products.filter(item => !isSampleRecord(item));
  const userIds = new Set(userProducts.map(item => item.id));
  const sampleIds = new Set([...sampleCatalog.map(item => item.id), ...initialProducts.map(item => item.id), ...current.products.filter(isSampleRecord).map(item => item.id)]);
  let business = current.business;
  if (business && isSampleRecord(business)) {
    const sampleBusiness = business;
    const hasOwnPublications = userProducts.some(item => (sampleBusiness.id && item.brandId === sampleBusiness.id) || item.store === sampleBusiness.name);
    if (hasOwnPublications) {
      // The user has built on this profile: retain its identity but stop treating it as a fixture.
      const { sampleSet: _sampleSet, ...promoted } = sampleBusiness;
      business = promoted;
    } else business = null;
  }
  return {
    ...current,
    business,
    products: userProducts,
    saved: current.saved.filter(id => !sampleIds.has(id) || userIds.has(id)),
    reviews: current.reviews.filter(item => !isSampleRecord(item)),
    sampleCatalogHidden: true,
    demoInitialized: true,
  };
}

/** Restoring the public examples does not replace or re-seed the editable business. */
export function restoreDemoCatalog(current: Workspace): Workspace {
  return { ...current, sampleCatalogHidden: false, demoInitialized: true };
}

export type DemoMetrics = {
  sampleSet: typeof SAMPLE_SET;
  label: 'Actividad simulada';
  visits: number;
  contacts: number;
  saves: number;
  days: { label: string; visits: number }[];
};

/** Render only in demoMode. These values are synthetic and never measure site activity. */
export function getDemoMetrics(business: Business | null): DemoMetrics | null {
  if (!isSampleRecord(business)) return null;
  return {
    sampleSet: SAMPLE_SET,
    label: 'Actividad simulada',
    visits: 207,
    contacts: 24,
    saves: 31,
    days: [
      { label: 'Lun', visits: 18 }, { label: 'Mar', visits: 26 }, { label: 'Mié', visits: 21 },
      { label: 'Jue', visits: 34 }, { label: 'Vie', visits: 41 }, { label: 'Sáb', visits: 38 }, { label: 'Dom', visits: 29 },
    ],
  };
}
