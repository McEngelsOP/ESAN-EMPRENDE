'use client';

import { useActionState, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Sprout } from 'lucide-react';
import { requestAccess, requestGoogleAccess, type AccessState } from '@/app/acceso/actions';

type Mode = 'login' | 'create' | 'recover';
const initial: AccessState = { status: 'idle', message: '' };
const copy = {
  login: { title: 'Tu próxima idea empieza aquí.', description: 'Tu comunidad. Tus ideas. Tu siguiente paso.', button: 'Continuar con correo' },
  create: { title: 'Aquí empieza tu idea.', description: 'Crea tu cuenta con tu correo institucional.', button: 'Crear cuenta' },
  recover: { title: 'Vuelve a tu comunidad.', description: 'Recibe un enlace para recuperar el acceso.', button: 'Recuperar cuenta' },
};

export default function DesktopAccess({ configured, next, error }: { configured: boolean; next: string; error?: string }) {
  const [mode, setMode] = useState<Mode>('login');
  const email = useRef<HTMLInputElement>(null);
  const [state, action, pending] = useActionState(requestAccess, initial);
  const [googleState, googleAction, googlePending] = useActionState(requestGoogleAccess, initial);
  const busy = pending || googlePending;
  function changeMode(value: Mode) { setMode(mode === value ? 'login' : value); email.current?.focus(); }
  return <div className="editorial-access">
    <header className="ea-header"><a className="ea-brand" href="/" aria-label="Emprende Esanino, ir al inicio"><Sprout size={33} strokeWidth={1.5} aria-hidden="true"/><span>Emprende Esanino</span></a></header>
    <main className="ea-main">
      <section className="ea-content" aria-labelledby="ea-title">
        {state.status === 'sent' ? <div className="ea-sent" role="status"><CheckCircle2 size={36} aria-hidden="true"/><h1 id="ea-title">Revisa tu correo.</h1><p>Si tu cuenta puede continuar, recibirás un enlace en <strong>{state.email}</strong>. Ábrelo en este mismo navegador. Si no aparece, revisa spam.</p><a className="ea-button ea-primary" href={`/acceso?next=${encodeURIComponent(next)}`}>Volver a iniciar sesión</a></div> : <>
          <div className="ea-heading"><h1 id="ea-title">{copy[mode].title}</h1><p>{copy[mode].description}</p></div>
          <div className="ea-card">
            <form action={googleAction} aria-busy={googlePending}><input type="hidden" name="next" value={next}/><button type="submit" className="ea-button ea-google" disabled={busy || !configured}><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.8 3-4.3 3-7.4Z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.7-5.6-4H3.1v2.6A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.4 14a6 6 0 0 1 0-4V7.4H3.1a10 10 0 0 0 0 9.2L6.4 14Z"/><path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.9 1.5l2.9-2.9A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.9 5.4L6.4 10c.8-2.3 3-4 5.6-4Z"/></svg>{googlePending ? 'Conectando…' : 'Continuar con Google'}</button></form>
            <div className="ea-divider"><span>o con tu correo institucional</span></div>
            <form action={action} className="ea-form" aria-busy={pending}><input type="hidden" name="next" value={next}/><input type="hidden" name="intent" value={mode}/><label htmlFor="ea-email">Correo institucional</label><input ref={email} id="ea-email" name="email" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} placeholder="tu.nombre@ue.edu.pe" required maxLength={254} disabled={busy || !configured} aria-describedby="ea-email-help ea-feedback"/><p id="ea-email-help">Te enviaremos un enlace seguro. Sin contraseña.</p><div id="ea-feedback" aria-live="polite">{error && <p className="ea-error" role="alert">{error}</p>}{state.status === 'error' && <p className="ea-error" role="alert">{state.message}</p>}{googleState.status === 'error' && <p className="ea-error" role="alert">{googleState.message}</p>}{!configured && <p className="ea-error">El acceso está en preparación. Puedes continuar como invitado.</p>}</div><button type="submit" className="ea-button ea-primary" disabled={busy || !configured}>{pending ? 'Enviando enlace…' : copy[mode].button}<ArrowRight size={18} aria-hidden="true"/></button></form>
            <nav className="ea-links" aria-label="Opciones de cuenta"><button type="button" disabled={busy} onClick={() => changeMode('create')}>{mode === 'create' ? 'Iniciar sesión' : 'Crear cuenta'}</button><button type="button" disabled={busy} onClick={() => changeMode('recover')}>{mode === 'recover' ? 'Iniciar sesión' : 'Recuperar cuenta'}</button></nav><p className="ea-note">Acceso con tu cuenta institucional @ue.edu.pe.</p>
          </div><a className="ea-button ea-guest" href="/">Continuar como invitado <ArrowRight size={18} aria-hidden="true"/></a>
        </>}
      </section>
      <figure className="ea-art"><img src="/images/login-mountains.png" alt="Pintura de montañas entre la niebla y una iglesia a orillas de un lago."/></figure>
    </main>
    <footer className="ea-footer"><span>Un espacio para las ideas de nuestra U.</span></footer>
  </div>;
}
