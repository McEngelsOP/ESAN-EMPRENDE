-- Aplicar con SQL Editor y activar después en Authentication > Hooks.
-- No afecta ni elimina usuarios existentes.
create or replace function public.restrict_institutional_signup(event jsonb)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  email text := lower(coalesce(event -> 'user' ->> 'email', ''));
begin
  if email !~ '^[^@[:space:]]+@ue[.]edu[.]pe$' then
    return jsonb_build_object('error', jsonb_build_object(
      'http_code', 403,
      'message', 'El registro requiere un correo institucional @ue.edu.pe.'
    ));
  end if;
  return '{}'::jsonb;
end;
$$;
revoke all on function public.restrict_institutional_signup(jsonb) from public, anon, authenticated;
grant usage on schema public to supabase_auth_admin;
grant execute on function public.restrict_institutional_signup(jsonb) to supabase_auth_admin;
