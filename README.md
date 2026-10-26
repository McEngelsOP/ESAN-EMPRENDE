# ESAN Emprende

Prototipo navegable de un catálogo de emprendimientos para estudiantes de ESAN. Construido con Next.js, TypeScript y React. Interfaz en español y precios en soles.

## Desarrollo

Requiere Node.js 20.9 o posterior y npm.

```sh
npm ci
npm run dev
```

La autenticación usa Supabase con enlace mágico por correo y PKCE. Configura estas variables de entorno en `.env.local`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable-or-anon-key>
```

El valor de URL puede ser el origen del proyecto o la URL de Data API que termina en `/rest/v1`; la aplicación la normaliza al origen. No uses una clave `service_role` en variables `NEXT_PUBLIC_*`.

En Supabase Auth, habilita el proveedor Email y deja desactivado **Confirm email autoconfirm** para exigir verificación. Configura **Site URL** para el origen local (`http://localhost:3000`) durante desarrollo y para el dominio de producción al desplegar. Añade como Redirect URLs `http://localhost:3000/auth/callback` y `https://<dominio-de-produccion>/auth/callback`. El template de confirmación debe enlazar con `{{ .ConfirmationURL }}` para completar el callback de Supabase.

La aplicación valida la sesión en servidor y permite el acceso solo cuando `getUser` confirma un correo verificado bajo `ue.edu.pe`. El hook **Before User Created** para rechazar otros dominios todavía está pendiente. Las instrucciones SQL y la configuración restante se documentan en [docs/supabase-auth.md](docs/supabase-auth.md).

## Comprobaciones

```sh
npm run typecheck
npm run build
npm run start
npm test
```

`npm test` ejecuta pruebas funcionales con Playwright contra un servidor de producción en el puerto 3000; primero ejecutar build. El navegador de pruebas se obtiene del paquete npm `@sparticuz/chromium`, sin descarga adicional.

## Qué puedes probar

- Buscar, filtrar y ordenar los productos de ejemplo.
- Explorar emprendimientos y detalles de productos.
- Guardar favoritos; se conservan al recargar.
- Abrir Mi negocio, publicar un producto local, pausarlo, reactivarlo o eliminarlo.
- Cambiar el período de estadísticas ilustrativas.

Favoritos y publicaciones se guardan solo en localStorage del navegador. Limpiar los datos del sitio los elimina. Los datos demo son locales a la cuenta del navegador; el catálogo inicial es ficticio y la imagen de demostración es pública. Los botones de contacto explican que aún no hay canales reales. No introduzcas información privada ni real.

El flujo de acceso se implementó, pero todavía no se han realizado pruebas con un correo real.

## Pendiente antes de usar con estudiantes

Completar el hook de Supabase **Before User Created**, aplicar y validar las políticas RLS, añadir almacenamiento privado de imágenes, perfiles y productos persistentes y métricas con control de duplicados. Añadir moderación y políticas de privacidad. Conectar el repositorio a Vercel u otro alojamiento.

La aplicación restringe el catálogo a sesiones institucionales; los datos siguen siendo de demostración. No hay pagos, pedidos ni ventas verificadas. No hay integración oficial con la universidad.
