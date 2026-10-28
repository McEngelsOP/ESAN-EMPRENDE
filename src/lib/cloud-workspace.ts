import { validEmail, validPhone, validSocial } from './workspace';
import type { Business } from './business';
import type { Product } from './data';
export function businessValues(b:Business){
 if(!b.name?.trim()||!b.owner?.trim()||b.description?.trim().length<20||!b.delivery?.trim())throw Error('Completa los datos de la tienda.');
 if(b.name.length>60||b.owner.length>60||b.description.length>600||b.delivery.length>300)throw Error('Revisa la longitud de los campos de la tienda.');
 if((b.whatsapp&&!validPhone(b.whatsapp))||(b.email&&!validEmail(b.email))||(b.social&&!validSocial(b.social)))throw Error('Revisa los canales de contacto.');
 if(b.logo||b.cover)throw Error('La sincronización de imágenes aún no está habilitada. Quita el logo y la portada para guardar en Supabase.');
 return {nombre:b.name.trim(),creador:b.owner.trim(),descripcion:b.description.trim(),coordinacion:b.delivery.trim(),categoria:b.category||null,whatsapp:b.whatsapp||null,correo_contacto:b.email||null,red_social:b.social||null,actualizado_en:new Date().toISOString()};
}
export function productValues(p:Product){
 const kind=p.kind||'Producto';
 if(!['Producto','Servicio','Idea'].includes(kind)||!p.name?.trim()||p.name.length>80||!p.category||!p.description||p.description.trim().length<10||p.description.length>1000)throw Error('Revisa el nombre, categoría y descripción.');
 if(!Number.isFinite(p.price)||p.price<0||p.price>100000||(kind==='Producto'&&p.price<=0)||(kind==='Idea'&&p.price!==0))throw Error('Revisa el precio.');
 if(kind==='Servicio'&&(!p.scope?.trim()||!p.timeline?.trim()))throw Error('Completa el alcance y plazo del servicio.');
 if(kind==='Idea'&&!p.collaborators?.trim())throw Error('Indica qué colaboradores buscas.');
 if(p.image||(p.images?.length||0)>0)throw Error('Las imágenes compartidas se conectarán en la siguiente etapa. Quita las fotos para guardar en Supabase.');
 return {nombre:p.name.trim(),tipo:kind,categoria:p.category,descripcion:p.description.trim(),precio:p.price,disponible:p.available,entrega:p.fulfillment||null,alcance:p.scope||null,plazo:p.timeline||null,etapa:p.stage||null,colaboradores:p.collaborators||null,actualizado_en:new Date().toISOString()};
}
export function cloudBusiness(r:Record<string,unknown>):Business{return {id:String(r.id),name:String(r.nombre),owner:String(r.creador),description:String(r.descripcion),delivery:String(r.coordinacion),contact:'',category:String(r.categoria||''),whatsapp:String(r.whatsapp||''),email:String(r.correo_contacto||''),social:String(r.red_social||'')}}
export function cloudProduct(r:Record<string,unknown>,b:Business):Product{return {id:String(r.id),brandId:b.id,name:String(r.nombre),store:b.name,owner:b.owner,description:String(r.descripcion),category:String(r.categoria),kind:r.tipo as Product['kind'],price:Number(r.precio),available:r.disponible===true,image:'',images:[],fulfillment:String(r.entrega||''),scope:String(r.alcance||''),timeline:String(r.plazo||''),stage:String(r.etapa||''),collaborators:String(r.colaboradores||'')}}
