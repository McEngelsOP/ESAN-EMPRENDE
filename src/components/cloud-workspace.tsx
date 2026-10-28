'use client';
import { useEffect, useState } from 'react';
import type { Business } from '@/lib/business';
import type { Product } from '@/lib/data';
import { offerPrice } from '@/lib/data';
import { Contacts } from './community-parts';
import { SellerWorkspace } from './seller-workspace';
export function CloudWorkspace(){
 const [data,setData]=useState<{business:Business|null;products:Product[]}>({business:null,products:[]});
 const [preview,setPreview]=useState(false);
 const [ready,setReady]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function load(){const r=await fetch('/api/mi-negocio',{cache:'no-store'});const v=await r.json();if(!r.ok)throw Error(v.error||'No se pudieron cargar los datos.');setData(v);setReady(true)}
 useEffect(()=>{load().catch(e=>setError(e.message))},[]);
 async function save(body:unknown){if(busy)return false;setBusy(true);setError('');try{const r=await fetch('/api/mi-negocio',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const v=await r.json();if(!r.ok)throw Error(v.error||'No se pudieron guardar los cambios.');await load();return true}catch(e){setError(e instanceof Error?e.message:'Error de conexión.');return false}finally{setBusy(false)}}
 if(preview&&data.business)return <section className="store-profile"><div className="owner-preview-banner"><span>Vista previa privada de tu tienda</span><button className="secondary" onClick={()=>setPreview(false)}>Volver a editar</button></div><h1>{data.business.name}</h1><p>{data.business.description}</p><Contacts business={data.business}/><h2>Publicaciones</h2>{data.products.length?data.products.map(p=><article className="seller-row" key={p.id}><div><h3>{p.name}</h3><p>{p.description}</p><strong>{offerPrice(p)}</strong><p>{p.available?'Disponible':'No disponible'}</p></div></article>):<p>Aún no tienes publicaciones.</p>}</section>;
 return <section><p className="seller-demo-note">Espacio privado conectado a Supabase. Las fotos y la publicación pública se habilitarán en otra etapa. Tus datos locales no se importan automáticamente.</p>{error&&<div className="seller-alert" role="alert">{error}<button className="secondary" onClick={()=>{setError('');load().catch(e=>setError(e.message))}}>Reintentar carga</button></div>}{busy&&<p role="status">Guardando en Supabase…</p>}<div inert={busy||undefined}><SellerWorkspace connected business={data.business} products={data.products} ready={ready} onBusiness={value=>save({action:'business',value})} onSave={value=>save({action:'product',value})} onToggle={id=>{const p=data.products.find(p=>p.id===id);return p?save({action:'product',value:{...p,available:!p.available}}):false}} onDelete={id=>save({action:'delete',id})} onProfile={()=>setPreview(true)} onStartEdit={()=>setError('')}/></div></section>
}
