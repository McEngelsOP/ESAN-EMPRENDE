# ESAN Emprende

Vitrina estudiantil de productos, servicios e ideas. Aplicación Next.js con React, TypeScript y acceso institucional configurable. El catálogo se puede explorar sin cuenta. La demostración interactiva de `/demo` permite recorrer las funciones locales con datos ficticios eliminables.

## Aplicación que se construye y despliega

Vercel usa el `package.json` de la raíz, el preset Next.js y `npm run build`. La entrada es `src/app/page.tsx`; `/demo` tiene su propia entrada en `src/app/demo/page.tsx`. El directorio `demo-sites/esan-emprende/` contiene una demo HTML histórica independiente; no sustituye al proyecto Next.js.

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

Ejecuta el build antes de Playwright. Su configuración usa `@sparticuz/chromium`, proyectos de escritorio (1440×1000) y móvil (390×844), y un servidor de producción en el puerto 3000; reutiliza uno existente cuando está disponible. No hace falta descargar otro navegador. Estos comandos son instrucciones de verificación, no un registro de resultados.

## Funciones de esta versión

- Inicio con destacados seleccionables, fotos de referencia, pausa y movimiento reducido.
- Búsqueda por nombre, creador, descripción, categoría y marca, sin distinguir acentos.
- Filtros de tipo, categoría y disponibilidad, con orden por precio.
- Directorio y perfiles de emprendimientos; favoritos con búsqueda, filtros y deshacer; reseñas locales no verificadas.
- Perfil propio con logo/portada, canales opcionales, creación/edición de propuestas e imágenes locales.
- Campos para productos, servicios e ideas; vista previa antes de guardar; pausa y eliminación confirmada.
- Mi negocio con resumen, pasos para completar la tienda, búsqueda de publicaciones y filtro de disponibilidad.
- Entorno blanco, solo modo claro, historial y enlaces con filtros.
- Ajustes como vista propia, con respaldo JSON, importación que conserva registros existentes por ID y controles para cargar, quitar o restaurar ejemplos.

En el modo local, el almacenamiento pertenece al navegador. La demo no procesa pagos, pedidos ni entregas; los enlaces configurados por la persona abren servicios externos. Los perfiles ficticios no contienen canales de contacto reales. La persistencia privada conectada se controla por flags y se administra por separado.

## Probar con datos ficticios

Abre `/demo`. La primera visita prepara 18 publicaciones de catálogo de 9 emprendimientos, un negocio editable con 5 publicaciones, 6 reseñas y 3 favoritos. Los nombres, perfiles, reseñas, precios y cifras son ficticios. El resumen de ese negocio muestra actividad simulada, sin medir visitas, contactos ni ventas.

En **Ajustes → Datos**, **Cargar ejemplos** añade los registros que falten sin sustituir los existentes; **Quitar datos ficticios** pide confirmación, oculta el catálogo de ejemplo y conserva el contenido propio. La decisión persiste al recargar. **Restaurar ejemplos** vuelve a cargar la muestra sin duplicarla. Si creaste una publicación propia en el negocio ficticio, al quitar los ejemplos se conserva el perfil como negocio local y deja de mostrar métricas simuladas.

`/demo` usa el espacio `esan-emprende-demo-v1:demo-aea-v1`, separado de la vista previa principal y del HTML descargable. Sus controles no usan `/api/mi-negocio`, Supabase ni correo. **Eliminar datos locales** es otra acción: borra todo el espacio local de esa vista y exige escribir `ELIMINAR`. Consulta [el alcance y el plan de revisión de la ampliación](docs/aea-mejoras.md).

## Referencias y adaptación

El análisis de Orbitkey, Atoms, CUTS, Nécessaire, Master & Dynamic y Oura, el alcance de la inspección y la integración de funciones de la demo están documentados en [docs/rea-ui-integration.md](docs/rea-ui-integration.md). La autoridad visual vigente es la sección final de [DESIGN.md](DESIGN.md): blanco, verde y rojo, con Manrope y DM Sans. `src/app/layout.tsx` importa `globals.css` y las hojas de refinamiento de descubrimiento, gestión y experiencia. `editorial.css` queda como referencia histórica sin importación.

## Compatibilidad y datos

La vista previa conserva `esan-emprende-demo-v1:interface-preview` e incorpora una vez `standalone-preview` si existe en el mismo origen. No se borran las claves originales. Se adaptan alias de campos, imágenes, estados y reseñas. Un JSON actual dañado bloquea la escritura automática. Entre dominios/navegadores, trasladar una copia JSON mediante Ajustes; por seguridad el sitio nuevo no puede leer localStorage de otro dominio.

## HTML descargable

```sh
npm run export:html
```

Genera public/downloads/esan-emprende-local.html con CSS, JavaScript, fuentes y fotos incluidos. Abrir con doble clic; las funciones locales operan sin conexión y usan el espacio standalone-preview. Los contactos externos sí requieren acceso a sus servicios. El build regenera automáticamente este archivo mediante prebuild y se publica como descarga adjunta en `/downloads/esan-emprende-local.html`.

## Recursos fotográficos

Las seis imágenes WebP demo-v1 suman 195.216 bytes frente a 2.701.817 del original. Next/Image proporciona tamaños responsivos y carga diferida. La lámina original se conserva en assets/source; `npm run prepare:images` regenera sus derivados. Al sustituir su contenido debe cambiar la versión del directorio porque demo-v1 tiene caché inmutable. Son tamaños de archivo, no una puntuación de Lighthouse.

## Autenticación y guardado conectado

`src/lib/project-phase.ts` obtiene los flags del entorno; no hay un login desactivado de forma fija:

| Configuración | Comportamiento |
| --- | --- |
| `ESAN_AUTH_ENABLED` distinto de `true` | Catálogo y gestión local de vista previa sin cuenta. |
| `ESAN_AUTH_ENABLED=true` | Catálogo público; Mi negocio requiere correo `@ue.edu.pe` confirmado. |
| Ambos flags `ESAN_AUTH_ENABLED=true` y `ESAN_CLOUD_ENABLED=true` | Habilita el espacio privado conectado de Mi negocio mediante `/api/mi-negocio`. |

El acceso usa `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` (publicable/anon, nunca `service_role`). El origen HTTPS y el formato `/rest/v1` son compatibles. La configuración de cada despliegue determina qué modo está activo; `/demo` permanece local.

Esta ampliación no cambia Auth, SQL, permisos RLS ni los flags del entorno. Sigue pendiente la validación real de correo y de aislamiento entre dos cuentas, además de comprobar que tablas, políticas y hook institucional estén instalados. Las fotos conectadas, publicación pública compartida, sincronización de favoritos/reseñas, moderación y medición real siguen pendientes. Consultar [conexión privada](docs/conexion-privada.md) y [acceso institucional](docs/supabase-auth.md), conservando sus notas históricas como tales. La rama `aea` prepara una preview de revisión; este documento no acredita un despliegue ni una integración en `main`.
