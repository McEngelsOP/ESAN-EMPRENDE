import { test, expect } from '@playwright/test';

const authEnabled=process.env.ESAN_AUTH_ENABLED==='true';

test.skip(!authEnabled,'Solo aplica con la autenticación institucional activada.');

test('el catálogo es público y Mi negocio solicita verificación institucional',async({page})=>{
 await page.goto('/');
 await expect(page).toHaveURL(/\/$/);
 await expect(page.locator('.product-card')).toHaveCount(12);
 await expect(page.locator('.demo-strip')).toContainText('Vista de visitante');
 await expect(page.getByRole('button',{name:'Cerrar sesión'})).toHaveCount(0);

 await page.getByRole('button',{name:'Mi negocio',exact:true}).click();
 await expect(page).toHaveURL(/\/acceso\?next=/);
 await expect(page.getByRole('heading',{name:'Publica lo que estás creando.'})).toBeVisible();
 await expect(page.getByText('El catálogo se puede explorar sin cuenta.')).toBeVisible();
 await expect(page.locator('input[name="next"]')).toHaveValue('/#/mi-emprendimiento');
 await expect(page.getByRole('button',{name:'Recibir enlace para crear o ingresar'})).toBeDisabled();
});

test('un enlace directo a Mi negocio también pide iniciar sesión',async({page})=>{
 await page.goto('/#/mi-emprendimiento');
 await expect(page).toHaveURL(/\/acceso\?next=/);
 await expect(page.getByRole('heading',{name:'Publica lo que estás creando.'})).toBeVisible();
});
