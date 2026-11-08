import { test, expect, type Page } from '@playwright/test';

import { loginAsAdmin } from './helpers/auth';

async function selectPrimeOption(page: Page, testId: string, option: string): Promise<void> {
  await page.getByTestId(testId).click();

  await page
    .getByRole('option', {
      name: option,
      exact: true,
    })
    .click();
}

test.describe('CRUD de usuarios E2E', () => {
  test('crear, editar y eliminar un usuario', async ({ page }) => {
    const uniqueId = Date.now();

    const originalName = `Usuario E2E ${uniqueId}`;
    const updatedName = `Usuario Editado ${uniqueId}`;
    const email = `e2e-${uniqueId}@example.com`;

    await loginAsAdmin(page);

    await page.goto('/users');

    await expect(page.getByTestId('users-table')).toBeVisible();

    // 1. CREAR USUARIO

    await page.getByTestId('new-user-button').click();

    await expect(page.getByTestId('user-form')).toBeVisible();

    await page.getByTestId('user-name').fill(originalName);

    await page.getByTestId('user-email').fill(email);

    await selectPrimeOption(page, 'user-role', 'Usuario');
    await selectPrimeOption(page, 'user-status', 'Activo');

    const [created] = await Promise.all([
      page.waitForResponse(
        (response) =>
          new URL(response.url()).pathname === '/api/users' &&
          response.request().method() === 'POST',
        { timeout: 10000 },
      ),
      page
        .getByRole('dialog', { name: 'Nuevo usuario' })
        .getByRole('button', { name: /guardar usuario/i })
        .click(),
    ]);

    expect(created.status()).toBe(201);

    const createdUser = await created.json();
    const userId = String(createdUser.id);

    const userRow = page.getByTestId('users-table').locator('tr').filter({ hasText: email });

    await expect(userRow).toContainText(originalName);

    // 2. EDITAR USUARIO

    await userRow.getByTestId('edit-user-button').click();

    await expect(page.getByTestId('user-form')).toBeVisible();

    await page.getByTestId('user-name').fill(updatedName);

    const [updated] = await Promise.all([
      page.waitForResponse(
        (response) =>
          new URL(response.url()).pathname === `/api/users/${userId}` &&
          response.request().method() === 'PUT',
        { timeout: 10000 },
      ),

      page.getByTestId('save-user-button').click(),
    ]);

    expect(updated.status()).toBe(200);

    await expect(userRow).toContainText(updatedName);

    // 3. ELIMINAR USUARIO
    // Abrir modal de confirmación desde la tabla
    await userRow.getByTestId('delete-user-button').click();

    // Identificar el modal correcto de PrimeNG
    const confirmDialog = page.getByRole('alertdialog', {
      name: 'Eliminar usuario',
      exact: true,
    });

    // Verificar que el modal esté visible
    await expect(confirmDialog).toBeVisible();

    // Verificar que estamos eliminando al usuario correcto
    await expect(confirmDialog).toContainText(updatedName);

    // Confirmar eliminación y esperar respuesta del backend
    const [deleted] = await Promise.all([
      page.waitForResponse(
        (response) =>
          response.request().method() === 'DELETE' &&
          new URL(response.url()).pathname === `/api/users/${userId}`,
        { timeout: 10000 },
      ),

      confirmDialog
        .getByRole('button', {
          name: 'Eliminar',
          exact: true,
        })
        .click(),
    ]);

    // Verificar respuesta del servidor
    expect([200, 204]).toContain(deleted.status());

    // Verificar que desapareció de la tabla
    await expect(userRow).toHaveCount(0);
  });
});

