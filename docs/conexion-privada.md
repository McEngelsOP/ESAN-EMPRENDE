# Etapa 02: conexión privada de Mi negocio

El modo local sigue disponible y no importa datos automáticamente. El modo conectado usa `/api/mi-negocio`, valida sesión institucional mediante `getUser()`, y consulta siempre la tienda del usuario autenticado. La clave pública respeta las políticas RLS; no se utiliza service_role.

Para activar en un entorno de pruebas de Vercel, definir `ESAN_AUTH_ENABLED=true` y `ESAN_CLOUD_ENABLED=true` y desplegar. La URL y clave pública ya configuradas siguen siendo necesarias. Antes de activar en producción, verificar que el hook institucional esté activo y las URL de retorno exactas estén autorizadas en Supabase Auth. No usar comodines amplios. No se enviaron correos ni se modificaron cuentas desde esta implementación.

Probar con dos cuentas institucionales confirmadas: A crea una tienda y un producto; B no puede verlos ni modificarlos; A los conserva al recargar y al entrar desde otro navegador. Probar cierre de sesión, expiración y fallo de red. Las pruebas automáticas cubren el contrato y las respuestas sin sesión; NO verifican entrega de correo ni RLS en el proyecto oficial.

En esta etapa no se sincronizan fotos, favoritos ni reseñas. Las fotos se rechazan explícitamente en el servidor y los controles de carga están deshabilitados en el espacio conectado. No hay publicación pública ni métricas. El perfil conectado no se mezcla con el catálogo local de ejemplo. La importación local se implementará por separado, con confirmación y resolución de conflictos.

Pendiente antes de producción: realizar la prueba real de acceso institucional y verificar el comportamiento completo con las dos cuentas. No activar los flags de producción hasta completarla.
