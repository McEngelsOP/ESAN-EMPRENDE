import {test,expect, type Page} from '@playwright/test';
import {institutionalEmail,allowedUser} from '../src/lib/auth-policy';

async function createBusiness(page:Page){
 await page.getByLabel('Nombre del emprendimiento').fill('Taller de prueba');
 await page.getByLabel('Tu nombre',{exact:true}).fill('Andrea');
 await page.getByLabel('Descripción del emprendimiento').fill('Creamos propuestas de prueba para nuestra comunidad universitaria.');
 await page.getByLabel('Entrega o forma de coordinar').fill('Coordinamos la entrega en el campus.');
 await page.getByRole('button',{name:'Guardar perfil',exact:true}).click();
}
test('política: dominio exacto y correo confirmado',()=>{
 expect(institutionalEmail(' Estudiante@UE.EDU.PE ')).toBe('estudiante@ue.edu.pe');
 for(const email of ['a@gmail.com','a@esan.edu.pe','a@ue.edu.pe.evil.com','a@sub.ue.edu.pe','a@@ue.edu.pe','@ue.edu.pe','a b@ue.edu.pe'])expect(institutionalEmail(email)).toBeNull();
 expect(allowedUser({email:'a@ue.edu.pe',email_confirmed_at:'2026-10-26T00:00:00Z'})).toBe(true);
 expect(allowedUser({email:'a@ue.edu.pe'})).toBe(false);
 expect(allowedUser({email:'a@gmail.com',email_confirmed_at:'2026-10-26'})).toBe(false);
 expect(allowedUser(null)).toBe(false);
});
test('interfaz abierta sin login y rutas de acceso regresan al catálogo',async({page})=>{
 await page.goto('/');
 await expect(page.locator('.product-card')).toHaveCount(12);
 await expect(page.getByRole('button',{name:'Cerrar sesión'})).toHaveCount(0);
 await page.goto('/acceso');await expect(page).toHaveURL('/');
 await page.goto('/auth/callback?code=invalid');await expect(page).toHaveURL('/');
 await expect(page.locator('.product-card')).toHaveCount(12);
});
test('explorar y publicar en el panel sin cuenta',async({page})=>{
 await page.goto('/');
 await page.getByRole('textbox',{name:'Buscar en el catálogo'}).fill('Cookies');
 await expect(page.locator('.product-card')).toHaveCount(1);
 await page.getByRole('button',{name:'Mi negocio'}).click();
 await createBusiness(page);
 await page.getByRole('button',{name:'Nueva publicación',exact:true}).click();
 await page.getByLabel('Nombre del producto').fill('Brownies de prueba');
 await page.getByLabel('Precio (S/)').fill('18');
 await page.getByLabel('Descripción').fill('Brownies artesanales para la demo de interfaz.');
 await page.getByRole('button',{name:'Revisar publicación'}).click();
 await expect(page.locator('.seller-list')).toHaveCount(0);
 await page.getByRole('button',{name:'Publicar en la demo'}).click();
 await expect(page.locator('.seller-list')).toContainText('Brownies de prueba');
 await page.reload();await page.getByRole('button',{name:'Mi negocio'}).click();
 await expect(page.locator('.seller-list')).toContainText('Brownies de prueba');
});

