import { test, expect } from '@playwright/test';

import { loginAsAdmin } from './helpers/auth';
import { checkAccessibility } from './helpers/accessibility';

test.describe('Accesibilidad WCAG 2.2', () => {
  test('Login sin errores automáticos de accesibilidad', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('input[type="email"]')).toBeVisible();

    await checkAccessibility(page);
  });

  test('Dashboard sin errores automáticos de accesibilidad', async ({ page }) => {
    await loginAsAdmin(page);

    await expect(page).toHaveURL(/\/dashboard/);

    await checkAccessibility(page);
  });

  test('Tabla de usuarios accesible', async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto('/users');

    await expect(page.getByTestId('users-table')).toBeVisible();

    await checkAccessibility(page);
  });

  test('Modal de usuario accesible', async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto('/users');

    await page.getByTestId('new-user-button').click();

    const saveButton = page
      .getByRole('dialog', { name: 'Nuevo usuario' })
      .getByRole('button', { name: 'Guardar usuario' });

    await expect(saveButton).toBeVisible();

    const styles = await saveButton.evaluate((button) => {
      const label = button.querySelector('.p-button-label');
      const buttonStyle = getComputedStyle(button);
      const labelStyle = label ? getComputedStyle(label) : null;

      return {
        background: buttonStyle.backgroundColor,
        color: labelStyle?.color,
        opacity: buttonStyle.opacity,
        transition: buttonStyle.transition,
        animation: buttonStyle.animation,
      };
    });

    //console.log('ESTILOS BOTÓN GUARDAR:', styles);

    await checkAccessibility(page);

    await expect(page.getByTestId('user-name')).toBeVisible();
  });

  test('Login permite navegación por teclado', async ({ page }) => {
    await page.goto('/login');

    const email = page.locator('input[type="email"]');
    const password = page.locator('input[type="password"]');

    await email.focus();

    await expect(email).toBeFocused();

    await page.keyboard.press('Tab');

    await expect(password).toBeFocused();
  });
});
