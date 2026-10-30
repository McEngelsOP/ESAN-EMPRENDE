'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Check, Download, FlaskConical, LifeBuoy, Settings, ShieldCheck, Store, Trash2, Upload } from 'lucide-react';
import { parseWorkspace } from '@/lib/workspace';
import { isSampleRecord } from '@/lib/demo-content';
import { ActionDialog } from './action-dialog';

/** @param {{authenticated?:boolean,authRequired?:boolean,connected?:boolean,demoMode?:boolean,blocked?:boolean,rawBackup?:string|null,workspace:any,onImport:(data:any)=>boolean,onClear:()=>boolean,onNavigate?:()=>void,onLoadExamples?:()=>boolean,onRemoveExamples?:()=>boolean}} props */
export function SettingsPanel({authenticated=false,authRequired=false,connected=false,demoMode=false,blocked=false,rawBackup=null,workspace,onImport,onClear,onNavigate,onLoadExamples,onRemoveExamples}) {
 const [message,setMessage]=useState('');
 const [error,setError]=useState(false);
 const [dialog,setDialog]=useState('');
 const [confirm,setConfirm]=useState('');
 const [dragging,setDragging]=useState(false);
 const [active,setActive]=useState('cuenta');
 const input=useRef(null);
 const sections=[['cuenta','Cuenta'],['datos','Datos'],['peligro','Riesgo'],['ayuda','Ayuda'],['sobre','Acerca de']];
 const sampleCount=workspace.products.filter(isSampleRecord).length+workspace.reviews.filter(isSampleRecord).length+(isSampleRecord(workspace.business)?1:0);
 function feedback(text,failed=false){setMessage(text);setError(failed)}
 useEffect(()=>{if(!message)return;const timer=setTimeout(()=>setMessage(''),6000);return()=>clearTimeout(timer)},[message]);
 function download(original=false){
  const text=original&&rawBackup!==null?rawBackup:JSON.stringify(workspace,null,2);
  const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));
  const anchor=document.createElement('a');anchor.href=url;anchor.download=original?'esan-emprende-datos-originales.json':'esan-emprende-datos.json';anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  feedback(original?'Datos originales descargados sin modificarlos.':'Copia descargada. Puedes importarla en otro navegador.');
 }
 async function importFile(file){
  if(!file)return;
  try{if(file.size>10*1024*1024)throw Error('size');const next=parseWorkspace(await file.text());if(onImport(next))feedback('Importación completada. Tus registros anteriores se conservaron.');else feedback('No se pudo guardar la importación. Tus datos anteriores siguen intactos.',true)}
  catch{feedback('Elige un JSON de ESAN Emprende válido, de hasta 10 MB.',true)}
 }
 function jump(id){setActive(id);document.getElementById('sx-'+id)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}
 const scope=connected?'Los datos de esta sección son locales. Tu negocio conectado se administra por separado.':'Tus cambios se guardan en este navegador. Descarga una copia para conservarlos.';
 return <section className="settings-page sx-page">
  <div className="settings-intro"><button className="text-button" onClick={onNavigate}><ArrowLeft size={16}/>Volver al inicio</button><h1>Tu espacio, a tu manera.</h1><p>Gestiona tus datos, prueba los ejemplos y encuentra ayuda cuando la necesites.</p></div>
  <nav className="settings-section-nav" aria-label="Secciones de ajustes">{sections.map(([id,label])=><button key={id} aria-current={active===id?'location':undefined} onClick={()=>jump(id)}>{label}</button>)}</nav>
  <div className="settings-content">
   <section className="sx-card settings-account" id="sx-cuenta"><div className="settings-section-title"><Settings size={21}/><div><h2>Cuenta</h2><p>{authenticated?'Sesión institucional verificada.':demoMode?'Exploras un espacio de demostración.':'Exploras sin una sesión institucional.'}</p></div><span className={'account-state '+(authenticated?'verified':'')}><span/>{authenticated?'Verificada':demoMode?'Demo local':'Sin sesión'}</span></div>
    <p>{authenticated?'Para cambiar de cuenta, cierra la sesión desde la cabecera e ingresa con el otro correo institucional.':demoMode?'Aquí puedes editar un negocio ficticio y recorrer todas las funciones locales. Este espacio no envía correos ni modifica cuentas reales.':authRequired?'Verifica tu correo institucional para crear o gestionar tu negocio. El catálogo está abierto para descubrir.':'Puedes preparar un emprendimiento local y revisar cómo se ve antes de conectarlo.'}</p>
    {!authenticated&&!demoMode&&<a className="text-button" href="/demo">Probar la demo completa <ArrowUpRight size={16}/></a>}
   </section>
   <section className="sx-card settings-data" id="sx-datos"><div className="settings-section-title"><Download size={21}/><div><h2>Tus datos de demostración</h2><p>{scope}</p></div></div>
    <dl className="settings-data-summary"><div><dt>Publicaciones</dt><dd>{workspace.products.filter(p=>p.status!=='deleted').length}</dd></div><div><dt>Favoritos</dt><dd>{workspace.saved.length}</dd></div><div><dt>Reseñas</dt><dd>{workspace.reviews.length}</dd></div><div><dt>Perfil local</dt><dd>{workspace.business?'Creado':'Sin crear'}</dd></div></dl>
    {blocked&&<div className="data-recovery" role="alert"><strong>Conservamos tus datos originales.</strong><p>No pudimos leerlos. Descárgalos antes de intentar recuperarlos; no se sobrescribirá el contenido.</p><button className="secondary" onClick={()=>download(true)}>Descargar datos originales <Download size={16}/></button></div>}
    <div className="settings-transfer"><div><h3>Una copia para llevar</h3><p>Exporta perfil, publicaciones, favoritos y reseñas locales en un archivo JSON.</p><button className="secondary" disabled={blocked} onClick={()=>download()}><Download size={17}/>Exportar datos</button></div><div className={'settings-drop '+(dragging?'dragging':'')} onDragOver={e=>{e.preventDefault();setDragging(true)}} onDragLeave={()=>setDragging(false)} onDrop={e=>{e.preventDefault();setDragging(false);if(!blocked)importFile(e.dataTransfer.files[0])}}><h3>Recupera una copia</h3><p>Selecciona o arrastra un JSON de hasta 10 MB. Se conservan los registros existentes.</p><button className="secondary" disabled={blocked} onClick={()=>input.current?.click()}><Upload size={17}/>Importar datos</button><input ref={input} type="file" accept="application/json,.json" hidden aria-label="Archivo de datos de ESAN Emprende" onChange={e=>{importFile(e.target.files?.[0]);e.target.value=''}}/></div></div>
    <div className="sample-controls"><div className="sample-controls-copy"><FlaskConical size={23}/><div><h3>Ejemplos que puedes quitar</h3><p>{workspace.sampleCatalogHidden===true?'El catálogo ficticio está oculto. Puedes restaurarlo cuando quieras.':`${demoMode?'Negocio, publicaciones, reseñas y actividad simulada':'Catálogo de ejemplo'} para recorrer la experiencia. ${sampleCount?sampleCount+' registros ficticios guardados.':''}`}</p></div></div><div className="sample-control-actions"><button className="secondary" disabled={blocked} onClick={()=>{if(onLoadExamples?.())feedback('Ejemplos cargados. Se conservó tu contenido propio.');else feedback('No se pudieron guardar los ejemplos.',true)}}><FlaskConical size={16}/>{workspace.sampleCatalogHidden===true?'Restaurar ejemplos':'Cargar ejemplos'}</button><button className="text-button" disabled={blocked||workspace.sampleCatalogHidden===true&&sampleCount===0} onClick={()=>setDialog('samples')}><Trash2 size={16}/>Quitar datos ficticios</button></div><small>Esta acción conserva lo que hayas creado por tu cuenta. No utiliza Supabase.</small></div>
   </section>
   <section className="sx-card settings-danger" id="sx-peligro"><div className="settings-section-title"><Trash2 size={21}/><div><h2>Zona de riesgo</h2><p>Borra todo el espacio local de esta vista.</p></div></div><div className="settings-danger-row"><p>Elimina el perfil local, las publicaciones, favoritos y reseñas. No borra tu cuenta, los datos conectados ni las copias que descargaste.</p><button className="danger-button" disabled={blocked} onClick={()=>{setDialog('clear');setConfirm('')}}>Eliminar datos locales</button></div></section>
   <section className="sx-card settings-help" id="sx-ayuda"><div className="settings-section-title"><LifeBuoy size={21}/><div><h2>Ayuda y privacidad</h2><p>Respuestas para seguir creando.</p></div></div>
    <details><summary>¿Cómo preparo mi emprendimiento?</summary><p>Abre Mi negocio, completa el perfil y guarda. Después crea una publicación, revisa su vista previa y confirma. Puedes ofrecer productos, servicios o ideas.</p></details>
    <details><summary>¿Dónde se guardan mis cambios?</summary><p>{connected?'El perfil y las publicaciones de Mi negocio se guardan en el espacio privado conectado. Los favoritos, reseñas y copias de esta sección siguen siendo locales. Las fotos y la publicación pública conectadas se habilitarán en otra etapa.':'En esta vista se guardan en tu navegador. Si bloquea el almacenamiento, se mantienen temporalmente mientras la página esté abierta. Exporta una copia para llevarlos a otro dispositivo.'}</p></details>
    <details><summary>¿Qué pasa al quitar los ejemplos?</summary><p>Se oculta el catálogo ficticio y se retiran los registros identificados como ejemplos. El contenido que hayas creado permanece. Puedes restaurar los ejemplos desde Datos.</p></details>
    <details><summary>Privacidad de esta versión</summary><p>Los enlaces de WhatsApp, correo y redes abren servicios externos. Los ejemplos no incluyen contactos reales. Una copia JSON contiene los datos que tú decidas conservar; eliminar este espacio no borra otras copias.</p></details>
    <details><summary>Reglas de la comunidad</summary><p>Publica contenido propio o autorizado, describe lo que ofreces y revisa tus canales de contacto. Las reseñas de demo no acreditan compras y la plataforma no procesa pagos ni entregas.</p></details>
   </section>
   <section className="sx-card settings-about" id="sx-sobre"><div className="settings-section-title"><Store size={21}/><div><h2>Sobre esta versión</h2><p>Un espacio para las ideas de nuestra U.</p></div></div><p>Prototipo independiente para estudiantes de ESAN. Descubre productos, servicios y proyectos, y coordina directamente con cada emprendimiento.</p><p className="settings-scope-note"><ShieldCheck size={18}/>Los nombres, reseñas y cifras de la demo son ficticios.</p></section>
  </div>
  {dialog==='samples'&&<ActionDialog title="¿Quitar los datos ficticios?" onClose={()=>setDialog('')}><p>Se ocultará el catálogo de ejemplo y se retirarán los registros ficticios. Tus publicaciones y reseñas propias se conservarán. Puedes restaurar los ejemplos después.</p><div className="seller-actions"><button className="secondary" onClick={()=>setDialog('')}>Conservar ejemplos</button><button className="danger-button" onClick={()=>{if(onRemoveExamples?.()){setDialog('');feedback('Datos ficticios retirados. Tu contenido propio se conservó.')}else feedback('No se pudieron quitar los ejemplos.',true)}}>Confirmar quitar ejemplos</button></div></ActionDialog>}
  {dialog==='clear'&&<ActionDialog title="¿Eliminar los datos de esta vista?" onClose={()=>setDialog('')}><p>Esta acción no se puede deshacer. Puedes exportar una copia antes.</p><button className="secondary" onClick={()=>download()}><Download size={16}/>Exportar una copia primero</button><label className="clear-confirm-label">Escribe ELIMINAR para confirmar<input value={confirm} onChange={e=>setConfirm(e.target.value)}/></label><div className="seller-actions"><button className="secondary" onClick={()=>setDialog('')}>Cancelar</button><button className="danger-button" disabled={confirm!=='ELIMINAR'} onClick={()=>{if(onClear()){setDialog('');feedback('Datos de esta vista eliminados.')}else feedback('No pudimos eliminar los datos. Inténtalo de nuevo.',true)}}>Eliminar datos</button></div></ActionDialog>}
  {message&&<div className={'settings-feedback '+(error?'error':'')} role="status" aria-live="polite"><Check size={17}/><span>{message}</span></div>}
 </section>;
}
