const { test, expect } = require('@playwright/test');

test('carrega a página, canvas e interface inicial sem erros JavaScript', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle(/THE BIBLE: LOST SECRETS/i);
  await expect(page.locator('#game')).toBeVisible();
  await expect(page.locator('#overlay')).toBeVisible();
  await expect(page.locator('#start')).toBeVisible();
  await expect(page.locator('script[src="game.js"]')).toHaveCount(1);
  const canvas = await page.locator('#game').evaluate(el => ({
    width: el.width, height: el.height,
    cssWidth: el.getBoundingClientRect().width,
    cssHeight: el.getBoundingClientRect().height
  }));
  expect(canvas.width).toBe(512);
  expect(canvas.height).toBe(288);
  expect(canvas.cssWidth).toBeGreaterThan(200);
  expect(canvas.cssHeight).toBeGreaterThan(100);
  await expect.poll(() => page.evaluate(() => [...document.images].length)).toBeGreaterThanOrEqual(0);
  expect(errors).toEqual([]);
});

test('inicia a jornada, move o personagem e pausa corretamente', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('button', { name: 'INICIAR JORNADA' }).click();
  await expect(page.locator('#overlay')).toHaveClass(/hidden/);
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(400);
  await page.keyboard.up('ArrowRight');
  await page.keyboard.press('Escape');
  await expect(page.locator('#overlay')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'JOGO PAUSADO' })).toBeVisible();
  await page.screenshot({ path: 'test-results/eden-paused.png' });
  await page.getByRole('button', { name: 'VOLTAR AO JOGO' }).click();
  await expect(page.locator('#overlay')).toHaveClass(/hidden/);
  expect(errors).toEqual([]);
});

test('salva e recupera o capítulo selecionado', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('tls_save_v3', JSON.stringify({
    chapter: 2, found: [0], done: [0, 1]
  })));
  await page.reload();
  await page.getByRole('button', { name: 'CONTINUAR' }).click();
  await expect(page.locator('#chapter')).toContainText('03');
  await expect(page.locator('#overlay')).toBeVisible();
});
