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
test('catálogo privado sin sesión, incluso con cookie inventada',async({page,context})=>{
 await context.addCookies([{name:'esan-session',value:'true',domain:'127.0.0.1',path:'/'}]);
 await page.goto('/');await expect(page).toHaveURL(/\/acceso$/);
 await expect(page.getByRole('heading',{name:'Tu comunidad. Tu próximo descubrimiento.'})).toBeVisible();
 await expect(page.locator('.product-card')).toHaveCount(0);
});
test('correo externo rechazado en servidor sin enviar email',async({page})=>{
 await page.goto('/acceso');await page.getByLabel('Correo institucional').fill('alguien@gmail.com');
 await page.getByRole('button',{name:'Recibir enlace de acceso'}).click();
 await expect(page.locator('.access-error')).toContainText('terminado en @ue.edu.pe');
 await expect(page.getByRole('button',{name:'Recibir enlace de acceso'})).toBeEnabled();
});
test('callback inválido y redirección externa rechazados',async({page})=>{
 await page.goto('/auth/callback?next=https://example.com');
 await expect(page).toHaveURL(/\/acceso\?error=expired$/);
 await expect(page.locator('.access-error')).toContainText('El enlace venció');
});
test('cierre de sesión requiere POST del mismo origen',async({request})=>{
 expect((await request.get('/auth/salir')).status()).toBe(405);
 expect((await request.post('/auth/salir',{headers:{origin:'https://example.com'}})).status()).toBe(403);
 const response=await request.post('/auth/salir',{headers:{origin:'http://127.0.0.1:3000'},maxRedirects:0});
 expect(response.status()).toBe(303);expect(response.headers().location).toContain('/acceso');
});
test('acceso adaptable y sin errores de cliente',async({page},info)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/acceso');await page.evaluate(()=>document.fonts.ready);
 await expect(page.getByLabel('Correo institucional')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect(errors).toEqual([]);await page.screenshot({path:`/tmp/esan-access-${info.project.name}.png`,fullPage:true});
});