test('categoría → perfil completo, sin filtros heredados ni tiendas duplicadas',async({page})=>{
 await page.goto('/');
 if((page.viewportSize()?.width||1440)<=760)await page.locator('.categories').getByRole('button',{name:'Soluciones tech',exact:true}).click();
 else await page.locator('.category-directory').getByRole('button',{name:/Soluciones tech/}).click();
 await expect(page.locator('.product-card')).toHaveCount(3);
 await expect(page.locator('.featured')).toHaveCount(0);
 await page.locator('.product-card').filter({hasText:'Tu primera página web'}).getByRole('button',{name:'Nodo Studio'}).click();
 await expect(page.locator('.store-profile h1')).toHaveText('Nodo Studio');
 await expect(page.locator('.product-card')).toHaveCount(2);
 await page.getByRole('button',{name:'Todos los emprendimientos',exact:true}).click();
 await expect(page.locator('.store-card')).toHaveCount(8);
 await page.locator('.store-card').filter({hasText:'Miga & Mood'}).click();
 await expect(page.locator('.product-card')).toHaveCount(2);
});
test('carrusel automático, pausa y selección manual',async({page})=>{
 await page.clock.install();
 await page.goto('/');
 await expect(page.locator('.feature-copy')).toContainText('Una pausa con mucho chocolate.');
 await expect(page.getByRole('button',{name:'Pausar destacados',exact:true})).toBeVisible();
 await page.clock.runFor(100);
 await page.clock.fastForward(6500);
 await expect(page.locator('.feature-copy')).toContainText('Lleva tu estilo');
 await page.getByRole('button',{name:'Pausar destacados',exact:true}).click();
 const paused=await page.locator('.feature-copy h2').textContent();
 await page.clock.fastForward(13000);
 await expect(page.locator('.feature-copy h2')).toHaveText(paused!);
 await page.getByRole('button',{name:'Siguiente destacado',exact:true}).click();
 await expect(page.locator('.feature-copy')).toContainText('Tu idea merece estar en línea.');
 await page.getByRole('button',{name:'Conocer emprendimiento',exact:true}).click();
 await expect(page.locator('.store-profile h1')).toHaveText('Nodo Studio');
});
test('movimiento reducido conserva selección manual sin rotación',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.clock.install(); await page.goto('/');
 await page.clock.fastForward(13000);
 await expect(page.locator('.feature-copy')).toContainText('Una pausa con mucho chocolate.');
 await page.getByRole('button',{name:'Siguiente destacado',exact:true}).click();
 await expect(page.locator('.feature-copy')).toContainText('Lleva tu estilo');
});
test('publicar idea sin precio y conservarla al recargar',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Mi negocio'}).click();
 await createBusiness(page);
 await page.getByRole('button',{name:'Nueva publicación',exact:true}).click();
 await page.getByLabel('Tipo de publicación').selectOption('Idea');
 await page.getByLabel('Nombre de la idea').fill('Comunidad de prueba');
 await page.getByLabel('Qué colaboradores buscas').fill('Estudiantes de diseño para probar una idea.');
 await page.getByRole('combobox',{name:'Categoría',exact:true}).selectOption('Soluciones tech');
 await page.getByLabel('Descripción').fill('Busco estudiantes para validar esta idea de prueba.');
 await page.getByRole('button',{name:'Revisar publicación'}).click();
 await expect(page.locator('.seller-list')).toHaveCount(0);
 await page.getByRole('button',{name:'Publicar en la demo'}).click();
 await expect(page.locator('.seller-list')).toContainText('Busco colaboradores');
 await page.reload();await page.getByRole('button',{name:'Mi negocio'}).click();
 await expect(page.locator('.seller-list')).toContainText('Comunidad de prueba');
});

