'use client';
import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
export function ActionDialog({title,children,onClose}:{title:string;children:React.ReactNode;onClose:()=>void}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const dialog=ref.current;dialog?.showModal();return()=>dialog?.close()},[]);
 return <dialog ref={ref} className="action-dialog" aria-label={title} onCancel={onClose} onClick={e=>{if(e.target===ref.current)onClose()}}><button className="icon-button action-dialog-close" onClick={onClose} aria-label="Cerrar"><X size={20}/></button><h2>{title}</h2>{children}</dialog>;
}
export function DeleteOfferDialog({name,last,onClose,onDelete,onUnavailable}:{name:string;last?:boolean;onClose:()=>void;onDelete:()=>boolean|void|Promise<boolean|void>;onUnavailable?:()=>boolean|void|Promise<boolean|void>}){
 const [error,setError]=useState('');
 return <ActionDialog title={`¿Eliminar “${name}”?`} onClose={onClose}><p>Dejará de aparecer en tu tienda y no se puede deshacer. Si solo se acabó el stock, márcalo como agotado para conservarlo.</p>{last&&<p>Es tu última publicación. Tu catálogo quedará vacío.</p>}{error&&<p role="alert" className="field-error">{error}</p>}<div className="dialog-actions">{onUnavailable&&<button className="primary" onClick={async()=>{if(await onUnavailable?.()===false)setError('No se pudo guardar el cambio. Inténtalo de nuevo.')}}>Marcar como no disponible</button>}<button className="danger-button" onClick={async()=>{if(await onDelete()===false)setError('No se pudo eliminar. Revisa el espacio del navegador y vuelve a intentarlo.')}}>Confirmar eliminación</button><button className="secondary" onClick={onClose}>Conservar publicación</button></div></ActionDialog>;
}
