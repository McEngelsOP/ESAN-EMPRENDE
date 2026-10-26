import {test,expect} from '@playwright/test';
import {institutionalEmail,allowedUser} from '../src/lib/auth-policy';
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
 await page.getByRole('button',{name:'Publicar producto',exact:true}).click();
 await page.getByLabel('Nombre del producto').fill('Brownies de prueba');
 await page.getByLabel('Precio (S/)').fill('18');
 await page.getByLabel('Descripción').fill('Brownies artesanales para la demo de interfaz.');
 await page.getByRole('button',{name:'Publicar en la demo'}).click();
 await expect(page.locator('.seller-list')).toContainText('Brownies de prueba');
 await page.reload();await page.getByRole('button',{name:'Mi negocio'}).click();
 await expect(page.locator('.seller-list')).toContainText('Brownies de prueba');
});

test('categoría → perfil completo, sin filtros heredados ni tiendas duplicadas',async({page})=>{
 await page.goto('/');
 await page.locator('.category-directory').getByRole('button',{name:/Soluciones tech/}).click();
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
 await page.getByRole('button',{name:'Publicar producto',exact:true}).click();
 await page.getByLabel('Tipo de publicación').selectOption('Idea');
 await page.getByLabel('Nombre del producto').fill('Comunidad de prueba');
 await page.getByRole('combobox',{name:'Categoría',exact:true}).selectOption('Soluciones tech');
 await page.getByLabel('Descripción').fill('Busco estudiantes para validar esta idea de prueba.');
 await page.getByRole('button',{name:'Publicar en la demo'}).click();
 await expect(page.locator('.seller-list')).toContainText('Busco colaboradores');
 await page.reload();await page.getByRole('button',{name:'Mi negocio'}).click();
 await expect(page.locator('.seller-list')).toContainText('Comunidad de prueba');
});
