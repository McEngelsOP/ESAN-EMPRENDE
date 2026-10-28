'use client';

import { useActionState, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Mail, Sprout } from 'lucide-react';
import { requestAccess, requestGoogleAccess, type AccessState } from '@/app/acceso/actions';

type Mode = 'login' | 'create' | 'recover';
const initial: AccessState = { status: 'idle', message: '' };
const copy = {
  login: { title: 'Bienvenido de nuevo.', description: 'Tu comunidad. Tus ideas. Tu siguiente paso.', button: 'Iniciar sesión' },
  create: { title: 'Aquí empieza tu idea.', description: 'Crea tu cuenta con tu correo institucional.', button: 'Crear cuenta' },
  recover: { title: 'Vuelve a tu comunidad.', description: 'Recibe un enlace para recuperar el acceso.', button: 'Recuperar cuenta' },
};

export default function MobileAccess({ configured, next, error }: { configured: boolean; next: string; error?: string }) {
  const [mode, setMode] = useState<Mode>('login');
  const email = useRef<HTMLInputElement>(null);
  const [state, action, pending] = useActionState(requestAccess, initial);
  const [googleState, googleAction, googlePending] = useActionState(requestGoogleAccess, initial);
  const busy = pending || googlePending;
  const current = copy[mode];
  function changeMode(value: Mode) {
    setMode(value);
    email.current?.focus();
  }
  return <div className="mobile-access">
    <main className="mobile-login-panel" aria-labelledby="mobile-access-title">
      <a className="mobile-login-brand" href="/" aria-label="Emprende Esanino, ir al inicio">
        <span className="mobile-login-mark"><Sprout size={25} strokeWidth={1.5} aria-hidden="true" /></span>
        <span>EMPRENDE<br /><strong>ESANINO</strong></span>
      </a>
      <div className="mobile-login-content">
      {state.status === 'sent' ? <section className="mobile-login-sent" role="status">
        <CheckCircle2 size={36} strokeWidth={1.5} aria-hidden="true" />
        <h1 id="mobile-access-title">Revisa tu correo.</h1>
        <p>Si tu cuenta puede continuar, recibirás un enlace en <strong>{state.email}</strong>.</p>
        <p>Ábrelo en este mismo navegador. Si no aparece, revisa spam.</p>
        <a className="mobile-login-secondary" href={`/acceso?next=${encodeURIComponent(next)}`}>Volver a iniciar sesión <ArrowLeft size={18} aria-hidden="true" /></a>
      </section> : <>
        <div className="mobile-login-heading">
          <h1 id="mobile-access-title">{current.title}</h1>
          <p>{current.description}</p>
        </div>
        {error ? <p className="mobile-login-error" role="alert">{error}</p> : null}
        <form action={action} className="mobile-login-form" aria-busy={pending}>
          <input type="hidden" name="next" value={next} />
          <input type="hidden" name="intent" value={mode} />
          <label htmlFor="mobile-email">Correo institucional</label>
          <div className="mobile-login-input"><Mail size={19} strokeWidth={1.5} aria-hidden="true" /><input ref={email} id="mobile-email" name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} placeholder="tu.nombre@ue.edu.pe" required maxLength={254} disabled={busy || !configured} aria-describedby="mobile-email-help mobile-access-feedback" /></div>
          <p id="mobile-email-help">Te enviaremos un enlace seguro. Sin contraseña.</p>
          <div id="mobile-access-feedback" aria-live="polite">
            {state.status === 'error' ? <p className="mobile-login-error" role="alert">{state.message}</p> : null}
            {!configured ? <p className="mobile-login-error">El acceso está en preparación. Puedes continuar como invitado.</p> : null}
          </div>
          <button type="submit" className="mobile-login-primary" disabled={busy || !configured}>{pending ? 'Enviando enlace…' : current.button}<ArrowRight size={20} aria-hidden="true" /></button>
        </form>
        <a className="mobile-login-secondary" href="/">Continuar como invitado <ArrowRight size={18} aria-hidden="true" /></a>
        <div className="mobile-login-divider"><span>o continúa con</span></div>
        <form action={googleAction} aria-busy={googlePending}>
          <input type="hidden" name="next" value={next} />
          <button className="mobile-login-google" type="submit" disabled={busy || !configured}><svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.8 3-4.3 3-7.4Z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.7-5.6-4H3.1v2.6A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.4 14a6 6 0 0 1 0-4V7.4H3.1a10 10 0 0 0 0 9.2L6.4 14Z"/><path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.9 1.5l2.9-2.9A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.9 5.4L6.4 10c.8-2.3 3-4 5.6-4Z"/></svg>{googlePending ? 'Conectando…' : 'Continuar con Google'}</button>
          {googleState.status === 'error' ? <p className="mobile-login-error" role="alert">{googleState.message}</p> : null}
        </form>
        <nav className="mobile-login-links" aria-label="Opciones de cuenta">
          <button type="button" onClick={() => changeMode(mode === 'create' ? 'login' : 'create')} disabled={busy}>{mode === 'create' ? 'Iniciar sesión' : 'Crear cuenta'}</button>
          <span aria-hidden="true" />
          <button type="button" onClick={() => changeMode(mode === 'recover' ? 'login' : 'recover')} disabled={busy}>{mode === 'recover' ? 'Iniciar sesión' : 'Recuperar cuenta'}</button>
        </nav>
      </>}
      </div>
      <p className="mobile-login-note">Un espacio para las ideas de nuestra U.<br />Acceso con tu cuenta institucional @ue.edu.pe.</p>
    </main>
  </div>;
}
