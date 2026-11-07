import { test, expect } from '@playwright/test';

const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;

test.describe('Navegación autenticada E2E', () => {
  test('Administrador inicia sesión y accede al Dashboard', async ({ page }) => {
    test.skip(!email || !password, 'Configura E2E_EMAIL y E2E_PASSWORD');

    await page.goto('/login');

    await page.locator('input[type="email"]').fill(email!);

    await page.locator('input[type="password"]').fill(password!);

    await page
      .getByRole('button', {
        name: /ingresar|iniciar sesión|acceder/i,
      })
      .click();

    await expect(page).toHaveURL(/\/dashboard/);

    await expect(
      page.getByRole('heading', {
        name: /dashboard/i,
      }),
    ).toBeVisible();
  });

  test('Administrador puede navegar al módulo Usuarios', async ({ page }) => {
    test.skip(!email || !password, 'Configura E2E_EMAIL y E2E_PASSWORD');

    await page.goto('/login');

    await page.locator('input[type="email"]').fill(email!);
    await page.locator('input[type="password"]').fill(password!);

    await page
      .getByRole('button', {
        name: /ingresar|iniciar sesión|acceder/i,
      })
      .click();

    await expect(page).toHaveURL(/\/dashboard/);

    await page.goto('/users');

    await expect(page).toHaveURL(/\/users/);

    await expect(page.locator('p-table')).toBeVisible();
  });
});
