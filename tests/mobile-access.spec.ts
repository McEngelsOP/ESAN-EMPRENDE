import { test, expect } from '@playwright/test';

test.skip(process.env.ESAN_AUTH_ENABLED !== 'true', 'Requiere acceso institucional activado.');

test('el acceso conserva invitado y cambia entre crear y recuperar cuenta', async ({ page, isMobile }) => {

  await page.goto('/acceso?next=%2F%23%2Fmi-emprendimiento');
  await expect(page.getByRole('heading', { name: isMobile ? 'Bienvenido de nuevo.' : 'Tu próxima idea empieza aquí.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Emprende Esanino, ir al inicio' })).toBeVisible();
  await page.getByRole('button', { name: 'Crear cuenta', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Aquí empieza tu idea.' })).toBeVisible();
  await expect(page.locator(isMobile ? '.mobile-login-form input[name="intent"]' : '.ea-form input[name="intent"]')).toHaveValue('create');
  await page.getByRole('button', { name: 'Recuperar cuenta', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Vuelve a tu comunidad.' })).toBeVisible();
  await expect(page.locator(isMobile ? '.mobile-login-form input[name="intent"]' : '.ea-form input[name="intent"]')).toHaveValue('recover');
  await expect(page.locator(isMobile ? '.mobile-login-form input[name="next"]' : '.ea-form input[name="next"]')).toHaveValue('/#/mi-emprendimiento');
  await page.getByRole('link', { name: 'Continuar como invitado' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('.product-card')).toHaveCount(12);
});

test('cada versión conserva su fondo y el panel estático completo', async ({ page, isMobile }) => {
  await page.goto('/acceso');
  if (isMobile) {
    await expect(page.locator('.mobile-access')).toBeVisible();
    expect(await page.locator('.mobile-access').evaluate(el => getComputedStyle(el, '::before').backgroundImage)).toContain('login-tree.jpg');
  } else {
    await expect(page.locator('.editorial-access')).toBeVisible();
    await expect(page.locator('.ea-art img')).toHaveAttribute('src', '/images/login-mountains.png');
  }
  if (isMobile) {
    for (const [width, height] of [[320, 568], [320, 640], [390, 640], [390, 740], [390, 844], [430, 760], [760, 360], [390, 360]]) {
      await page.setViewportSize({ width, height });
      const bounds = await page.locator('.mobile-login-panel').boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(15.5);
      expect(bounds!.y).toBeGreaterThanOrEqual(15.5);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width - 15.5);
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(height - 15.5);
      expect(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight)).toBe(true);
      expect(await page.locator('.mobile-login-content').evaluate(el => el.scrollHeight <= el.clientHeight + 1)).toBe(true);
      for (const name of ['Iniciar sesión', 'Continuar con Google', 'Crear cuenta', 'Recuperar cuenta']) {
        await expect(page.getByRole('button', { name, exact: true })).toBeInViewport({ ratio: 1 });
      }
      await expect(page.getByRole('link', { name: 'Continuar como invitado' })).toBeInViewport({ ratio: 1 });
      if(height > 520) await expect(page.locator('.mobile-login-note')).toBeInViewport({ ratio: 1 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await expect(page.getByRole('button', { name: 'Continuar con Google', exact: true })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Continuar como invitado' })).toBeVisible();
    }
  } else {
    for (const [width, height] of [[1024, 600], [1366, 768], [1440, 900], [1920, 1080]]) {
      await page.setViewportSize({width,height});
      await expect(page.locator('.ea-art img')).toBeVisible();
      await expect(page.getByRole('button', {name:'Continuar con Google'})).toBeVisible();
      await expect(page.getByRole('link', {name:'Continuar como invitado'})).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
});
