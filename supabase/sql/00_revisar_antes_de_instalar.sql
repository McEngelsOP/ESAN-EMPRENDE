-- Solo lectura: ejecuta antes de la etapa 01 para detectar conflictos.
select table_schema, table_name from information_schema.tables
where table_schema = 'public' and table_name in ('esan_tiendas', 'esan_publicaciones')
order by table_name;

select schemaname, tablename, policyname, cmd from pg_policies
where schemaname = 'public' and tablename in ('esan_tiendas', 'esan_publicaciones')
order by tablename, policyname;
