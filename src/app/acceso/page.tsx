import { AUTH_ENABLED } from '@/lib/project-phase';
import { ShoppingBag, ShieldCheck } from 'lucide-react';
import { redirect } from 'next/navigation';
import AccessForm from '@/components/access-form';
import { supabaseServer } from '@/lib/supabase/server';
import { allowedUser } from '@/lib/auth-policy';
export const dynamic='force-dynamic';
const errors:Record<string,string>={expired:'El enlace venció o ya fue utilizado. Solicita uno nuevo para continuar.',domain:'El acceso requiere un correo confirmado de @ue.edu.pe.',unavailable:'No pudimos verificar el acceso. Inténtalo más tarde.'};
export default async function AccessPage({searchParams}:{searchParams:Promise<{error?:string}>}){
 if(!AUTH_ENABLED)redirect('/');
 const client=await supabaseServer();
 if(client){const {data:{user}}=await client.auth.getUser();if(allowedUser(user))redirect('/')}
 const {error}=await searchParams;
 return <div className="access-page"><div className="access-brand"><ShoppingBag size={25}/><span>esan<span>emprende</span></span></div><main className="access-layout"><section className="access-story"><h1>Las buenas ideas<br/>empiezan <span>cerca.</span></h1><p>Descubre, conecta y dale un espacio a lo que creas. El talento de tu comunidad te espera.</p><div className="access-photo"><img src="/images/products-sheet.png" alt="Cookies artesanales, un ejemplo del catálogo de emprendimientos"/></div><p className="access-caption">Un espacio para los emprendimientos de nuestra U.</p></section><section className="access-panel" aria-labelledby="access-title"><ShieldCheck size={28}/><h2 id="access-title">Tu comunidad.<br/>Tu próximo descubrimiento.</h2><p>Ingresa con tu correo institucional para explorar ESAN Emprende.</p>{error&&<p role="alert" className="access-error">{errors[error]||errors.expired}</p>}<AccessForm configured={!!client}/><div className="access-note">Acceso exclusivo con correo @ue.edu.pe.<br/>El catálogo aún contiene productos de demostración.</div></section></main><footer className="access-footer">ESAN Emprende · Proyecto estudiantil independiente</footer></div>;
}
