import { AUTH_ENABLED } from '@/lib/project-phase';
import { redirect } from 'next/navigation';
import MobileAccess from '@/components/mobile-access';
import './mobile.css';
import { supabaseServer } from '@/lib/supabase/server';
import { allowedUser, postAuthDestination } from '@/lib/auth-policy';
export const dynamic='force-dynamic';
const errors:Record<string,string>={expired:'El enlace venció o ya fue utilizado. Solicita uno nuevo para continuar.',domain:'El acceso requiere un correo confirmado de @ue.edu.pe.',unavailable:'No pudimos verificar el acceso. Inténtalo más tarde.'};
export default async function AccessPage({searchParams}:{searchParams:Promise<{error?:string;next?:string}>}){
 if(!AUTH_ENABLED)redirect('/');
 const client=await supabaseServer();
 const {error,next:requestedNext}=await searchParams;
 const next=postAuthDestination(requestedNext);
 if(client){const {data:{user}}=await client.auth.getUser();if(allowedUser(user))redirect(next)}
 return <MobileAccess configured={!!client} next={next} error={error ? (errors[error]||errors.expired) : undefined}/>;
}
