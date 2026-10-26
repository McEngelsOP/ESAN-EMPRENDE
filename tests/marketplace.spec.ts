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
 await expect(page.locator('.product-card')).toHaveCount(6);
 await expect(page.getByRole('button',{name:'Cerrar sesión'})).toHaveCount(0);
 await page.goto('/acceso');await expect(page).toHaveURL('/');
 await page.goto('/auth/callback?code=invalid');await expect(page).toHaveURL('/');
 await expect(page.locator('.product-card')).toHaveCount(6);
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
