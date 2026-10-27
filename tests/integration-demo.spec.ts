import {test,expect} from '@playwright/test';
import {contactLinks,mergeWorkspace,parseWorkspace} from '../src/lib/workspace';

test('compatibilidad: alias, estado, campos adicionales y seguridad de contacto',()=>{
 const legacy=parseWorkspace(JSON.stringify({products:[{id:'local-old',name:'Proyecto anterior',store:'Taller',owner:'Ana',description:'Descripción guardada',category:'Servicios',price:0,image:'./assets/notebook.webp',status:'paused',delivery:'Entrega anterior',includes:'Alcance anterior',customField:'conservar'}],business:{name:'Taller',owner:'Ana',description:'Una marca anterior',delivery:'A coordinar',contact:'',whatsapp:'900000000',email:'demo@example.com',social:'javascript:alert(1)'},saved:['local-old'],reviews:[{id:'review-old',productId:'local-old',rating:5,comment:'Una reseña anterior'}],legacyExtra:{important:true}}));
 expect(legacy.products[0]).toMatchObject({fulfillment:'Entrega anterior',scope:'Alcance anterior',image:'/images/notebook.jpg',available:false,customField:'conservar'});
 expect(legacy.reviews[0].author).toBe('Anónimo');
 expect(legacy.legacyExtra).toEqual({important:true});
 const own=parseWorkspace(JSON.stringify({products:[{...legacy.products[0],name:'Versión actual'}],saved:['cookies'],business:legacy.business}));
 const merged=mergeWorkspace(own,legacy);expect(merged.products).toHaveLength(1);expect(merged.products[0].name).toBe('Versión actual');expect(merged.saved).toEqual(['cookies','local-old']);
 const links=contactLinks(legacy.business!);expect(links).toHaveLength(2);expect(links.every(l=>!l.href.startsWith('javascript:'))).toBe(true);
 expect(contactLinks(legacy.business!,legacy.products[0])).toEqual([]);
 expect(()=>parseWorkspace('{invalid')).toThrow();
});

test('migra la demo anterior sin borrar favoritos ni reseñas y no los resucita',async({page})=>{
 await page.addInitScript(()=>{if(localStorage.getItem('migration-test'))return;localStorage.setItem('migration-test','true');localStorage.setItem('esan-emprende-demo-v1:standalone-preview',JSON.stringify({products:[{id:'local-legacy',name:'Publicación anterior',store:'Mi taller anterior',owner:'Ana',category:'Servicios',price:0,image:'tech',kind:'Servicio',description:'Guardado en la versión anterior',delivery:'Entrega anterior',includes:'Alcance anterior',available:true}],saved:['cookies'],business:{id:'old-business',name:'Mi taller anterior',owner:'Ana',description:'Una descripción de la versión anterior.',delivery:'En el campus',contact:'',email:'demo@example.com'},reviews:[{id:'old-review',productId:'cookies',rating:4,author:'Ana',comment:'Una reseña guardada',createdAt:'2026-10-26'}],unknownEnvelope:'conservar'}))});
 await page.goto('/');await expect(page.locator('.product-card')).toHaveCount(13);
 await page.getByRole('button',{name:'Quitar de favoritos: Cookies de chocolate',exact:true}).click();
 await page.reload();await expect(page.getByRole('button',{name:'Añadir a favoritos: Cookies de chocolate',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Mi negocio',exact:true}).click();await expect(page.locator('.seller-title h1')).toHaveText('Mi taller anterior');await expect(page.locator('.seller-list')).toContainText('Publicación anterior');
 const raw=await page.evaluate(()=>JSON.parse(localStorage.getItem('esan-emprende-demo-v1:interface-preview')||'{}'));
 expect(raw.unknownEnvelope).toBe('conservar');expect(raw.reviews).toHaveLength(1);expect(raw.products[0].scope).toBe('Alcance anterior');
 expect(await page.evaluate(()=>!!localStorage.getItem('esan-emprende-demo-v1:standalone-preview'))).toBe(true);
});

test('reseña local y tema persisten al recargar',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Cookies de chocolate',exact:true}).click();
 await page.getByRole('radio',{name:'4 estrellas',exact:true}).check();await page.getByLabel('Tu reseña',{exact:true}).fill('Me interesa esta propuesta de prueba.');
 await page.getByRole('button',{name:'Guardar reseña',exact:true}).click();await expect(page.locator('.review-list')).toContainText('Me interesa esta propuesta');
 await page.keyboard.press('Escape');await page.getByRole('button',{name:'Usar tema oscuro',exact:true}).click();
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');await page.reload();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await page.getByRole('button',{name:'Cookies de chocolate',exact:true}).click();await expect(page.locator('.review-list')).toContainText('Me interesa esta propuesta');
});

test('URL compartida conserva búsqueda, tipo y categoría',async({page})=>{
 await page.goto('/#/explorar?tipo=Servicio&categoria=Soluciones+tech&q=automatiza');
 await expect(page.locator('.product-card')).toHaveCount(1);await expect(page.locator('.product-card')).toContainText('Automatiza esas tareas');
 await page.reload();await expect(page.locator('.product-card')).toHaveCount(1);await expect(page.getByRole('textbox',{name:'Buscar en el catálogo'})).toHaveValue('automatiza');
});

test('datos actuales dañados no se sobrescriben',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('esan-emprende-demo-v1:interface-preview','{broken'));
 await page.goto('/');await expect(page.locator('.seller-alert')).toContainText('Se conservaron sin sobrescribirlos');
 await page.getByRole('button',{name:'Añadir a favoritos: Cookies de chocolate',exact:true}).click();
 expect(await page.evaluate(()=>localStorage.getItem('esan-emprende-demo-v1:interface-preview'))).toBe('{broken');
});
