# ESAN Emprende

Vitrina de productos, servicios e ideas para la comunidad estudiantil de ESAN. Dominio institucional previsto: ue.edu.pe. La venta o colaboración se coordina directamente con cada emprendimiento. No hay carrito, pagos ni gestión de pedidos. Proyecto independiente, sin afiliación institucional oficial confirmada.

## Aplicación activa

Next.js/React/TypeScript en la raíz del repositorio, desplegada desde main en Vercel. La demo HTML en demo-sites/esan-emprende es una referencia histórica independiente, no el objetivo del build. La versión descargable de public/downloads se genera con los mismos componentes React mediante npm run export:html.

## Fase actual

El catálogo y los perfiles de ejemplo son públicos y se exploran sin iniciar sesión. La cuenta institucional verificada se solicita al entrar a Mi negocio o publicar. En Producción, el acceso por enlace de correo devuelve al usuario a Mi negocio después de verificar su cuenta. Tienda y publicaciones propias se guardan en Supabase con restricciones RLS por propietario; los datos locales de demo no se importan automáticamente.

Inicio unificado con destacados, catálogo, búsqueda normalizada por acentos, tipo, categoría, disponibilidad y precio; las categorías aparecen en el penúltimo apartado; directorio/perfiles; favoritos; reseñas locales no verificadas; entorno blanco y solo modo claro, y Ajustes con exportación/importación JSON. La navegación con hash conserva vistas/filtros e historial.

Mi negocio permite crear/editar el perfil y administrar publicaciones privadas conectadas a Supabase. La edición de fotos, la publicación de perfiles y propuestas en el catálogo compartido, favoritos/reseñas entre dispositivos y métricas reales siguen pendientes. Los perfiles demo no inventan contactos; los canales propios se abren externamente y no envían mensajes automáticamente.

## Compatibilidad

Se preservan las claves actuales y las legacy de la demo HTML. En la vista previa, se importa una vez la clave standalone-preview del mismo origen, conservando IDs, campos adicionales, estado y reseñas. Ajustes permite trasladar datos entre orígenes por JSON; la web no puede leer almacenamiento de otros dominios. Los datos corruptos no se sobrescriben automáticamente. Más detalles: docs/rea-ui-integration.md.

## Pendiente antes de un piloto real

Completar la prueba real de acceso por correo con dos cuentas institucionales y verificar aislamiento RLS. Diseñar Storage privado para imágenes, decidir qué datos de tiendas/publicaciones serán públicos y definir moderación, privacidad, reglas de comunidad y analítica antes de publicar negocios reales. Confirmar el proveedor de identidad antes de SSO.

## Integración del diseño HTML (29 de octubre de 2026)
Los diseños aprobados se mantienen en los componentes de Inicio, Encabezado, Favoritos, Emprendimientos y Ajustes. Los filtros actualizan el catálogo sin desmontar Inicio ni cambiar el desplazamiento. El HTML descargable se genera desde la misma fuente React; sus formularios funcionan también en marcos sin permiso de envío nativo. Los datos de demo se mantienen por sesión si el navegador bloquea localStorage, con un aviso explícito. El guardado conectado sigue usando el API privado y sus controles de acceso.
