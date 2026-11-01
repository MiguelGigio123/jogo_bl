const { test, expect } = require('@playwright/test');

test('carrega a página, canvas e interface inicial sem erros JavaScript', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle(/THE BIBLE: LOST SECRETS/i);
  await expect(page.locator('#game')).toBeVisible();
  await expect(page.locator('#overlay')).toBeVisible();
  await expect(page.locator('#start')).toBeVisible();
  await expect(page.locator('script[src="art.js"]')).toHaveCount(1);
  await expect(page.locator('script[src="game.js"]')).toHaveCount(1);
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
  await expect(page.getByRole('heading', { name: 'JOGO PAUSADO' })).toBeVisible();
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
});

async function interact(page, index) {
  await page.evaluate(i => window.__TLS_TEST__.interactSpot(i), index);
}
async function closeSpot(page) {
  await page.getByRole('button', { name: 'CONTINUAR' }).click();
}
async function solve(page, chapter, spot) {
  if (chapter === 0) {
    await page.locator('[data-eden="knowledge"]').click();
  } else if (chapter === 1) {
    for (const answer of [0, 1, 0]) await page.locator('[data-choice="' + answer + '"]').click();
  } else if (chapter === 2) {
    for (const lane of ['NORTE', 'CENTRO', 'SUL', 'CENTRO', 'NORTE'])
      await page.locator('[data-lane="' + lane + '"]').click();
  } else if (chapter === 3) {
    await page.locator('[data-answer="0"]').click();
  } else if (chapter === 4) {
    for (const answer of [1, 1, 0, 0]) await page.locator('[data-j="' + answer + '"]').click();
  } else if (chapter === 5) {
    for (const size of [2, 1, 3, 2, 3, 1]) await page.locator('[data-size="' + size + '"]').click();
  } else if (chapter === 6) {
    await page.locator('[data-david="trust"]').click();
  }
  await expect(page.getByRole('button', { name: 'CONTINUAR' })).toBeVisible();
  await closeSpot(page);
}

test('os sete capítulos permitem concluir seus pontos de exploração e enigmas', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/?test=1');
  const puzzleSpot = [2, 1, 1, -1, 1, 1, 1];
  for (let chapter = 0; chapter < 7; chapter++) {
    await page.evaluate(i => window.__TLS_TEST__.setChapter(i), chapter);
    if (chapter === 3) {
      for (let spot = 0; spot < 3; spot++) {
        await interact(page, spot);
        await page.locator('[data-answer="0"]').click();
        await closeSpot(page);
      }
    } else {
      const p = puzzleSpot[chapter];
      for (let spot = 0; spot < 3; spot++) {
        await interact(page, spot);
        if (spot === p) await solve(page, chapter, spot);
        else await closeSpot(page);
      }
    }
    await expect(page.getByRole('heading', { name: 'CAPÍTULO CONCLUÍDO' })).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('mantém o jogador dentro da área caminhável e renderiza texto em alta resolução', async ({ page }) => {
  await page.goto('/?test=1');
  const metrics = await page.evaluate(() => {
    const canvas = document.querySelector('#game');
    const style = getComputedStyle(canvas);
    return { width: canvas.width, height: canvas.height, imageRendering: style.imageRendering };
  });
  expect(metrics.width).toBe(1024);
  expect(metrics.height).toBe(576);
  expect(metrics.imageRendering).not.toBe('pixelated');
  await page.evaluate(() => window.__TLS_TEST__.setChapter(0));
  await page.keyboard.down('ArrowUp');
  await page.waitForTimeout(2600);
  await page.keyboard.up('ArrowUp');
  const player = await page.evaluate(() => window.__TLS_TEST__.getState());
  expect(player.y).toBeGreaterThanOrEqual(128);
  expect(player.y).toBeLessThanOrEqual(258);
});

test('Éden: três pistas liberam a clareira oriental e o enigma final', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/?test=1');
  await page.evaluate(() => window.__TLS_TEST__.setChapter(0));
  for (const spot of [0, 1, 2]) {
    await page.evaluate(i => window.__TLS_TEST__.interactSpot(i), spot);
    if (spot === 1) {
      for (const n of ['PISOM','GIOM','TIGRE','EUFRATES'])
        await page.locator('[data-river]').filter({hasText:n}).click();
      await page.getByRole('button', { name: 'CONFIRMAR' }).click();
    }
    await expect(page.getByRole('button', { name: 'CONTINUAR' })).toBeVisible();
    await page.getByRole('button', { name: 'CONTINUAR' }).click();
  }
  let status = await page.evaluate(() => window.__TLS_TEST__.getState());
  expect(status.edenBridge).toBe(true);
  await page.evaluate(() => window.__TLS_TEST__.interactSpot(3));
  await page.locator('[data-eden="knowledge"]').click();
  await page.getByRole('button', { name: 'CONTINUAR' }).click();
  await expect(page.getByRole('heading', { name: 'CAPÍTULO CONCLUÍDO' })).toBeVisible();
  status = await page.evaluate(() => window.__TLS_TEST__.getState());
  expect(status.found).toEqual([0, 1, 2, 3]);
  expect(errors).toEqual([]);
});

test('Éden: câmera acompanha o jogador sem sair dos limites do mundo', async ({ page }) => {
  await page.goto('/?test=1');
  await page.evaluate(() => window.__TLS_TEST__.setChapter(0));
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(2500);
  await page.keyboard.up('ArrowRight');
  const s = await page.evaluate(() => window.__TLS_TEST__.getState());
  expect(s.x).toBeLessThanOrEqual(876);
  expect(s.cameraX).toBeGreaterThanOrEqual(0);
  expect(s.cameraX).toBeLessThanOrEqual(388);
});
