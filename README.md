# ESAN Emprende

Prototipo navegable de un catálogo de emprendimientos para estudiantes de ESAN. Construido con Next.js, TypeScript y React. Interfaz en español y precios en soles.

## Fase actual: interfaz sin login

El catálogo y el panel abren directamente en `/`. El login se pospone hasta el final mediante `AUTH_ENABLED=false` en `src/lib/project-phase.ts`; `/acceso` vuelve al catálogo y se bloquea el envío de enlaces. No hace falta Supabase para explorar la interfaz. Todos los datos siguen siendo ejemplos locales al navegador.

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

- Buscar, filtrar y ordenar las propuestas de ejemplo, o entrar desde el directorio de categorías.
- Explorar perfiles de emprendimientos con su catálogo completo; cada negocio aparece una sola vez en el directorio.
- Recorrer cuatro destacados con selección manual y avance automático cada 6 segundos. El carrusel permite pausar/reproducir, se detiene al pasar el cursor y queda pausado al recibir foco. Inicia sin avance automático si se prefiere movimiento reducido; se puede reproducir expresamente. También se detiene cuando la pestaña está oculta.
- Guardar favoritos; se conservan al recargar.
- Abrir Mi negocio, publicar un producto, servicio o idea local, pausar su disponibilidad, reactivarlo o eliminarlo.
- Ver ejemplos de páginas web, automatización e ideas que buscan colaboradores, además de productos físicos. Las propuestas sin precio muestran «A cotizar» y las ideas «Busco colaboradores».
- Cambiar el período de estadísticas ilustrativas.

Los destacados y el orden «Selección del catálogo» son una selección ilustrativa, no un ranking de ventas o popularidad.

Favoritos y publicaciones se guardan solo en localStorage del navegador. Limpiar los datos del sitio los elimina. Los datos demo son locales a la cuenta del navegador; el catálogo inicial es ficticio y las imágenes son de demostración. El formulario permite elegir imágenes de ejemplo; no admite subir fotos propias. Esta ampliación no añade backend ni persistencia compartida. Los botones de contacto explican que aún no hay canales reales. No introduzcas información privada ni real.

El flujo de acceso se implementó, pero todavía no se han realizado pruebas con un correo real.

## Pendiente antes de usar con estudiantes

Completar el hook de Supabase **Before User Created**, aplicar y validar las políticas RLS, añadir almacenamiento privado de imágenes, perfiles y productos persistentes y métricas con control de duplicados. Añadir moderación y políticas de privacidad. Conectar el repositorio a Vercel u otro alojamiento.

En esta fase el catálogo abre sin sesión; el acceso institucional queda deshabilitado y los datos siguen siendo de demostración. No hay pagos, pedidos ni ventas verificadas. No hay integración oficial con la universidad.

## Despliegue en Vercel

Conecta el repositorio raíz (`/`) como aplicación Next.js, sin sobrescribir el directorio de salida. Los despliegues deben construirse desde nuevos commits de `main`: volver a desplegar una versión creada con el framework `Other` conserva ese override histórico y puede publicar assets estáticos sin sus rutas dinámicas de Next.js.

## Flujo de vendedor local

En Mi negocio crea el perfil del emprendimiento. Después usa Nueva publicación: Producto pide entrega, Servicio pide alcance y plazo, e Idea pide etapa y colaboradores. Revisar publicación abre una vista previa sin guardar; confirma allí o vuelve a editar. Las publicaciones pueden editarse, pausarse o eliminarse (con confirmación). El perfil se puede renombrar conservando las publicaciones. Ver mi perfil muestra la tienda incluso sin publicaciones. Todo se conserva solo en este navegador. Las imágenes y canales de contacto siguen siendo referencias de la demo; las estadísticas aparecerán al implementar medición real.
