# ESAN Emprende

Vitrina estudiantil de productos, servicios e ideas. Aplicación Next.js con React, TypeScript y Supabase Auth preparado para una fase posterior. Los datos de esta versión son locales y de demostración. El login sigue desactivado por decisión del usuario.

## Aplicación que se construye y despliega

Vercel usa el package.json de la raíz, el preset Next.js y `npm run build`. La entrada es src/app/page.tsx. El directorio `demo-sites/esan-emprende/` contiene una demo HTML independiente que se inspeccionó y usó como referencia funcional; no sustituye al proyecto Next.js.

```sh
npm ci
npm run dev
```

Node.js 20.9 o posterior. Para comprobar el proyecto:

```sh
npm run build
npm run typecheck
npm test
```

Playwright comprueba escritorio y móvil con @sparticuz/chromium y arranca un servidor de producción temporal en el puerto 3000 si está libre. No hace falta descargar otro navegador.

## Funciones de esta versión

- Inicio con destacados seleccionables, pausa y movimiento reducido.
- Búsqueda por nombre, creador, descripción, categoría y marca, sin distinguir acentos.
- Filtros de tipo, categoría y disponibilidad, con orden por precio.
- Perfiles de emprendimientos, favoritos y reseñas locales no verificadas.
- Perfil propio con logo/portada, canales opcionales, creación/edición de propuestas e imágenes locales.
- Campos para productos, servicios e ideas; vista previa antes de guardar; pausa y eliminación confirmada.
- Tema claro/oscuro, historial y enlaces con filtros.
- Ajustes con respaldo JSON e importación que conserva registros existentes por ID.

El almacenamiento es local al navegador. No se procesan pagos, pedidos ni entregas; los enlaces configurados abren servicios externos. Los perfiles de ejemplo no contienen contactos inventados. No añadir datos privados mientras la demo esté abierta.

## Referencias y adaptación

El análisis de Orbitkey, Atoms, CUTS, Nécessaire, Master & Dynamic y Oura, el alcance de la inspección y la integración de funciones de la demo están documentados en [docs/rea-ui-integration.md](docs/rea-ui-integration.md). El diseño se implementa en src/app/editorial.css y los componentes React.

## Compatibilidad y datos

La vista previa conserva `esan-emprende-demo-v1:interface-preview` e incorpora una vez `standalone-preview` si existe en el mismo origen. No se borran las claves originales. Se adaptan alias de campos, imágenes, estados y reseñas. Un JSON actual dañado bloquea la escritura automática. Entre dominios/navegadores, trasladar una copia JSON mediante Ajustes; por seguridad el sitio nuevo no puede leer localStorage de otro dominio.

## HTML descargable

```sh
npm run export:html
```

Genera public/downloads/esan-emprende-local.html con CSS, JavaScript, fuentes y fotos incluidos. Abrir con doble clic; las funciones locales operan sin conexión y usan el espacio standalone-preview. Los contactos externos sí requieren acceso a sus servicios. El build regenera automáticamente este archivo mediante prebuild y se publica como descarga adjunta en `/downloads/esan-emprende-local.html`.

## Recursos fotográficos

Las seis imágenes WebP demo-v1 suman 195.216 bytes frente a 2.701.817 del original. Next/Image proporciona tamaños responsivos y carga diferida. La lámina original se conserva en assets/source; `npm run prepare:images` regenera sus derivados. Al sustituir su contenido debe cambiar la versión del directorio porque demo-v1 tiene caché inmutable. Son tamaños de archivo, no una puntuación de Lighthouse.

## Autenticación posterior

AUTH_ENABLED se mantiene en false en src/lib/project-phase.ts. Para la futura fase de acceso se conservan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY (publicable/anon, nunca service_role). El origen HTTPS y el formato /rest/v1 son compatibles. Consultar [docs/supabase-auth.md](docs/supabase-auth.md) antes de reactivar, verificar los redirects /auth/callback y el hook Before User Created. Persistencia compartida, RLS, moderación y medición real todavía están pendientes.
