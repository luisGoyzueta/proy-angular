import { test, expect } from '@playwright/test';

test.describe('Autenticación E2E', () => {
  test('muestra el formulario de Login', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('input[type="email"]')).toBeVisible();

    await expect(page.locator('input[type="password"]')).toBeVisible();

    await expect(
      page.getByRole('button', {
        name: /ingresar|iniciar sesión|acceder/i,
      }),
    ).toBeVisible();
  });

  test('redirige al Login cuando no hay sesión', async ({ page }) => {
    await page.goto('/users');

    await expect(page).toHaveURL(/\/login/);
  });
});
