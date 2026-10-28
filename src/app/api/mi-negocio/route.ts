import { CLOUD_ENABLED } from '@/lib/project-phase';
import { supabaseServer } from '@/lib/supabase/server';
import { allowedUser } from '@/lib/auth-policy';
import { businessValues, productValues, cloudBusiness, cloudProduct } from '@/lib/cloud-workspace';
import type { Business } from '@/lib/business';
import type { Product } from '@/lib/data';
export const dynamic='force-dynamic';
const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store'}});
async function session(){if(!CLOUD_ENABLED)return null;const client=await supabaseServer();if(!client)return null;const {data:{user},error}=await client.auth.getUser();return !error&&allowedUser(user)?{client,user:user!}:null}
export async function GET(){const s=await session();if(!s)return json({error:'Inicia sesión con tu correo institucional.'},401);const {data:row,error}=await s.client.from('esan_tiendas').select('*').eq('propietario_id',s.user.id).maybeSingle();if(error)return json({error:'No pudimos cargar tu tienda. Revisa que las tablas y permisos estén instalados.'},503);if(!row)return json({business:null,products:[]});const {data:rows,error:err}=await s.client.from('esan_publicaciones').select('*').eq('tienda_id',row.id).order('creado_en',{ascending:false});if(err)return json({error:'No pudimos cargar las publicaciones.'},503);const business=cloudBusiness(row);return json({business,products:(rows||[]).map(r=>cloudProduct(r,business))})}
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Origen no permitido.'},403);
 const s=await session();if(!s)return json({error:'Tu sesión no está disponible. Vuelve a iniciar sesión.'},401);
 if(Number(request.headers.get('content-length')||0)>100000)return json({error:'La solicitud supera el límite.'},413);
 try{const text=await request.text();if(text.length>100000)return json({error:'La solicitud supera el límite.'},413);const body=JSON.parse(text);
 const {data:store,error}=await s.client.from('esan_tiendas').select('*').eq('propietario_id',s.user.id).maybeSingle();if(error)return json({error:'No pudimos consultar tu tienda.'},503);
 if(body.action==='business'){const values=businessValues(body.value as Business);const result=store?await s.client.from('esan_tiendas').update(values).eq('id',store.id).eq('propietario_id',s.user.id).select('id').single():await s.client.from('esan_tiendas').insert({...values,propietario_id:s.user.id,slug:'tienda-'+crypto.randomUUID()}).select('id').single();if(result.error)return json({error:'No se pudo guardar la tienda. Revisa los campos y permisos.'},400);return json({ok:true})}
 if(!store)return json({error:'Crea primero tu tienda.'},409);
 if(body.action==='product'){const values=productValues(body.value as Product);const id=String(body.value?.id||'').replace(/^local-/,'');if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))return json({error:'El identificador de la publicación no es válido.'},400);const result=await s.client.from('esan_publicaciones').upsert({...values,id,tienda_id:store.id},{onConflict:'id'}).select('id').single();if(result.error)return json({error:'No se pudo guardar la publicación. Revisa sus campos y permisos.'},400);return json({ok:true})}
 if(body.action==='delete'){const result=await s.client.from('esan_publicaciones').delete().eq('id',String(body.id)).eq('tienda_id',store.id).select('id').single();if(result.error)return json({error:'No se pudo eliminar la publicación.'},400);return json({ok:true})}
 return json({error:'Acción no válida.'},400);
 }catch(e){return json({error:e instanceof Error?e.message:'Solicitud no válida.'},400)}
}
