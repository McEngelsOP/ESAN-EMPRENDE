# Ampliación aea: experiencia y demostración local

La rama `aea`, creada desde `main` en `979705e`, amplía los apartados existentes de ESAN Emprende. Conserva el mundo visual aprobado: fondo blanco, verde y rojo, Manrope para títulos y DM Sans para lectura. Se prepara una preview de Vercel para revisión; no se autoriza ni se documenta aquí una integración en `main`.

Este documento describe el código disponible y el plan de comprobación. No acredita resultados de pruebas ni un despliegue terminado.

## Cambios por apartado

| Apartado | Comportamiento implementado |
| --- | --- |
| Inicio y catálogo | Fotos de referencia en los destacados, filtros activos que se pueden retirar y estados vacíos recuperables. Inicio y Explorar siguen unificados; filtrar conserva la vista sin salto de página. Las categorías permanecen en penúltimo lugar y se conserva la invitación final. |
| Emprendimientos | Búsqueda por nombre o creador, cantidades por categoría, fotos y datos ficticios identificados. Las acciones abren el perfil y su catálogo. |
| Favoritos | Búsqueda normalizada por acentos, filtros por categoría, resultados vacíos con recuperación, tarjetas con foto, retirada con deshacer y referencias no disponibles que se pueden quitar. |
| Mi negocio | Resumen de perfil y publicaciones, pasos para completar la tienda, búsqueda y filtro de disponibilidad. Crear, editar, cambiar precio, pausar/reactivar y eliminar muestran estados de operación y errores de guardado. |
| Editor | Producto, servicio o idea; campos de entrega, alcance, plazo, etapa y colaboradores según el tipo; vista previa antes de guardar. En modo local admite hasta 3 fotos con una principal. |
| Ajustes | Vista propia con navegación interna de Cuenta, Datos, Riesgo, Ayuda y Acerca de. Respaldo/importación JSON, recuperación del contenido original dañado y controles de ejemplos separados del borrado total. La fila de navegación principal queda oculta en esta vista. |

Las imágenes de productos físicos se muestran en tarjetas, directorio, perfiles, favoritos y gestión. Servicios e ideas sin foto conservan su iconografía. `ProductImage` usa los WebP de `public/images/demo-v1` con tamaños responsivos; la foto inicial de destacados se precarga y el resto se carga de forma diferida. Las fotos locales aceptan JPG, PNG o WebP de hasta 5 MB por imagen y se comprimen para el navegador. El espacio conectado mantiene deshabilitada la carga de fotos.

`Marketplace` carga `SettingsPanel`, `SellerWorkspace` y `CloudWorkspace` mediante `React.lazy` y `Suspense` cuando se abren sus vistas. Los mensajes de espera permiten reconocer la carga. El HTML exportado incorpora las mismas cuatro hojas de estilo que el layout de Next.js; continúa usando su espacio local `standalone-preview`.

## Datos ficticios de /demo

`src/app/demo/page.tsx` abre `Marketplace` con `accountId="demo-aea-v1"`, `preview` y `demoMode`. La ruta incluye metadatos para no indexarla. Su clave local es `esan-emprende-demo-v1:demo-aea-v1`; no mezcla automáticamente datos de la vista previa principal ni del HTML histórico.

| Muestra inicial | Cantidad y propósito |
| --- | --- |
| Emprendimientos del catálogo | 9 perfiles ficticios con nombres, carreras, ciclos y descripciones de ejemplo. |
| Publicaciones del catálogo | 18: productos, servicios e ideas, con propuestas disponibles, pausadas y a cotizar. |
| Mi negocio | Taller Entre Apuntes y 5 publicaciones editables. |
| Reseñas | 6 comentarios ficticios, no verificados y sin acreditar compras. |
| Favoritos | 3 propuestas guardadas inicialmente. |
| Actividad | 207 visitas, 24 clics de contacto y 31 guardados, con una semana de visitas simuladas. Son constantes ilustrativas; no se registran eventos reales. |

Los registros de muestra llevan `sampleSet: "esan-aea-v1"`. El marcador determina qué se puede retirar; no se deduce del nombre ni del prefijo del ID. Los fixtures no contienen canales de contacto reales ni envían solicitudes a `/api/mi-negocio`, Supabase, correos o mensajes. Los enlaces externos que configure la persona mantienen el comportamiento de apertura directa.

### Cargar, quitar y restaurar

