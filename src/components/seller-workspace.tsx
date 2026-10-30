'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, BarChart3, Check, CheckCircle2, Eye, Package, Pencil, Plus, Search, Share2, Store, Trash2, X } from 'lucide-react';
import { type Product, offerPrice, initialProducts, categories } from '@/lib/data';
import { type Business, emptyBusiness } from '@/lib/business';
import { getDemoMetrics } from '@/lib/demo-content';
import { OfferEditor } from './offer-editor';
import { DeleteOfferDialog } from './action-dialog';
import { norm, validEmail, validPhone, validSocial } from '@/lib/workspace';
import { readUploadedImage } from '@/lib/image-upload';
import { ProductImage } from './product-image';

type SellerWorkspaceProps = {
  connected?: boolean;
  demoMode?: boolean;
  business: Business | null;
  products: Product[];
  ready: boolean;
  onBusiness: (business: Business) => boolean | Promise<boolean>;
  onSave: (product: Product) => boolean | Promise<boolean>;
  onToggle: (id: string) => boolean | Promise<boolean>;
  onDelete: (id: string) => boolean | Promise<boolean>;
  onProfile: () => void;
  onStartEdit: () => void;
};

export function SellerWorkspace({ connected = false, demoMode = false, business, products, ready, onBusiness, onSave, onToggle, onDelete, onProfile, onStartEdit }: SellerWorkspaceProps) {
  const [editingBusiness, setEditingBusiness] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [priceId, setPriceId] = useState<string | null>(null);
  const [price, setPrice] = useState('');
  const [priceError, setPriceError] = useState('');
  const [section, setSection] = useState<'resumen' | 'productos' | 'tienda'>('resumen');
  const [editingOffer, setEditingOffer] = useState<Product | true | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [savedOffer, setSavedOffer] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [availability, setAvailability] = useState('all');
  const [operationId, setOperationId] = useState<string | null>(null);
  const [operationError, setOperationError] = useState('');
  const operationLock = useRef(false);
  const available = products.filter(product => product.available).length;
  const visibleProducts = products.filter(product => norm(`${product.name} ${product.kind || 'Producto'} ${product.category}`).includes(norm(search)) && (availability === 'all' || (availability === 'available' ? product.available : !product.available)));
  const metrics = demoMode && !connected ? getDemoMetrics(business) : null;
  const steps = business ? [
    { label: 'Presenta tu emprendimiento', detail: 'Nombre, descripción y coordinación', done: !!(business.name && business.description && business.delivery), action: () => { setEditingBusiness(true); setSection('tienda'); } },
    { label: 'Añade tu primera propuesta', detail: 'Un producto, servicio o idea', done: products.length > 0, action: () => editOffer(true) },
    { label: 'Elige cómo te contactarán', detail: 'WhatsApp, correo o red social', done: !!(business.whatsapp || business.email || business.social), action: () => { setEditingBusiness(true); setSection('tienda'); } },
  ] : [];

  function editOffer(value: Product | true) { onStartEdit(); setEditingOffer(value); setOperationError(''); }
  async function runOperation(id: string, operation: () => boolean | Promise<boolean>) {
    if (operationLock.current) return false;
    operationLock.current = true;
    setOperationId(id);
    setOperationError('');
    try {
      const success = await operation();
      if (!success) setOperationError('No pudimos guardar el cambio. Inténtalo de nuevo; tu publicación se conserva.');
      return success;
    } catch {
      setOperationError('No pudimos guardar el cambio. Inténtalo de nuevo; tu publicación se conserva.');
      return false;
    } finally {
      operationLock.current = false;
      setOperationId(null);
    }
  }

  if (!ready) return <section className="seller-loading" aria-busy="true" role="status"><Store size={26} aria-hidden="true" /><h1>Preparando tu espacio…</h1><p>Estamos cargando el perfil y tus publicaciones.</p></section>;
  if (editingOffer && business) return <OfferEditor connected={connected} key={editingOffer === true ? 'new' : editingOffer.id} business={business} initial={editingOffer === true ? undefined : editingOffer} onSave={async product => { const saved = await onSave(product); if (saved) { setEditingOffer(null); setSection('productos'); setSavedOffer(product); setSearch(''); setAvailability('all'); } return saved; }} onDelete={editingOffer === true ? undefined : async () => { if (await onDelete(editingOffer.id)) { setEditingOffer(null); setSection('productos'); return true; } return false; }} onClose={() => setEditingOffer(null)} />;

  return <section className="seller-workspace">
    <div className="seller-title"><div><h1>{business ? 'Mi negocio' : 'Tu idea empieza aquí.'}</h1><p className="seller-business-name">{business ? business.name : 'Tu emprendimiento'}</p><p>{business ? 'Un espacio para cuidar tu marca y lo que estás creando.' : 'Presenta tu emprendimiento y prepara tu primera propuesta.'}</p></div>{business && <button className="primary" onClick={() => editOffer(true)}><Plus size={18} /> Nueva publicación</button>}</div>
    {business && <div className="seller-header-actions"><button className="secondary" onClick={onProfile}><Eye size={17} /> Ver como visitante</button><button className="secondary" onClick={() => setShareOpen(true)}><Share2 size={17} /> Compartir</button><span className="workspace-storage-label"><span aria-hidden="true" />{connected ? 'Guardado privado en tu cuenta' : demoMode ? 'Espacio de prueba local' : 'Guardado en este navegador'}</span></div>}
    {shareOpen && <SellerShare connected={connected} onClose={() => setShareOpen(false)} />}
    <p className="seller-demo-note">{connected ? 'Espacio privado · Tus cambios se guardan en tu cuenta. La publicación pública y las fotos se habilitarán en otra etapa.' : demoMode ? 'Puedes editar estos ejemplos con libertad. Los datos ficticios se pueden quitar desde Ajustes.' : 'Vista previa sin cuenta · Los cambios se guardan solo en este navegador y no se comparten con otras personas.'}</p>
    {business && <nav className="seller-tabs" aria-label="Secciones de Mi negocio">{([['resumen', 'Resumen'], ['productos', 'Productos'], ['tienda', 'Mi tienda']] as const).map(([key, label]) => <button key={key} type="button" aria-current={section === key ? 'page' : undefined} onClick={() => { if (editingBusiness && key !== section && !window.confirm('¿Salir de la edición del perfil? Los cambios sin guardar se perderán.')) return; setEditingBusiness(key === 'tienda'); setSection(key); }}>{label}{key === 'productos' && <span className="workspace-tab-count" aria-hidden="true">{products.length}</span>}</button>)}</nav>}

    {section === 'resumen' && business && !editingBusiness && <>
      <div className="workspace-summary-grid">
        <section className="workspace-brand-summary" aria-label="Estado de tu emprendimiento">
          <div className="workspace-brand-heading"><div className="workspace-brand-photo"><ProductImage src={business.cover || business.logo || ''} alt="" sizes="120px" /></div><div><h2>{business.name}</h2><p>Creado por {business.owner}</p>{(business as Business & {sampleSet?: string}).sampleSet && <span className="workspace-sample-label">Negocio ficticio</span>}</div></div>
          <p className="workspace-brand-description">{business.description}</p>
          <dl className="workspace-counts"><div><dt>Publicaciones</dt><dd>{products.length}</dd></div><div><dt>Disponibles</dt><dd>{available}</dd></div><div><dt>En pausa</dt><dd>{products.length - available}</dd></div></dl>
          <button className="text-button" onClick={() => { onStartEdit(); setEditingBusiness(true); setSection('tienda'); }}>Editar la presentación de mi tienda <ArrowUpRight size={16} /></button>
        </section>
        <section className="workspace-checklist" aria-labelledby="workspace-checklist-title"><div className="workspace-checklist-heading"><h2 id="workspace-checklist-title">Tu tienda, paso a paso.</h2><span>{steps.filter(step => step.done).length} de {steps.length} listos</span></div><ul>{steps.map(step => <li key={step.label}><span className={'workspace-step-state' + (step.done ? ' complete' : '')} aria-label={step.done ? 'Completado' : 'Pendiente'}>{step.done ? <Check size={14} /> : <span />}</span><div><strong>{step.label}</strong><p>{step.detail}</p></div><button type="button" className="icon-button" aria-label={`${step.done ? 'Revisar' : 'Completar'}: ${step.label}`} onClick={step.action}><ArrowRight size={17} /></button></li>)}</ul></section>
      </div>
      <section className="seller-overview" aria-label="Resumen de actividad"><div className="seller-overview-heading"><div><h2>{metrics ? 'Así se ve la actividad de una tienda.' : 'Actividad de tu tienda'}</h2><p>{metrics ? 'Actividad de ejemplo · datos ficticios' : 'La medición de visitas y contactos aún no está conectada.'}</p></div><BarChart3 size={22} aria-hidden="true" /></div>
        {metrics ? <><dl className="workspace-demo-stats"><div><dt>Visitas al perfil</dt><dd>{metrics.visits}</dd></div><div><dt>Clics en contactar</dt><dd>{metrics.contacts}</dd></div><div><dt>Guardados</dt><dd>{metrics.saves}</dd></div></dl><figure className="workspace-activity"><figcaption>Visitas durante una semana de ejemplo</figcaption><div className="workspace-activity-bars">{metrics.days.map(day => <div key={day.label}><strong>{day.visits}</strong><span className="workspace-bar-track" aria-hidden="true"><span style={{ height: `${day.visits / Math.max(...metrics.days.map(value => value.visits), 1) * 100}%` }} /></span><span>{day.label}</span></div>)}</div><p>Esta actividad es simulada. No representa visitas, ventas ni contactos reales.</p></figure></> : <div className="workspace-activity-pending"><BarChart3 size={28} aria-hidden="true" /><div><h3>Tu actividad tendrá su lugar aquí.</h3><p>Cuando se active la medición podrás consultar visitas, contactos y guardados. Por ahora puedes preparar tu perfil y tus propuestas.</p></div></div>}
        <div className="seller-quick-actions"><button className="primary" onClick={() => editOffer(true)}><Plus size={17} /> Agregar producto</button><button className="secondary" onClick={() => setSection('productos')}>Administrar publicaciones <ArrowRight size={16} /></button></div>
      </section>
    </>}

    {(!business || editingBusiness || section === 'tienda') && <BusinessForm connected={connected} key={business?.id || business?.name || 'new'} initial={business} onSave={async value => { const saved = await onBusiness(value); if (saved) { setEditingBusiness(false); setSection('resumen'); } return saved; }} onCancel={business ? () => { setEditingBusiness(false); setSection('resumen'); } : undefined} />}
    {savedOffer && <div className="saved-offer-banner" role="status"><CheckCircle2 size={22} aria-hidden="true" /><div><strong>Publicación guardada</strong><p>{connected ? 'Los cambios están guardados en tu cuenta.' : 'Los cambios están guardados en este navegador.'}</p></div><button className="secondary" onClick={onProfile}>Ver como visitante</button><button className="icon-button" aria-label="Cerrar confirmación" onClick={() => setSavedOffer(null)}><X size={18} /></button></div>}

    {(!business || section !== 'tienda') && <>
      <div className="section-title seller-section-title"><div><h2>Mis publicaciones <span>{products.length}</span></h2><p>Productos, servicios e ideas de tu emprendimiento.</p></div><span className="muted">{available} disponibles</span></div>
      {products.length > 0 && <div className="workspace-publication-tools"><label className="search"><Search size={17} aria-hidden="true" /><input aria-label="Buscar mis publicaciones" placeholder="Busca una publicación…" value={search} onChange={event => setSearch(event.target.value)} />{search && <button type="button" className="icon-button" aria-label="Limpiar búsqueda de mis publicaciones" onClick={() => setSearch('')}><X size={16} /></button>}</label><label className="workspace-availability-filter"><span>Mostrar</span><select aria-label="Disponibilidad de mis publicaciones" value={availability} onChange={event => setAvailability(event.target.value)}><option value="all">Todas</option><option value="available">Disponibles</option><option value="paused">En pausa</option></select></label></div>}
      {operationError && <p className="seller-alert" role="alert">{operationError}</p>}
      {products.length === 0 ? <div className="empty"><Package size={32} /><h3>{business ? 'Tu primera propuesta, a un paso.' : 'Primero, dale nombre a tu emprendimiento.'}</h3><p>{business ? 'Publica un producto, un servicio o una idea y revisa cómo se verá antes de guardarla.' : 'Completa el perfil de arriba para preparar tu primera publicación.'}</p>{business && <button className="primary" onClick={() => editOffer(true)}>Crear mi primera publicación <Plus size={16} /></button>}</div> : visibleProducts.length === 0 ? <div className="empty workspace-no-results"><Search size={26} /><h3>No encontramos esa publicación.</h3><p>Prueba otro nombre o cambia la disponibilidad.</p><button className="text-button" onClick={() => { setSearch(''); setAvailability('all'); }}>Limpiar búsqueda y filtros</button></div> : <div className="seller-list">{visibleProducts.map(product => <div key={product.id} className="seller-row" aria-busy={operationId === product.id}>
        <ProductImage src={product.image} alt="" sizes="90px" /><div className="seller-row-copy"><strong>{product.name}</strong>{savedOffer?.id === product.id && <span className="new-offer-label">Nuevo / actualizado</span>}<span>{product.kind || 'Producto'} · {offerPrice(product)}</span>
          {priceId === product.id ? <div className="seller-price-edit"><label>Nuevo precio (S/)<input type="number" min={product.kind === 'Servicio' ? '0' : '0.01'} max="100000" step="0.01" value={price} onChange={event => { setPrice(event.target.value); setPriceError(''); }} /></label><button className="secondary" disabled={operationId !== null} onClick={async () => { const amount = Number(price); if (!Number.isFinite(amount) || (product.kind === 'Servicio' ? amount < 0 : amount <= 0) || amount > 100000 || !/^\d+(?:[.,]\d{1,2})?$/.test(price)) { setPriceError(product.kind === 'Servicio' ? 'Ingresa un precio de cero o más, con hasta dos decimales.' : 'Ingresa un precio mayor que cero, con hasta dos decimales.'); return; } if (await runOperation(product.id, () => onSave({ ...product, price: amount }))) setPriceId(null); else setPriceError('No pudimos guardar el precio.'); }}>{operationId === product.id ? 'Guardando…' : 'Guardar precio'}</button><button className="text-button" disabled={operationId !== null} onClick={() => { setPriceId(null); setPriceError(''); }}>Cancelar</button>{priceError && <p role="alert">{priceError}</p>}</div> : product.kind !== 'Idea' && <button className="seller-price-button" onClick={() => { setPriceId(product.id); setPrice(String(product.price)); setPriceError(''); }}>Actualizar precio <Pencil size={13} /></button>}
          <small className={product.available ? 'status-live' : 'status-paused'}>{product.available ? 'Disponible' : (product.kind || 'Producto') === 'Producto' ? 'Agotado' : 'No disponible'}</small></div>
        <div className="seller-row-actions"><button className="secondary" disabled={!business || operationId !== null} onClick={() => editOffer(product)}><Pencil size={15} /> Editar</button><button className="secondary" disabled={operationId !== null} onClick={() => runOperation(product.id, () => onToggle(product.id))}>{operationId === product.id ? 'Guardando…' : product.available ? ((product.kind || 'Producto') === 'Producto' ? 'Marcar agotado' : 'Pausar') : 'Activar'}</button><button className="icon-button" disabled={operationId !== null} aria-label={`Eliminar ${product.name}`} onClick={() => setDeleting(product.id)}><Trash2 size={18} /></button></div>
        {deleting === product.id && <DeleteOfferDialog name={product.name} last={products.length === 1} onClose={() => setDeleting(null)} onDelete={async () => { const success = await runOperation(product.id, () => onDelete(product.id)); if (success) setDeleting(null); return success; }} onUnavailable={product.available ? async () => { const success = await runOperation(product.id, () => onToggle(product.id)); if (success) setDeleting(null); return success; } : undefined} />}
      </div>)}</div>}
    </>}
  </section>;
}

