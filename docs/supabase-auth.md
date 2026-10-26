# Hito: acceso institucional

## Configuración del proyecto Supabase

Las variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` ya están presentes en el entorno. Se comprobó con una solicitud de solo lectura que Auth responde HTTP 200, el proveedor Email está habilitado y la confirmación de correo es obligatoria. No se enviaron correos automáticamente.

La URL guardada termina en `/rest/v1`. El cliente acepta ese formato y usa su origen HTTPS para Auth; también acepta la Project URL sin ruta. No requiere clave secreta ni service_role.

En Authentication > URL Configuration, agrega las URLs exactas de retorno de cada entorno que realmente uses:

- Desarrollo: `http://localhost:3000/auth/callback` (si abres el sitio con localhost).
- Pruebas con dirección 127.0.0.1: `http://127.0.0.1:3000/auth/callback`.
- Producción: `https://TU-DOMINIO/auth/callback`, una vez exista el despliegue.

Configura Site URL con el dominio real del sitio cuando se despliegue. Evita comodines amplios. El usuario debe abrir el enlace en el mismo navegador que lo solicitó (PKCE). En Authentication > Email Templates > Magic Link conserva el enlace `{{ .ConfirmationURL }}`. La aplicación intercambia el código en `/auth/callback`; no implementa el formato de callback basado en `token_hash`.

## Restringir altas directamente en Supabase

El servidor de la web rechaza solicitudes de acceso fuera de `ue.edu.pe` y exige correo confirmado consultando Auth con `getUser()`. Esto protege el contenido de la aplicación, pero no impide por sí solo que alguien use directamente el endpoint público de registro de Supabase.

Para bloquear esas altas, ejecuta [la migración](../supabase/migrations/202610260001_institutional_auth_hook.sql) en SQL Editor. Luego en Authentication > Hooks crea o configura **Before User Created** como función Postgres `public.restrict_institutional_signup`. El SQL solo crea la función y permisos; hay que activar el hook en el panel. No se ha aplicado ni activado desde esta sesión porque no hay herramienta administrativa Supabase disponible. No se modifica ni elimina ninguna cuenta existente.

Mantén la confirmación de correo habilitada. La cuenta institucional demuestra control del correo; no certifica matrícula vigente.

## Comprobación con un estudiante

1. Solicitar enlace con una dirección propia real `@ue.edu.pe` desde el sitio.
2. Abrir el enlace en el mismo navegador, verificar entrada al catálogo.
3. Recargar y comprobar que se conserva la sesión.
4. Cerrar sesión y comprobar que volver a `/` redirige a `/acceso`.
5. Después de activar el hook, comprobar que Supabase rechaza un alta externa.

Estas comprobaciones reales de entrega, retorno y alta no se han realizado. Las pruebas automáticas verifican restricciones sin enviar correos ni crear usuarios. El proveedor de correo incorporado de Supabase puede limitar destinatarios/envíos; si el proyecto lo requiere, configura SMTP autorizado antes del piloto.

## Datos todavía de demostración

Catálogo y estadísticas siguen siendo ejemplos. Las publicaciones y favoritos se conservan en localStorage por ID de usuario, sin sincronización. No hay tablas de negocios ni RLS de datos reales todavía. Las fotos de demostración en public/ son públicas; las fotos privadas de estudiantes se implementarán con Storage privado en el hito de datos.
