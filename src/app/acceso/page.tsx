import { AUTH_ENABLED } from '@/lib/project-phase';
import { ShoppingBag, ShieldCheck } from 'lucide-react';
import { redirect } from 'next/navigation';
import { ProductImage } from '@/components/product-image';
import AccessForm from '@/components/access-form';
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
 return <div className="access-page"><div className="access-brand"><ShoppingBag size={25}/><span>esan<span>emprende</span></span></div><main className="access-layout"><section className="access-story"><h1>Las buenas ideas<br/>empiezan <span>cerca.</span></h1><p>Explora lo que crea nuestra comunidad. Para gestionar tu negocio o publicar, necesitas verificar tu correo institucional.</p><div className="access-photo"><ProductImage src="/images/cookies.jpg" alt="Cookies artesanales, un ejemplo del catálogo de emprendimientos" sizes="(max-width: 760px) 90vw, 620px"/></div><p className="access-caption">Un espacio para los emprendimientos de nuestra U.</p></section><section className="access-panel" aria-labelledby="access-title"><ShieldCheck size={28}/><h2 id="access-title">Publica lo que estás creando.</h2><p>El catálogo se puede explorar sin cuenta. Para crear o gestionar tu negocio, verifica tu correo institucional @ue.edu.pe.</p>{error&&<p role="alert" className="access-error">{errors[error]||errors.expired}</p>}<AccessForm configured={!!client} next={next}/><div className="access-note">Al verificar tu correo, volverás a Mi negocio.</div></section></main><footer className="access-footer">ESAN Emprende · Proyecto estudiantil independiente</footer></div>;
}
