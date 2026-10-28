'use client';
import { useActionState } from 'react';
import { ArrowRight, Mail, CheckCircle2 } from 'lucide-react';
import { requestAccess, type AccessState } from '@/app/acceso/actions';
const initial:AccessState={status:'idle',message:''};
export default function AccessForm({configured,next='/'}:{configured:boolean;next?:string}){
 const [state,action,pending]=useActionState(requestAccess,initial);
 const retryUrl=next==='/'?'/acceso':`/acceso?next=${encodeURIComponent(next)}`;
 if(state.status==='sent')return <div className="access-sent" role="status"><CheckCircle2 size={32}/><h2>Tu siguiente paso está en tu correo.</h2><p>Enviamos un enlace a <strong>{state.email}</strong>. Ábrelo en este mismo navegador para verificar tu cuenta.</p><p>Si no aparece, revisa spam. El enlace es de un solo uso.</p><a href={retryUrl} className="text-button">Usar otro correo o solicitar otro enlace <ArrowRight size={16}/></a></div>;
 return <form action={action} className="access-form"><input type="hidden" name="next" value={next}/><label htmlFor="email">Correo institucional</label><div className="access-input"><Mail size={18}/><input id="email" name="email" type="email" autoComplete="email" placeholder="tu.nombre@ue.edu.pe" required maxLength={254} aria-describedby="email-help access-feedback" disabled={pending||!configured}/></div><p id="email-help">Ingresa tu dirección completa terminada en @ue.edu.pe.</p><div id="access-feedback" aria-live="polite">{state.status==='error'&&<p className="access-error" role="alert">{state.message}</p>}{!configured&&<p className="access-error">El acceso está en preparación. Vuelve a intentarlo más tarde.</p>}</div><button className="primary" disabled={pending||!configured}>{pending?'Enviando enlace…':'Recibir enlace para crear o ingresar'}<ArrowRight size={18}/></button><small>El enlace verifica tu correo y te permite continuar. No necesitas contraseña.</small></form>;
}
