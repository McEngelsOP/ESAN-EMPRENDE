-- ESAN Emprende - Etapa 01: tiendas y publicaciones privadas.
-- Ejecutar una sola vez en un proyecto de pruebas después de revisar el estado
-- del esquema. No activa el inicio de sesión, la app ni el catálogo público.
-- No ejecutarlo si ya existen estas tablas: detenerse y revisar el esquema.
begin;

create table public.esan_tiendas (
  id uuid primary key default gen_random_uuid(),
  propietario_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nombre text not null check (char_length(trim(nombre)) between 1 and 60),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  creador text not null check (char_length(trim(creador)) between 1 and 60),
  descripcion text not null check (char_length(trim(descripcion)) between 20 and 600),
  coordinacion text not null check (char_length(trim(coordinacion)) between 1 and 300),
  categoria text,
  whatsapp text,
  correo_contacto text,
  red_social text,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint esan_una_tienda_por_propietario unique (propietario_id)
);

create table public.esan_publicaciones (
  id uuid primary key default gen_random_uuid(),
  tienda_id uuid not null references public.esan_tiendas(id) on delete cascade,
  nombre text not null check (char_length(trim(nombre)) between 1 and 80),
  tipo text not null check (tipo in ('Producto', 'Servicio', 'Idea')),
  categoria text not null check (char_length(trim(categoria)) between 1 and 80),
  descripcion text not null check (char_length(trim(descripcion)) between 10 and 1000),
  precio numeric(10,2) not null default 0 check (precio between 0 and 100000),
  disponible boolean not null default true,
  entrega text,
  alcance text,
  plazo text,
  etapa text,
  colaboradores text,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint esan_precio_por_tipo check (
    (tipo = 'Producto' and precio > 0) or
    (tipo = 'Servicio' and precio >= 0) or
    (tipo = 'Idea' and precio = 0)
  ),
  constraint esan_campos_por_tipo check (
    (tipo <> 'Servicio' or (char_length(trim(coalesce(alcance,''))) > 0 and char_length(trim(coalesce(plazo,''))) > 0)) and
    (tipo <> 'Idea' or char_length(trim(coalesce(colaboradores,''))) > 0)
  )
);
create index esan_publicaciones_tienda_id_idx on public.esan_publicaciones (tienda_id);

alter table public.esan_tiendas enable row level security;
alter table public.esan_publicaciones enable row level security;
revoke all on public.esan_tiendas, public.esan_publicaciones from public, anon, authenticated;
grant select, insert, update, delete on public.esan_tiendas, public.esan_publicaciones to authenticated;

-- Las sesiones anónimas de Supabase Auth también usan el rol authenticated.
-- No se consideran propietarios en esta etapa.
create policy "tiendas: propietario lee" on public.esan_tiendas for select to authenticated
using ((select auth.uid()) = propietario_id and coalesce((select auth.jwt()->>'is_anonymous'), 'false') = 'false');
create policy "tiendas: propietario crea" on public.esan_tiendas for insert to authenticated
with check ((select auth.uid()) = propietario_id and coalesce((select auth.jwt()->>'is_anonymous'), 'false') = 'false');
create policy "tiendas: propietario actualiza" on public.esan_tiendas for update to authenticated
using ((select auth.uid()) = propietario_id and coalesce((select auth.jwt()->>'is_anonymous'), 'false') = 'false')
with check ((select auth.uid()) = propietario_id and coalesce((select auth.jwt()->>'is_anonymous'), 'false') = 'false');
create policy "tiendas: propietario elimina" on public.esan_tiendas for delete to authenticated
using ((select auth.uid()) = propietario_id and coalesce((select auth.jwt()->>'is_anonymous'), 'false') = 'false');

create policy "publicaciones: propietario lee" on public.esan_publicaciones for select to authenticated
using (exists (select 1 from public.esan_tiendas t where t.id = tienda_id and t.propietario_id = (select auth.uid())));
create policy "publicaciones: propietario crea" on public.esan_publicaciones for insert to authenticated
with check (exists (select 1 from public.esan_tiendas t where t.id = tienda_id and t.propietario_id = (select auth.uid())));
create policy "publicaciones: propietario actualiza" on public.esan_publicaciones for update to authenticated
using (exists (select 1 from public.esan_tiendas t where t.id = tienda_id and t.propietario_id = (select auth.uid())))
with check (exists (select 1 from public.esan_tiendas t where t.id = tienda_id and t.propietario_id = (select auth.uid())));
create policy "publicaciones: propietario elimina" on public.esan_publicaciones for delete to authenticated
using (exists (select 1 from public.esan_tiendas t where t.id = tienda_id and t.propietario_id = (select auth.uid())));
commit;
