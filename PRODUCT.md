# ESAN Emprende
Catálogo privado de emprendimientos para estudiantes de ESAN. Dominio institucional indicado por el usuario: `ue.edu.pe`. Sin carrito, pagos ni pedidos. Cada estudiante tendrá un emprendimiento, productos y estadísticas de interés. Las ventas se coordinan fuera del sitio.

La fase actual incluye acceso por enlace mágico de Supabase Auth con PKCE. El callback intercambia el código y la página raíz valida en servidor con `getUser` que el correo esté confirmado y termine en `@ue.edu.pe`; el cierre de sesión se procesa por POST. El proveedor Email está habilitado y la confirmación automática desactivada. El hook **Before User Created** para rechazar altas con otros dominios sigue pendiente, la función y los pasos de activación están en [docs/supabase-auth.md](docs/supabase-auth.md).

El catálogo sigue siendo una demo: favoritos y publicaciones son datos locales del navegador/cuenta, los nombres, productos, precios y estadísticas son ejemplos, y la imagen de demostración es pública. No guardar información privada ni presentar los datos como persistencia real. Las pruebas con correo real aún no se han realizado. No existe afiliación institucional oficial confirmada.

Siguiente fase: completar la restricción de altas por dominio, RLS, Storage privado, CRUD persistente y eventos reales. Confirmar el proveedor institucional antes de SSO. Vercel es la opción propuesta para despliegue, todavía sin conexión.

## Prioridad actual
Por indicación del usuario, el inicio de sesión se pospone hasta el final. AUTH_ENABLED=false en src/lib/project-phase.ts permite explorar la interfaz en / sin consultas Auth; /acceso y el callback vuelven a /. La demo utiliza el espacio local interface-preview, separado de los datos por cuenta anteriores. Primero completar catálogo, emprendimientos y panel del vendedor. No conectar datos privados durante esta fase pública.

## Espacio del vendedor
El panel permite crear y editar un perfil local (nombre, autor, descripción, coordinación y contacto de referencia). Crear publicaciones requiere un perfil. Los productos, servicios e ideas tienen campos específicos, un paso de vista previa y edición posterior conservando el ID. Renombrar el perfil actualiza las publicaciones propias. La eliminación pide confirmación. Los perfiles previos de ejemplo siguen siendo de solo lectura. Se conservan las publicaciones locales antiguas por su prefijo local-. Las métricas inventadas se sustituyeron por un estado pendiente de medición. Ningún dato se sincroniza con Supabase ni otros navegadores.
