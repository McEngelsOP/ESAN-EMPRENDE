'use client';
import { useActionState } from 'react';
import { ArrowRight, Mail, CheckCircle2 } from 'lucide-react';
import { requestAccess, type AccessState } from '@/app/acceso/actions';
const initial:AccessState={status:'idle',message:''};
export default function AccessForm({configured}:{configured:boolean}){
 const [state,action,pending]=useActionState(requestAccess,initial);
 if(state.status==='sent')return <div className="access-sent" role="status"><CheckCircle2 size={32}/><h2>Tu siguiente paso está en tu correo.</h2><p>Enviamos un enlace a <strong>{state.email}</strong>. Ábrelo en este mismo navegador para entrar.</p><p>Si no aparece, revisa spam. El enlace es de un solo uso.</p><a href="/acceso" className="text-button">Usar otro correo o solicitar otro enlace <ArrowRight size={16}/></a></div>;
 return <form action={action} className="access-form"><label htmlFor="email">Correo institucional</label><div className="access-input"><Mail size={18}/><input id="email" name="email" type="email" autoComplete="email" placeholder="tu.nombre@ue.edu.pe" required maxLength={254} aria-describedby="email-help access-feedback" disabled={pending||!configured}/></div><p id="email-help">Ingresa tu dirección completa terminada en @ue.edu.pe.</p><div id="access-feedback" aria-live="polite">{state.status==='error'&&<p className="access-error" role="alert">{state.message}</p>}{!configured&&<p className="access-error">El acceso está en preparación. Vuelve a intentarlo más tarde.</p>}</div><button className="primary" disabled={pending||!configured}>{pending?'Enviando enlace…':'Recibir enlace de acceso'}<ArrowRight size={18}/></button><small>Te enviaremos un enlace seguro. No necesitas crear una contraseña.</small></form>;
}
