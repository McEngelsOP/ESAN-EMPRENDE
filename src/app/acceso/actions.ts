'use server';
import { AUTH_ENABLED } from '@/lib/project-phase';
import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabaseConfig } from '@/lib/supabase/config';
import { supabaseServer } from '@/lib/supabase/server';
import { institutionalEmail, postAuthDestination } from '@/lib/auth-policy';
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
  const next=postAuthDestination(String(form.get('next')||''));
  jar.set('esan-auth-next',next,{httpOnly:true,sameSite:'lax',secure:origin.startsWith('https:'),maxAge:15*60,path:'/'});
  const callback=new URL('/auth/callback',origin).toString();
  jar.set('esan-auth-requested',String(Date.now()),{httpOnly:true,sameSite:'lax',secure:origin.startsWith('https:'),maxAge:60,path:'/'});
  const {error}=await client.auth.signInWithOtp({email,options:{emailRedirectTo:callback,shouldCreateUser:form.get('intent')!=='recover'}});
  if(error)return {status:'error',message:error.status===429?'Se alcanzó el límite de envíos. Espera unos minutos y vuelve a intentarlo.':'No pudimos enviar el enlace. Inténtalo más tarde; si continúa, avisa al administrador.'};
  return {status:'sent',email,message:'Revisa tu correo institucional. Te enviamos un enlace para ingresar.'};
}

// OAuth uses the same PKCE callback and institutional account policy as email.
export async function requestGoogleAccess(_previous:AccessState, form:FormData):Promise<AccessState>{
  if(!AUTH_ENABLED)return {status:'error',message:'El acceso está en preparación.'};
  const config=supabaseConfig();
  const client=await supabaseServer();
  if(!config||!client)return {status:'error',message:'El acceso está en preparación. Continúa como invitado.'};
  try {
    const response=await fetch(`${config.url}/auth/v1/settings`,{headers:{apikey:config.key},cache:'no-store',signal:AbortSignal.timeout(8000)});
    if(!response.ok)throw new Error('settings');
    const settings=await response.json();
    if(settings.external?.google!==true)return {status:'error',message:'Google aún no está habilitado. Ingresa con el enlace a tu correo institucional.'};
  } catch {return {status:'error',message:'No pudimos conectar con Google. Ingresa con el enlace a tu correo institucional.'};}
  const origin=(await headers()).get('origin');
  if(!origin)return {status:'error',message:'Recarga la página y vuelve a intentarlo.'};
  const next=postAuthDestination(String(form.get('next')||''));
  (await cookies()).set('esan-auth-next',next,{httpOnly:true,sameSite:'lax',secure:origin.startsWith('https:'),maxAge:15*60,path:'/'});
  const {data,error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:new URL('/auth/callback',origin).toString(),queryParams:{hd:'ue.edu.pe',prompt:'select_account'}}});
  if(error||!data.url)return {status:'error',message:'No pudimos iniciar con Google. Usa tu correo institucional.'};
  redirect(data.url);
}
