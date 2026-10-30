import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const demoKey='esan-emprende-demo-v1:demo-aea-v1';

async function settings(page:import('@playwright/test').Page){await page.goto('/demo/#/ajustes');await expect(page.locator('main')).toHaveAttribute('data-view','settings');await expect(page.getByRole('heading',{name:'Tus datos de demostración'})).toBeVisible()}

test('demo completa tiene datos ficticios y no escribe al API privado',async({page})=>{
 const privateRequests:string[]=[];page.on('request',r=>{if(r.url().includes('/api/mi-negocio'))privateRequests.push(r.url())});
 await page.goto('/demo');await expect(page.locator('.demo-workbench')).toBeVisible();await expect(page.locator('.product-card')).toHaveCount(23);
 await page.goto('/demo/#/mi-emprendimiento');await expect(page.locator('.seller-business-name')).toHaveText('Taller Entre Apuntes');await expect(page.getByText('Actividad de ejemplo · datos ficticios',{exact:true})).toBeVisible();await expect(page.locator('.seller-row')).toHaveCount(5);
 await page.getByRole('button',{name:'Productos',exact:false}).first().click();await page.getByLabel('Buscar mis publicaciones').fill('libreta');await expect(page.locator('.seller-row')).toHaveCount(1);expect(privateRequests).toEqual([]);
});

test('quitar ejemplos persiste y restaurar no duplica',async({page})=>{
 await settings(page);await page.getByRole('button',{name:'Quitar datos ficticios',exact:true}).click();await page.getByRole('button',{name:'Confirmar quitar ejemplos',exact:true}).click();
 await expect(page.getByRole('status')).toContainText('Datos ficticios retirados');await page.goto('/demo/#/inicio');await expect(page.locator('.product-card')).toHaveCount(0);await expect(page.locator('.hv-card')).toHaveCount(0);await page.reload();await expect(page.locator('.product-card')).toHaveCount(0);
 await settings(page);await page.getByRole('button',{name:'Restaurar ejemplos',exact:true}).click();await page.getByRole('button',{name:'Cargar ejemplos',exact:true}).click();await page.goto('/demo/#/inicio');await expect(page.locator('.product-card')).toHaveCount(23);
});

test('quitar ficticios conserva una publicación propia vinculada al negocio demo',async({page})=>{
 await page.goto('/demo');await expect(page.locator('.product-card')).toHaveCount(23);await page.evaluate(key=>{const w=JSON.parse(localStorage.getItem(key)!);w.products.push({id:'user-product',brandId:w.business.id,store:w.business.name,owner:w.business.owner,name:'Propuesta propia conservada',description:'Contenido creado para verificar la conservación.',category:'Arte y papelería',price:19,image:'/images/notebook.jpg',kind:'Producto',available:true});localStorage.setItem(key,JSON.stringify(w))},demoKey);
 await settings(page);await page.getByRole('button',{name:'Quitar datos ficticios',exact:true}).click();await page.getByRole('button',{name:'Confirmar quitar ejemplos',exact:true}).click();await page.goto('/demo/#/mi-emprendimiento');await expect(page.locator('.seller-row')).toHaveCount(1);await expect(page.locator('.seller-row')).toContainText('Propuesta propia conservada');await expect(page.getByText('Actividad de ejemplo · datos ficticios',{exact:true})).toHaveCount(0);
});

test('persistencia fallida no anuncia favoritos ni reseñas guardadas',async({page})=>{
 await page.goto('/demo');await expect(page.locator('.product-card')).toHaveCount(23);const first=page.locator('.favorite').first();const wasSaved=await first.getAttribute('aria-pressed');
 await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw new DOMException('Sin espacio','QuotaExceededError')}});await first.click();await expect(first).toHaveAttribute('aria-pressed',wasSaved!);await expect(page.locator('.seller-alert[role=alert]')).toContainText('No se pudieron guardar');
 await page.locator('.product-name').first().click();await page.getByLabel('5 estrellas',{exact:true}).check();await page.getByLabel('Tu reseña',{exact:true}).fill('Comentario propio que no puede guardarse.');await page.getByRole('button',{name:'Guardar reseña',exact:true}).click();await expect(page.locator('.reviews [role=status]')).toContainText('No se pudo guardar');await expect(page.getByLabel('Tu reseña',{exact:true})).toHaveValue('Comentario propio que no puede guardarse.');
});

test('Ajustes recupera el contenido dañado sin sobrescribirlo',async({page})=>{
 const corrupt='{contenido no válido';await page.addInitScript(({key,value})=>localStorage.setItem(key,value),{key:demoKey,value:corrupt});await settings(page);await expect(page.getByRole('button',{name:'Importar datos',exact:true})).toBeDisabled();const download=page.waitForEvent('download');await page.getByRole('button',{name:'Descargar datos originales',exact:true}).click();const file=await download;expect(await readFile((await file.path())!,'utf8')).toBe(corrupt);expect(await page.evaluate(key=>localStorage.getItem(key),demoKey)).toBe(corrupt);
});

test('filtros activos y búsqueda de favoritos mantienen las vistas',async({page})=>{
 await page.goto('/demo');await page.locator('#catalog').scrollIntoViewIfNeeded();await page.getByRole('button',{name:'Filtros',exact:true}).click();const before=await page.evaluate(()=>scrollY);await page.getByLabel('Filtrar por tipo',{exact:true}).selectOption('Servicio');await expect(page.locator('main')).toHaveAttribute('data-view','catalog');await expect(page.locator('.active-filters')).toContainText('Servicio');expect(Math.abs(await page.evaluate(()=>scrollY)-before)).toBeLessThan(10);
 await page.goto('/demo/#/favoritos');await page.getByLabel('Buscar en mis favoritos').fill('cookies');await expect(page.locator('.fav-card')).toHaveCount(1);await expect(page.locator('main')).toHaveAttribute('data-view','saved');
 await settings(page);await expect(page.locator('.header-bottom')).toHaveCount(0);expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
});

test('directorio móvil conserva el ancho y permite abrir la marca',async({page,isMobile})=>{
 await page.goto('/demo/#/emprendimientos');await expect(page.locator('.emp-open').first()).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
 if(isMobile){await page.setViewportSize({width:320,height:700});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true)}
 await page.locator('.emp-open').first().click();await expect(page.locator('.store-profile h1')).toHaveText('Miga & Mood');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);await page.locator('.product-name').first().click();await expect(page.locator('dialog[open]')).toBeVisible();const box=await page.locator('dialog[open] .close-dialog').boundingBox();expect(box!.x+box!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
});
