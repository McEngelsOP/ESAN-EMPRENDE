# ESAN Emprende

Vitrina de productos, servicios e ideas para la comunidad estudiantil de ESAN. Dominio institucional previsto: ue.edu.pe. La venta o colaboración se coordina directamente con cada emprendimiento. No hay carrito, pagos ni gestión de pedidos. Proyecto independiente, sin afiliación institucional oficial confirmada.

## Aplicación activa

Next.js/React/TypeScript en la raíz del repositorio, desplegada desde main en Vercel. La demo HTML en demo-sites/esan-emprende es una referencia histórica independiente, no el objetivo del build. La versión descargable de public/downloads se genera con los mismos componentes React mediante npm run export:html.

## Fase actual

Interfaz abierta con AUTH_ENABLED=false, por instrucción del usuario: el login queda para el final. No introducir información privada. Los datos iniciales, precios y disponibilidad son ejemplos. Las propuestas propias se guardan localmente por espacio de navegador, no se sincronizan con Supabase.

Inicio editorial con destacados y categorías; Explorar con búsqueda normalizada por acentos, tipo, categoría, disponibilidad y precio; directorio/perfiles; favoritos; reseñas locales no verificadas; tema claro/oscuro y Ajustes con exportación/importación JSON. La navegación con hash conserva vistas/filtros e historial.

Mi negocio permite crear/editar el perfil, logo y portada, canales opcionales WhatsApp/correo/red social, y gestionar publicaciones con campos por tipo. Hay imágenes propias locales, vista previa, edición estable, pausa y eliminación confirmada. El panel no muestra métricas ficticias como resultados reales; la medición sigue pendiente. Los perfiles de ejemplo no inventan contactos. Los canales propios se abren externamente y no envían mensajes automáticamente.

## Compatibilidad

Se preservan las claves actuales y las legacy de la demo HTML. En la vista previa, se importa una vez la clave standalone-preview del mismo origen, conservando IDs, campos adicionales, estado y reseñas. Ajustes permite trasladar datos entre orígenes por JSON; la web no puede leer almacenamiento de otros dominios. Los datos corruptos no se sobrescriben automáticamente. Más detalles: docs/rea-ui-integration.md.

## Pendiente antes de un piloto real

Reactivar y verificar Auth institucional, completar el hook de restricción de altas, crear persistencia compartida y políticas RLS por propietario, almacenamiento privado, moderación/reportes, privacidad y analítica real. Confirmar proveedor de identidad antes de SSO. La configuración Supabase se conserva, pero no valida por sí sola un login completo con una cuenta estudiantil real.
