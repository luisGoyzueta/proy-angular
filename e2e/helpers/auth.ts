// import { expect, type Page } from '@playwright/test';

// export async function loginAsAdmin(page: Page): Promise<void> {
//   const email = process.env.E2E_EMAIL;
//   const password = process.env.E2E_PASSWORD;

//   if (!email || !password) {
//     throw new Error('Configura E2E_EMAIL y E2E_PASSWORD');
//   }

//   await page.goto('/login');
//   await page.locator('input[type="email"]').fill(email);
//   await page.locator('input[type="password"]').fill(password);
//   await page
//     .getByRole('button', {
//       name: /ingresar|iniciar sesión|acceder/i,
//     })
//     .click();

//   await expect(page).toHaveURL(/\/dashboard/);
// }


import { expect, type Page } from '@playwright/test';

export async function loginAsAdmin(page: Page): Promise<void> {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;

  if (!email || !password) {
    throw new Error('Faltan E2E_EMAIL o E2E_PASSWORD');
  }

  await page.goto('/login');

  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);

  // Esperar la respuesta del backend
  const loginResponsePromise = page.waitForResponse(
    (response) =>
      response.url().includes('/api/auth/login') && response.request().method() === 'POST',
  );

  await page
    .getByRole('button', {
      name: /ingresar|iniciar sesión|acceder/i,
    })
    .click();

  const response = await loginResponsePromise;

  // Mostrar un error claro si Express rechaza el login
  if (response.status() !== 200) {
    const body = await response.text();

    throw new Error(`Error de autenticación E2E: HTTP ${response.status()}. ${body}`);
  }

  // Verificar navegación después del login
  await expect(page).toHaveURL(/\/dashboard(?:[/?#]|$)/, { timeout: 10000 });
}