function SellerShare({ connected, onClose }: { connected: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current; dialog?.showModal(); return () => dialog?.close(); }, []);
  return <dialog ref={ref} className="seller-share-dialog" aria-labelledby="share-title" onCancel={onClose} onClick={event => { if (event.target === ref.current) onClose(); }}><button className="icon-button seller-share-close" onClick={onClose} aria-label="Cerrar"><X size={19} /></button><h2 id="share-title">Comparte tu tienda</h2><p>{connected ? 'Tu tienda está guardada de forma privada en tu cuenta. El enlace para compartir estará disponible cuando se habilite la publicación pública.' : 'Tu tienda está guardada solo en este navegador. Los enlaces públicos estarán disponibles cuando conectemos la publicación compartida.'}</p><label className="share-link-field">Enlace de tu tienda<input disabled placeholder="Disponible al conectar la publicación pública" /></label><div className="share-channel-options"><button className="secondary" disabled>Copiar enlace</button><button className="secondary" disabled>WhatsApp</button><button className="secondary" disabled>Copiar para Instagram</button><button className="secondary" disabled>Más opciones</button></div><p>{connected ? 'Puedes seguir preparando tus propuestas y revisar la vista previa privada desde Mi negocio.' : 'Por ahora puedes exportar tus datos desde Ajustes para llevarlos a otro navegador.'}</p><button className="primary" onClick={onClose}>Entendido</button></dialog>;
}

