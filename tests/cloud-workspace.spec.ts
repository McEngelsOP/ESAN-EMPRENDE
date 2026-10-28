import { test, expect } from '@playwright/test';
import { businessValues, productValues, cloudBusiness, cloudProduct } from '../src/lib/cloud-workspace';
import { BUSINESS_WORKSPACE_PATH, postAuthDestination } from '../src/lib/auth-policy';
test('API privada rechaza solicitudes sin sesión y sin activación',async({request})=>{
 expect((await request.get('/api/mi-negocio')).status()).toBe(401);
 expect((await request.post('/api/mi-negocio',{data:{action:'business',value:{}}})).status()).toBe(403);
});
test('contrato privado valida tipos, precios e imágenes antes de guardar',()=>{
 const business={name:'Tienda',owner:'Andrea',description:'Descripción suficientemente larga para el negocio.',delivery:'Campus',contact:''};
 expect(businessValues(business).nombre).toBe('Tienda');
 expect(()=>businessValues({...business,logo:'data:image/png;base64,x'})).toThrow('imágenes');
 const p={id:'local-1',name:'Producto',store:'Tienda',owner:'Andrea',description:'Descripción de prueba',category:'Comida',price:10,image:'',available:true};
 expect(productValues(p).precio).toBe(10);expect(()=>productValues({...p,price:0})).toThrow('precio');
 expect(()=>productValues({...p,image:'data:image/png;base64,x'})).toThrow('imágenes');
 const b=cloudBusiness({id:'id',nombre:'Tienda',creador:'Andrea',descripcion:business.description,coordinacion:'Campus'});
 expect(cloudProduct({id:'p',nombre:'Producto',tipo:'Producto',precio:'18.50',disponible:true,categoria:'Comida',descripcion:'Detalle'},b).price).toBe(18.5);
});
test('el retorno tras verificar el correo solo admite el área privada prevista',()=>{
 expect(postAuthDestination(BUSINESS_WORKSPACE_PATH)).toBe(BUSINESS_WORKSPACE_PATH);
 for(const path of ['https://example.com','//example.com','/acceso?next=https://example.com',null])expect(postAuthDestination(path)).toBe('/');
});
