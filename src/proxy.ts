import { AUTH_ENABLED } from '@/lib/project-phase';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { supabaseConfig } from '@/lib/supabase/config';
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({request});
  response.headers.set('Cache-Control','private, no-store');
  if (!AUTH_ENABLED) return response;
  const config = supabaseConfig();
  if (!config) return response;
  const client = createServerClient(config.url,config.key,{cookies:{
    getAll:()=>request.cookies.getAll(),
    setAll(values){
      values.forEach(({name,value})=>request.cookies.set(name,value));
      response=NextResponse.next({request});
      response.headers.set('Cache-Control','private, no-store');
      values.forEach(({name,value,options})=>response.cookies.set(name,value,options));
    },
  }});
  // Valida con Auth y renueva las cookies; la autorización vive junto al contenido.
  await client.auth.getUser();
  return response;
}
export const config={matcher:['/','/acceso','/api/mi-negocio']};
