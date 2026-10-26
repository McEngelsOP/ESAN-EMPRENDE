'use server';
import { AUTH_ENABLED } from '@/lib/project-phase';
import { headers, cookies } from 'next/headers';
import { supabaseServer } from '@/lib/supabase/server';
import { institutionalEmail } from '@/lib/auth-policy';
export type AccessState = {status:'idle'|'error'|'sent';message:string;email?:string};
export async function requestAccess(_previous:AccessState, form:FormData):Promise<AccessState>{
  if(!AUTH_ENABLED)return {status:'error',message:'El inicio de sesión está deshabilitado mientras preparamos la interfaz.'};
  const email=institutionalEmail(String(form.get('email')||''));
  if(!email)return {status:'error',message:'Usa tu correo institucional completo, terminado en @ue.edu.pe.'};
  const client=await supabaseServer();
  if(!client)return {status:'error',message:'El acceso está en preparación. Inténtalo más tarde.'};
  const jar=await cookies();
  const previous=Number(jar.get('esan-auth-requested')?.value||0);
  if(Date.now()-previous<60000)return {status:'error',message:'Espera un minuto antes de solicitar otro enlace.'};
  const requestHeaders=await headers();
  const origin=requestHeaders.get('origin');
  if(!origin)return {status:'error',message:'Recarga esta página y vuelve a intentarlo.'};
  // Las Server Actions validan Origin contra Host para impedir solicitudes cruzadas.
  const callback=new URL('/auth/callback',origin).toString();
  jar.set('esan-auth-requested',String(Date.now()),{httpOnly:true,sameSite:'lax',secure:origin.startsWith('https:'),maxAge:60,path:'/'});
  const {error}=await client.auth.signInWithOtp({email,options:{emailRedirectTo:callback,shouldCreateUser:true}});
  if(error)return {status:'error',message:error.status===429?'Se alcanzó el límite de envíos. Espera unos minutos y vuelve a intentarlo.':'No pudimos enviar el enlace. Inténtalo más tarde; si continúa, avisa al administrador.'};
  return {status:'sent',email,message:'Revisa tu correo institucional. Te enviamos un enlace para ingresar.'};
}
