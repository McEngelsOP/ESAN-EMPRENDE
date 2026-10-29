'use client';
import {useEffect} from 'react';
declare global {interface Window {__favToast?:(name:string,undo:()=>void)=>void}}
export function InterfaceEffects(){
 useEffect(()=>{
  const root=document.documentElement;root.dataset.theme='light';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let frame=0;const timers=new Set<ReturnType<typeof setTimeout>>();
  const later=(callback:()=>void,ms:number)=>{const id=setTimeout(()=>{timers.delete(id);callback()},ms);timers.add(id)};
  const glide=()=>{const nav=document.getElementById('community-navigation'),line=document.querySelector<HTMLElement>('.nav-glider'),active=nav?.querySelector('button.active');if(!nav||!line||!active)return;const a=active.getBoundingClientRect(),b=line.parentElement!.getBoundingClientRect();line.style.width=a.width+'px';line.style.transform=`translateX(${a.left-b.left}px)`;line.style.opacity=getComputedStyle(nav).display==='none'?'0':'1'};
  const scroll=()=>{if(frame)return;frame=requestAnimationFrame(()=>{frame=0;const y=scrollY;root.dataset.scrolled=String(y>60);const header=document.querySelector<HTMLElement>('.community-header');header?.style.setProperty('--scroll',String(y/Math.max(1,root.scrollHeight-innerHeight)));glide()})};
  const observer=new MutationObserver(glide);const header=document.querySelector('.community-header');if(header)observer.observe(header,{subtree:true,childList:true,attributes:true,attributeFilter:['class','aria-current']});
  const pointer=(e:PointerEvent)=>{if(reduced||e.pointerType==='touch')return;const row=(e.target as Element)?.closest<HTMLElement>('.emp-row,.fav-card');if(!row)return;const b=row.getBoundingClientRect();row.style.setProperty('--mx',String((e.clientX-b.left)/b.width-.5));row.style.setProperty('--my',String((e.clientY-b.top)/b.height-.5))};
  const pointerOut=(e:PointerEvent)=>{const row=(e.target as Element)?.closest<HTMLElement>('.emp-row,.fav-card');if(row&&!row.contains(e.relatedTarget as Node)){row.style.removeProperty('--mx');row.style.removeProperty('--my')}};
  window.__favToast=(name,undo)=>{document.querySelectorAll('.fav-toast').forEach(n=>n.remove());const toast=document.createElement('div');toast.className='fav-toast';toast.role='status';const text=document.createElement('span');text.textContent=`Quitaste «${name}» de tus favoritos.`;const button=document.createElement('button');button.type='button';button.textContent='Deshacer';button.onclick=()=>{undo();toast.remove()};toast.append(text,button);document.body.append(toast);later(()=>{toast.classList.add('out');later(()=>toast.remove(),450)},5200)};
  // Dispatch local React handlers without a native form navigation, including sandboxed exports.
  const submit=(form:HTMLFormElement,button:HTMLButtonElement|HTMLInputElement|null)=>{if(button?.disabled)return;if(!form.noValidate&&!form.checkValidity()){form.reportValidity();return}form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))};
  const isLocal=(form:HTMLFormElement|null)=>form?.matches('.business-form,.seller-form,.header-search');
  const click=(e:MouseEvent)=>{const button=(e.target as Element)?.closest<HTMLButtonElement|HTMLInputElement>('button,input[type="submit"]');if(!button||button.type!=='submit'||!isLocal(button.form))return;e.preventDefault();submit(button.form!,button)};
  const key=(e:KeyboardEvent)=>{const active=document.activeElement;const typing=active?.matches('input,textarea,select,[contenteditable="true"]');if(e.key==='/'&&!typing&&!e.metaKey&&!e.ctrlKey&&!e.altKey){e.preventDefault();document.querySelector<HTMLInputElement>('.header-search input')?.focus()}if(e.key==='Escape'&&active?.closest('.header-search'))(active as HTMLElement).blur();if(e.key!=='Enter'||e.isComposing||e.shiftKey||e.ctrlKey||e.metaKey||e.altKey||!(e.target instanceof HTMLInputElement)||['file','button','submit','reset','checkbox','radio'].includes(e.target.type)||!isLocal(e.target.form))return;e.preventDefault();submit(e.target.form!,e.target.form!.querySelector('button[type="submit"],input[type="submit"]'))};
  addEventListener('scroll',scroll,{passive:true});addEventListener('resize',scroll);document.addEventListener('pointermove',pointer,{passive:true});document.addEventListener('pointerout',pointerOut,{passive:true});document.addEventListener('click',click,true);document.addEventListener('keydown',key,true);scroll();document.fonts.ready.then(glide);
  return()=>{cancelAnimationFrame(frame);observer.disconnect();timers.forEach(clearTimeout);removeEventListener('scroll',scroll);removeEventListener('resize',scroll);document.removeEventListener('pointermove',pointer);document.removeEventListener('pointerout',pointerOut);document.removeEventListener('click',click,true);document.removeEventListener('keydown',key,true);delete window.__favToast;document.querySelectorAll('.fav-toast').forEach(n=>n.remove())};
 },[]);
 return null;
}
