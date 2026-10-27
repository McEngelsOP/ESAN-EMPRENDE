# ESAN Emprende · Referencias, extracción y adaptación

## Qué aplicación se modifica

El despliegue principal de Vercel ejecuta `npm run build` desde la raíz: `package.json` declara Next.js y `src/app/page.tsx` renderiza Marketplace. `demo-sites/esan-emprende/` es una demo HTML/CSS/JS independiente, añadida en f56525d y 73a0289; no es la entrada del build de Next.js. Sus archivos se mantienen como referencia histórica. El HTML descargable en public/downloads se regenera desde los componentes React para evitar una tercera implementación divergente.

Se inspeccionaron ambas implementaciones antes de editar. Se incorporan a Next la búsqueda con normalización de acentos, filtros de tipo y disponibilidad, navegación con historial, tema persistente, reseñas locales, canales de contacto y datos/imágenes de la marca y propuestas. Se conserva el editor con vista previa, edición, pausa y eliminación confirmada de la aplicación Next.

## Método y alcance

Se usa REA como estructura de trabajo: Referencia → Extracción → Adaptación. No se dispone de una herramienta instalada con ese nombre. La inspección se realizó mediante solicitudes HTTPS verificadas y Chromium. El navegador confía únicamente en las claves de las autoridades certificadoras instaladas en el entorno; no se desactivó la verificación global de certificados.

Capturas y extracción de estructura/estilos: 27 de octubre de 2026. No se copiaron fotografías, logotipos, fuentes comerciales, promociones, cifras de ventas ni reseñas de las marcas. Se conservan las fotografías, tipografías y datos de ESAN Emprende.

| Referencia | Evidencia observada | Patrón extraído | Adaptación implementada |
|---|---|---|---|
| [Orbitkey](https://www.orbitkey.com/) | Cabecera, categorías de organización y fotografía principal de producto; página 200 | Navegación ordenada y objeto protagonista | Navegación principal separada de herramientas y destacados de emprendimientos |
| [Atoms](https://atoms.com/) | Vista de navegador 200, navegación simple, fotografía amplia y catálogo con metadatos concisos | Narrativa breve y espacio alrededor del producto | Propuestas con fotografía amplia, jerarquía precio/tipo/creador y controles discretos |
| [CUTS](https://www.cutsclothing.com/en-pe/) | Página 200; cabecera y secciones “Shop New Releases”, “Shop Best Sellers”. La imagen del hero no terminó de cargar en la captura | Colecciones y accesos claros a la exploración | Accesos por categorías y bloques de servicios e ideas; no se reprodujo el hero no observado |
| [Nécessaire](https://necessaire.com/) | Página y captura 200, menú sobrio, hero y grilla de productos | Producto limpio, separación editorial y pocos elementos decorativos | Grilla de propuestas con radios moderados, títulos y datos legibles |
| [Master & Dynamic](https://www.masterdynamic.com/) | Página y captura 200, fotografía a gran escala, título y acción principal, sección Featured Products | Detalle del objeto y CTA reconocible | Destacados con una acción de conocer al creador, no una compra ficticia |
| [Oura](https://ouraring.com/) | Página y captura 200, paleta cálida, jerarquía amplia y bloques narrativos | Calma visual y guía de comprensión | Fondo marfil, tipografía expresiva y explicación clara de contacto/entrega |

La URL de referencia funcional `https://esan-emprende-nueva-demo.paleaspen135.chatgpt.site` devolvió 401. No se afirma haber accedido a contenido protegido; sus funciones se revisaron desde `demo-sites/esan-emprende/`.

## Contrato visual

La interfaz debe sentirse como una vitrina editorial de comunidad: clara, fotográfica y útil. El primer viewport muestra identidad, búsqueda y un emprendimiento concreto; su acción conduce a su perfil. Acento rojo ESAN provisional, marfil y verde natural. El catálogo evita simular compras, descuentos, ventas verificadas o reputación inexistente. Los modos oscuro y claro comparten jerarquía y funciones. En móvil se conservan navegación explícita, filtros desplegables y controles táctiles.

Los formularios y paneles usan el mismo sistema, sin sacrificar validación, foco visible, confirmación de borrado ni movimiento reducido.

## Datos y compatibilidad

- La vista Next guarda en `esan-emprende-demo-v1:interface-preview`; la demo HTML usa `esan-emprende-demo-v1:standalone-preview`.
- Se importan las claves legacy solo en la vista previa del mismo origen. Se conservan IDs, favoritos, reseñas, campos desconocidos y registros pausados/eliminados.
- La importación legacy ocurre una vez por espacio para que un favorito quitado o una publicación eliminada no reaparezcan al recargar.
- `delivery` se adapta a `fulfillment`; `includes` a `scope`; las imágenes relativas de la demo se normalizan. Los datos originales no se borran.
- Si el JSON actual está dañado se bloquea la escritura automática; no se reemplaza silenciosamente por datos vacíos.
- El almacenamiento de dominios distintos no puede leerse desde el sitio nuevo. Ajustes permite exportar e importar JSON explícitamente; prioriza registros actuales con el mismo ID.
- Reseñas, datos de marca y fotos propias permanecen locales. No son compras verificadas. Los contactos solo se enlazan si son válidos y fueron añadidos por la persona.

El inicio de sesión sigue pospuesto por instrucción del usuario. No se introduce el bloqueo de “cuenta simulada” de la demo HTML, para conservar la exploración sin login. No se procesan pagos ni pedidos. La autenticación y la persistencia compartida siguen siendo etapas posteriores.