test('editar perfil y publicación conserva identidad, confirmar eliminación',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Mi negocio'}).click();await createBusiness(page);
 await page.getByRole('button',{name:'Ver mi perfil'}).click();
 await expect(page.locator('.store-profile h1')).toHaveText('Taller de prueba');
 await page.getByRole('button',{name:'Mi negocio'}).click();
 await page.getByRole('button',{name:'Nueva publicación'}).click();
 await page.getByLabel('Nombre del producto').fill('Oferta original');
 await page.getByLabel('Precio (S/)',{exact:true}).fill('18');
 await page.getByLabel('Descripción',{exact:true}).fill('Descripción de prueba suficientemente extensa.');
 await page.getByRole('button',{name:'Revisar publicación'}).click();
 await page.getByRole('button',{name:'Seguir editando'}).click();
 await expect(page.getByLabel('Nombre del producto')).toHaveValue('Oferta original');
 await page.getByRole('button',{name:'Revisar publicación'}).click();
 await page.getByRole('button',{name:'Publicar en la demo'}).click();
 await page.locator('.seller-row-actions').getByRole('button',{name:'Editar',exact:true}).click();
 await page.getByLabel('Nombre del producto').fill('Oferta corregida');
 await page.getByRole('button',{name:'Revisar publicación'}).click();
 await page.getByRole('button',{name:'Guardar cambios'}).click();
 await expect(page.locator('.seller-row')).toHaveCount(1);
 await page.getByRole('button',{name:'Editar perfil'}).click();
 await page.getByLabel('Nombre del emprendimiento').fill('Taller actualizado');
 await page.getByRole('button',{name:'Guardar perfil'}).click();
 await page.reload();await page.getByRole('button',{name:'Mi negocio'}).click();
 await expect(page.locator('.seller-title h1')).toHaveText('Taller actualizado');
 await expect(page.locator('.seller-list')).toContainText('Oferta corregida');
 await page.getByRole('button',{name:'Eliminar Oferta corregida'}).click();
 await page.getByRole('button',{name:'Conservar publicación'}).click();
 await expect(page.locator('.seller-row')).toHaveCount(1);
 await page.getByRole('button',{name:'Eliminar Oferta corregida'}).click();
 await page.getByRole('button',{name:'Confirmar eliminación'}).click();
 await expect(page.locator('.seller-row')).toHaveCount(0);
});
test('servicio a cotizar, borrador descartable y vista adaptable',async({page},info)=>{
 await page.goto('/');await page.getByRole('button',{name:'Mi negocio'}).click();await createBusiness(page);
 await page.screenshot({path:`/tmp/esan-seller-${info.project.name}.png`,fullPage:true});
 await page.getByRole('button',{name:'Nueva publicación'}).click();
 await expect(page.locator('.toast')).toHaveCount(0);
 await page.getByLabel('Tipo de publicación').selectOption('Servicio');
 await page.getByLabel('Nombre del servicio').fill('Servicio de prueba');
 await page.getByLabel('Descripción',{exact:true}).fill('Un servicio de prueba para la comunidad universitaria.');
 await page.getByLabel('Qué incluye el servicio').fill('Un prototipo y dos revisiones.');
 await page.getByLabel('Plazo estimado').fill('Una semana');
 await page.getByRole('button',{name:'Revisar publicación'}).click();
 await expect(page.locator('.offer-preview')).toContainText('A cotizar');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`/tmp/esan-offer-${info.project.name}.png`,fullPage:true});
 await page.getByRole('button',{name:'Seguir editando'}).click();
 await page.getByRole('button',{name:'Cancelar',exact:true}).click();
 await page.getByRole('button',{name:'Seguir editando'}).click();
 await expect(page.getByLabel('Nombre del servicio')).toHaveValue('Servicio de prueba');
 await page.getByRole('button',{name:'Cancelar',exact:true}).click();
 await page.getByRole('button',{name:'Descartar cambios'}).click();
 await expect(page.locator('.seller-row')).toHaveCount(0);
});

test('imágenes adaptables y controles móviles accesibles',async({page},info)=>{
 const requested:string[]=[];page.on('request',r=>requested.push(r.url()));
 await page.goto('/');
 const hero=page.locator('.feature-visual img');
 await expect(hero).toBeVisible();
 await expect.poll(()=>hero.evaluate(img=>(img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
 await expect(hero).toHaveAttribute('srcset',/w=/);
 await expect(page.locator('.product-card img').first()).toHaveAttribute('loading','lazy');
 expect(requested.some(u=>u.includes('products-sheet.png'))).toBe(false);
 const pause=page.getByRole('button',{name:'Pausar destacados',exact:true});
 if(await pause.count())await pause.click();
 const photo=page.locator('.product-card img').first();await photo.scrollIntoViewIfNeeded();
 await expect.poll(()=>photo.evaluate(img=>(img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
 expect(await photo.evaluate(img=>getComputedStyle(img).objectFit)).toBe('cover');
 const favorite=await page.locator('.favorite').first().boundingBox();
 expect(favorite!.width).toBeGreaterThanOrEqual(44);expect(favorite!.height).toBeGreaterThanOrEqual(44);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.evaluate(()=>window.scrollTo(0,0));
 await page.evaluate(()=>document.fonts.ready);
 if(info.project.name==='mobile'){const choices=await page.locator('.feature-choices').boundingBox();expect(choices!.height).toBeLessThanOrEqual(80);}
 await page.screenshot({path:`/tmp/esan-optimized-${info.project.name}.png`,fullPage:true});
 if(info.project.name==='mobile'){await page.setViewportSize({width:320,height:700});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:'/tmp/esan-optimized-narrow.png',fullPage:true});}
});