1. Abre `/demo` y entra en **Ajustes → Datos**. En la primera visita se carga la muestra una vez.
2. **Cargar ejemplos** incorpora los registros faltantes por ID sin sustituir el perfil, publicaciones o reseñas existentes. Si ya hay un negocio propio, conserva ese negocio y no le añade las 5 publicaciones del negocio ficticio.
3. **Quitar datos ficticios** pide confirmación. Oculta el catálogo de muestra, retira el perfil/publicaciones/reseñas marcados y limpia sus referencias en favoritos. Conserva publicaciones, reseñas y campos propios, incluso reseñas creadas por la persona sobre una propuesta de muestra.
4. Si una publicación propia pertenece al negocio ficticio, conserva ese perfil como negocio local, retira su marcador y deja de mostrar las métricas simuladas.
5. La retirada queda guardada para que recargar no repueble los ejemplos. **Restaurar ejemplos** vuelve a mostrar el catálogo y añade las muestras que correspondan sin duplicar IDs. Los registros existentes prevalecen.

Fuera de `/demo`, restaurar ejemplos solo vuelve a mostrar el catálogo; no crea ni resiembra el negocio editable. **Eliminar datos locales** es un control diferente: borra todo el espacio local de la vista actual tras escribir `ELIMINAR`. No borra la cuenta, datos conectados ni copias JSON descargadas.

La exportación JSON conserva los marcadores y la decisión de ocultar la muestra. La importación admite hasta 10 MB y mezcla registros por ID conservando los actuales. Si el almacenamiento contiene un JSON dañado, se bloquea la escritura automática y Ajustes permite descargar el original. Si el navegador bloquea almacenamiento permanente, los cambios solo se conservan durante la página abierta y se muestra un aviso para exportarlos. Un guardado fallido no debe anunciar una operación completada.

## Acceso y datos conectados: alcance conservado

La ruta principal sigue las condiciones de `src/lib/project-phase.ts`: `AUTH_ENABLED` depende de `ESAN_AUTH_ENABLED === 'true'`, y `CLOUD_ENABLED` exige además `ESAN_CLOUD_ENABLED === 'true'`. El catálogo es público; el modo institucional valida correo confirmado de `ue.edu.pe` para gestionar el negocio. `/demo` mantiene su gestión local aunque esos flags estén activos.

Esta ampliación no modifica el acceso institucional, sus fondos aprobados, las rutas de callback/salida, el API privado, SQL, políticas RLS, hooks ni variables del despliegue. No aplica migraciones ni verifica la instalación del esquema. Siguen pendientes las pruebas reales de correo y de aislamiento con dos cuentas, además de confirmar tablas, políticas y hook. Las fotos conectadas, publicación pública, sincronización de favoritos/reseñas y analítica real quedan fuera de esta ampliación. Véanse [conexión privada](conexion-privada.md) y [acceso institucional](supabase-auth.md).

## Evidencia del diseño y desfase heredado

La autoridad es la sección final **Diseño vigente: integración de los HTML aprobados** de `DESIGN.md`, junto con el brief `.impeccable/briefs/aea.md`. La implementación conserva `data-theme="light"` en `src/app/layout.tsx`, las fuentes autoalojadas Manrope/DM Sans y los fondos blancos, tinta `#243d30`, secundario `#536358` y borde `#dce3de` de la regla final de tokens en `globals.css`. Las hojas de refinamiento usan esas variables y los acentos existentes; no redefinen los tokens canónicos.

`DESIGN.md` también contiene secciones históricas que describen tema oscuro, otros colores y límites funcionales de etapas anteriores. `.impeccable/design.json` sigue en versión 1, apunta a `src/app/editorial.css` y contiene esa paleta anterior y un bloque `dark`; ese CSS ya no se importa en el layout. Es un desfase heredado entre el sidecar y el diseño vigente. Ambos archivos se conservan sin reparación ni migración de esquema como parte de esta ampliación.

No se genera una composición nueva: se amplía la interfaz existente. Las superficies de interacción, foco, movimiento reducido y adaptación móvil se declaran en el código; su resultado visual debe contrastarse en la revisión de la preview.

## Plan de verificación

Comandos previstos desde la raíz, sin afirmar aquí su aprobación:

```sh
npm ci
npm run typecheck
npm run build
npx playwright test tests/demo-content.spec.ts tests/demo-experience.spec.ts
npm test
```

`npm run build` regenera primero el HTML descargable mediante `prebuild`; `npm run export:html` permite regenerarlo por separado. Playwright usa Chromium incluido y ejecuta proyectos de escritorio (1440×1000) y móvil (390×844). La revisión debe cubrir también 320 px, teclado y movimiento reducido.

Las pruebas añadidas plantean verificar composición e idempotencia de la muestra, conservación de contenido propio, retirada/restauración persistente, ausencia de escrituras al API privado, fallos de almacenamiento, búsqueda de favoritos y ancho del directorio móvil. El recorrido manual debe comprobar fotos, filtros sin salto, navegación de Ajustes, búsquedas de publicaciones, edición y revisión antes de guardar, errores recuperables, exportación/importación y HTML descargable. Las pruebas automáticas locales no sustituyen correo real, RLS ni la validación del entorno de Vercel.
