import { test, expect } from '@playwright/test';

test.skip(process.env.ESAN_AUTH_ENABLED !== 'true', 'Requiere acceso institucional activado.');

test('el acceso móvil conserva invitado y cambia entre crear y recuperar cuenta', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Superficie exclusiva de móvil.');
  await page.goto('/acceso?next=%2F%23%2Fmi-emprendimiento');
  await expect(page.getByRole('heading', { name: 'Bienvenido de nuevo.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Emprende Esanino, ir al inicio' })).toBeVisible();
  await page.getByRole('button', { name: 'Crear cuenta', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Aquí empieza tu idea.' })).toBeVisible();
  await expect(page.locator('.mobile-login-form input[name="intent"]')).toHaveValue('create');
  await page.getByRole('button', { name: 'Recuperar cuenta', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Vuelve a tu comunidad.' })).toBeVisible();
  await expect(page.locator('.mobile-login-form input[name="intent"]')).toHaveValue('recover');
  await expect(page.locator('.mobile-login-form input[name="next"]')).toHaveValue('/#/mi-emprendimiento');
  await page.getByRole('link', { name: 'Continuar como invitado' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('.product-card')).toHaveCount(12);
});

test('la imagen y el panel móvil no sustituyen el acceso de escritorio', async ({ page, isMobile }) => {
  await page.goto('/acceso');
  await expect(page.locator('.mobile-access'))[isMobile ? 'toBeVisible' : 'toBeHidden']();
  await expect(page.locator('.access-desktop'))[isMobile ? 'toBeHidden' : 'toBeVisible']();
  if (isMobile) {
    for (const [width, height] of [[320, 640], [390, 844], [430, 760], [760, 360], [390, 360]]) {
      await page.setViewportSize({ width, height });
      const bounds = await page.locator('.mobile-login-panel').boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(15.5);
      expect(bounds!.y).toBeGreaterThanOrEqual(15.5);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width - 15.5);
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(height - 15.5);
      expect(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight)).toBe(true);
      await page.locator('.mobile-login-content').evaluate(el => { el.scrollTop = el.scrollHeight; });
      await expect(page.locator('.mobile-login-note')).toBeInViewport();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await expect(page.getByRole('button', { name: 'Continuar con Google', exact: true })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Continuar como invitado' })).toBeVisible();
    }
  } else {
    await expect(page.getByRole('heading', { name: 'Publica lo que estás creando.' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continuar con Google', exact: true })).toBeHidden();
  }
});