function BusinessForm({ connected = false, initial, onSave, onCancel }: { connected?: boolean; initial: Business | null; onSave: (business: Business) => boolean | Promise<boolean>; onCancel?: () => void }) {
  const [draft, setDraft] = useState(initial || emptyBusiness);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [discard, setDiscard] = useState(false);
  const saveLock = useRef(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial || emptyBusiness);
  useEffect(() => { if (error) requestAnimationFrame(() => document.querySelector<HTMLElement>('.business-form [role="alert"]')?.scrollIntoView({ block: 'center', behavior: 'auto' })); }, [error]);
  function field(key: keyof Business, value: string) { setDraft(current => ({ ...current, [key]: value })); setError(''); }

  return <form className="business-form" noValidate aria-busy={saving} onSubmit={async event => {
    event.preventDefault();
    if (uploading || saveLock.current) return;
    setError('');
    const business = Object.fromEntries(Object.entries(draft).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])) as Business;
    business.category = business.category || categories[1];
    if (!business.name || !business.owner || !business.description || business.description.length < 20 || !business.delivery) { setError('Completa el nombre, tu nombre, una descripción de al menos 20 caracteres y la forma de coordinar.'); return; }
    if (initialProducts.some(product => product.store.toLocaleLowerCase() === business.name.toLocaleLowerCase())) { setError('Ese nombre ya pertenece a un emprendimiento de ejemplo. Elige otro para distinguir el tuyo.'); return; }
    if (business.whatsapp && !validPhone(business.whatsapp)) { setError('Escribe un WhatsApp peruano válido de 9 dígitos, empezando con 9.'); return; }
    if (business.email && !validEmail(business.email)) { setError('Revisa el correo de contacto.'); return; }
    if (business.social && !validSocial(business.social)) { setError('La red social debe ser una dirección http o https completa.'); return; }
    saveLock.current = true;
    setSaving(true);
    try { if (!await onSave(business)) setError(connected ? 'No pudimos guardar el perfil. Revisa el aviso de conexión y vuelve a intentarlo.' : 'No pudimos guardar el perfil. Revisa el espacio del navegador y vuelve a intentarlo.'); } catch { setError('No pudimos guardar el perfil. Tus cambios siguen en el formulario; vuelve a intentarlo.'); } finally { saveLock.current = false; setSaving(false); }
  }}>
    <div className="business-form-heading"><Store size={24} aria-hidden="true" /><div><h2>{initial ? 'La presentación de tu tienda.' : 'Crea el perfil de tu emprendimiento'}</h2><p>{connected ? 'Prepara la información de tu perfil privado.' : 'Así conocerá tu comunidad lo que estás creando.'}</p></div></div>
    <fieldset className="business-field-group"><legend>Sobre tu emprendimiento</legend><p>Los datos esenciales para darle nombre y contexto a tu propuesta.</p><div className="form-row"><label>Nombre del emprendimiento<input required maxLength={60} pattern=".*\S.*" value={draft.name} onChange={event => field('name', event.target.value)} placeholder="Ej. Taller entre clases" /></label><label>Tu nombre<input required maxLength={60} pattern=".*\S.*" value={draft.owner} onChange={event => field('owner', event.target.value)} placeholder="Cómo te conocerá la comunidad" /></label></div><label>Descripción del emprendimiento<textarea aria-label="Descripción del emprendimiento" required minLength={20} maxLength={600} rows={3} value={draft.description} onChange={event => field('description', event.target.value)} placeholder="Qué creas, para quién y qué hace especial a tu emprendimiento." /><small>{draft.description.length}/600 caracteres · mínimo 20</small></label><label>Categoría principal<select value={draft.category || categories[1]} onChange={event => field('category', event.target.value)}>{categories.slice(1).map(category => <option key={category}>{category}</option>)}</select></label><label>Entrega o forma de coordinar<textarea required maxLength={300} rows={2} value={draft.delivery} onChange={event => field('delivery', event.target.value)} placeholder="Ej. Entregas en el campus. Coordinación con un día de anticipación." /></label></fieldset>
    <fieldset className="business-field-group"><legend>Cómo pueden contactarte</legend><p>Opcional. Solo se mostrarán como enlaces los canales válidos que añadas.</p><div className="form-row"><label>WhatsApp de contacto (opcional)<input inputMode="tel" maxLength={20} value={draft.whatsapp || ''} onChange={event => field('whatsapp', event.target.value)} placeholder="Tu número móvil peruano" /></label><label>Correo de contacto (opcional)<input type="email" maxLength={180} value={draft.email || ''} onChange={event => field('email', event.target.value)} placeholder="hola@tuemprendimiento.com" /></label></div><label>Enlace a tu red social (opcional)<input type="url" maxLength={300} value={draft.social || ''} onChange={event => field('social', event.target.value)} placeholder="https://www.instagram.com/tuemprendimiento" /></label><label>Canal de contacto de referencia (opcional)<input maxLength={120} value={draft.contact} onChange={event => field('contact', event.target.value)} placeholder="Ej. @mi.emprendimiento" /><small>Este texto sirve de referencia; no genera un enlace de contacto.</small></label></fieldset>
    <fieldset className="business-field-group"><legend>La imagen de tu marca</legend><p>{connected ? 'Las fotos se habilitarán cuando conectemos su almacenamiento. Puedes guardar tu perfil sin imágenes.' : 'Logo y portada son opcionales. Puedes añadirlos después.'}</p><div className="brand-upload-grid">{(['logo', 'cover'] as const).map(key => <div key={key}><label>{key === 'logo' ? 'Logo' : 'Portada'} (opcional)<input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading || connected || saving} onChange={async event => { const file = event.target.files?.[0]; event.target.value = ''; if (!file) return; setUploading(true); try { field(key, await readUploadedImage(file)); } catch (failure) { setError(failure instanceof Error ? failure.message : 'No se pudo leer la imagen.'); } finally { setUploading(false); } }} /></label><div className="brand-upload-preview"><ProductImage src={draft[key] || ''} alt={key === 'logo' ? 'Logo del emprendimiento' : 'Portada del emprendimiento'} /></div>{draft[key] && <button type="button" className="text-button" onClick={() => field(key, '')}>Quitar imagen</button>}</div>)}</div><small>{connected ? 'Carga de imágenes pendiente en el espacio conectado.' : 'JPG, PNG o WebP de hasta 5 MB. Se comprimen y guardan solo en este navegador.'}</small></fieldset>
    {error && <p role="alert" className="access-error">{error}</p>}
    {discard && <div className="seller-alert" role="alert"><strong>¿Descartar los cambios del perfil?</strong><p>Los cambios sin guardar se perderán.</p><div className="seller-actions"><button className="secondary" type="button" onClick={() => setDiscard(false)}>Seguir editando</button><button className="danger-button" type="button" onClick={onCancel}>Descartar cambios</button></div></div>}
    <div className="seller-actions business-save-actions"><span>{connected ? 'Guardado privado en tu cuenta.' : 'Guardado local en este navegador.'}</span>{onCancel && <button className="secondary" type="button" disabled={saving} onClick={() => dirty ? setDiscard(true) : onCancel()}>Cancelar</button>}<button className="primary" type="submit" disabled={uploading || saving}><Check size={17} />{saving ? ' Guardando perfil…' : ' Guardar perfil'}</button></div>
  </form>;
}
