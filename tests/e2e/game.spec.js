const { test, expect } = require('@playwright/test');

test('carrega a página, canvas e interface inicial sem erros JavaScript', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle(/THE BIBLE: LOST SECRETS/i);
  await expect(page.locator('#game')).toBeVisible();
  await expect(page.locator('#overlay')).toBeVisible();
  await expect(page.locator('#start')).toBeVisible();
  const canvas = await page.locator('#game').evaluate(el => ({
    width: el.width, height: el.height,
    cssWidth: el.getBoundingClientRect().width,
    cssHeight: el.getBoundingClientRect().height
  }));
  expect(canvas.width).toBe(256);
  expect(canvas.height).toBe(144);
  expect(canvas.cssWidth).toBeGreaterThan(200);
  expect(canvas.cssHeight).toBeGreaterThan(100);
  expect(errors).toEqual([]);
});

test('inicia a jornada e aceita comandos básicos de movimento', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('button', { name: 'INICIAR JORNADA' }).click();
  await expect(page.locator('#overlay')).toHaveClass(/hidden/);
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(350);
  await page.keyboard.up('ArrowRight');
  await page.keyboard.press('e');
  await expect(page.locator('#overlay')).toBeVisible();
  await page.screenshot({ path: 'test-results/eden-interaction.png', fullPage: true });
  expect(errors).toEqual([]);
});

test('pausa e retoma sem erro', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('button', { name: 'INICIAR JORNADA' }).click();
  await page.keyboard.press('Escape');
  await expect(page.locator('#overlay')).toBeVisible();
  await page.getByRole('button', { name: 'VOLTAR AO JOGO' }).click();
  await expect(page.locator('#overlay')).toHaveClass(/hidden/);
  expect(errors).toEqual([]);
});
