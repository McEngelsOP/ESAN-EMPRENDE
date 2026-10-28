# ESAN Emprende: etapas de Supabase

## Estado actual

La web sigue siendo una demo local sin inicio de sesión. Los archivos de `supabase/sql` son guiones para el SQL Editor, no migraciones aplicadas automáticamente. No se ha ejecutado la etapa 01 ni se han probado sus políticas con sesiones reales. No usar datos reales hasta probarlas en un proyecto de pruebas. La instalación de estas tablas por sí sola no conecta la web ni publica tiendas.

## 00 · Revisar antes de instalar

Ejecutar `supabase/sql/00_revisar_antes_de_instalar.sql` en el SQL Editor del proyecto de pruebas. Las dos consultas deben devolver cero filas. Si aparecen tablas o políticas, detenerse y comparar el esquema; no borrar ni sobrescribir información.

## 01 · Tiendas y publicaciones privadas

`supabase/sql/01_tiendas_y_publicaciones_privadas.sql` crea dos tablas y políticas RLS de propietario. Una cuenta puede tener una tienda y sus publicaciones; los visitantes y sesiones anónimas no pueden leerlas. El campo slug se reserva como identificador único para una futura URL. Productos requieren precio positivo, servicios admiten cero para cotizar e ideas tienen precio cero. La eliminación de la tienda o la cuenta propietaria elimina sus publicaciones por cascada. El archivo es transaccional y se ejecuta una sola vez; si falla, revisar el error antes de volver a intentarlo.

Antes de usar datos reales: verificar con dos cuentas de prueba distintas y una sesión anónima que lectura, creación, edición, cambio de propietario y eliminación solo funcionan para el dueño. Ejecutar Security Advisor y revisar los resultados. La columna `actualizado_en` tiene valor inicial; el futuro cliente debe actualizarla en cada edición. El SQL no crea fotografías, favoritos, métricas, publicaciones públicas ni migración automática de localStorage. No aplicar el SQL en producción sin haber completado esas pruebas.

Si se ejecuta desde SQL Editor, no registra una migración en el historial de la CLI; acordar un único mecanismo de migraciones antes de automatizar despliegues. No volver a ejecutar la misma etapa mediante otro mecanismo sin revisar el historial.

## Siguientes etapas (aún no preparadas ni aplicadas)

1. Autenticación institucional: configurar el hook existente y probar altas, confirmación y cierre de sesión con cuentas de prueba.
2. Conectar la aplicación a las tablas y ofrecer importación explícita de los datos locales, con manejo de conflictos y errores.
3. Fotos: diseñar Storage, límites, acceso y limpieza de archivos; probar permisos con dos usuarios.
4. Publicación y enlaces: definir qué campos son públicos, moderación y políticas de lectura antes de habilitar el catálogo compartido.
5. Favoritos y métricas: definir eventos, privacidad y pruebas antes de mostrar valores.

## Hallazgo previo en el proyecto conectado

Security Advisor informó que `public.rls_auto_enable()` es `SECURITY DEFINER` y tiene privilegio EXECUTE para `anon` y `authenticated`. Revisar su propósito y permisos antes del piloto; este paquete no modifica esa función. Referencia: https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable. El informe también señaló la protección de contraseñas filtradas desactivada; evaluar su pertinencia si se habilita acceso con contraseña.
