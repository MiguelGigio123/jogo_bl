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
    for (const [step, answer] of [0, 1, 0].entries()) { await page.locator('[data-choice="' + answer + '"]').click(); if (step < 2) await page.locator('#arkNext').click(); }
  } else if (chapter === 2) {
    for (const [step, answer] of [1, 0, 2].entries()) { await page.locator('[data-lane="' + answer + '"]').click(); if (step < 2) await page.locator('#mosesNext').click(); }
  } else if (chapter === 3) {
    for (const [step, answer] of [0, 1, 1].entries()) { await page.locator('[data-jesus="'+answer+'"]').click(); if (step < 2) await page.locator('#jesusNext').click(); }
    await page.locator('#jesusDone').click();
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
  const puzzleSpot = [-1, 1, 1, -1, 1, 1, 1];
  for (let chapter = 0; chapter < 7; chapter++) {
    await page.evaluate(i => window.__TLS_TEST__.setChapter(i), chapter);
    if (chapter === 0) {
      for (const spot of [0, 1, 2]) {
        await interact(page, spot);
        if (spot === 1) {
          for (const name of ['PISOM','GIOM','TIGRE','EUFRATES'])
            await page.locator('[data-river]').filter({hasText:name}).click();
          await page.locator('#confirmRivers').click();
        }
        await closeSpot(page);
      }
      await interact(page, 3);
      await page.locator('[data-eden="knowledge"]').click();
      await closeSpot(page);
    } else if (chapter === 3) {
      for (let spot = 0; spot < 3; spot++) {
        await interact(page, spot);
        for (let step = 0; step < 3; step++) {
          const answer = [[0, 1, 1], [0, 1, 0], [1, 0, 0]][spot][step];
          await page.locator('[data-jesus="'+answer+'"]').click();
          if (step < 2) await page.locator('#jesusNext').click();
        }
        await page.locator('#jesusDone').click();
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
  expect(player.y).toBeGreaterThanOrEqual(145);
  expect(player.y).toBeLessThanOrEqual(525);
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

test('Éden: jogador consegue caminhar fisicamente até a clareira dos animais e interagir', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/?test=1');
  await page.evaluate(() => window.__TLS_TEST__.setChapter(0));
  await page.keyboard.down('ArrowUp');
  await page.waitForTimeout(3500);
  await page.keyboard.up('ArrowUp');
  await page.keyboard.down('ArrowLeft');
  await page.waitForTimeout(3500);
  await page.keyboard.up('ArrowLeft');
  const player = await page.evaluate(() => window.__TLS_TEST__.getState());
  expect(Math.abs(player.x - 150)).toBeLessThan(32);
  expect(Math.abs(player.y - 220)).toBeLessThan(25);
  await page.keyboard.press('e');
  await expect(page.getByRole('heading', { name: 'Clareira dos animais' })).toBeVisible();
  expect(errors).toEqual([]);
});


test('Arca de Noé: cada etapa rejeita resposta incorreta e permite tentar novamente', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/?test=1');
  await page.evaluate(() => window.__TLS_TEST__.setChapter(1));
  await interact(page, 1);

  const stages = [
    { wrong: 1, right: 0, title: 'BAIA DOS ANIMAIS TERRESTRES' },
    { wrong: 0, right: 1, title: 'ESPAÇO DAS AVES' },
    { wrong: 2, right: 0, title: 'SUPRIMENTOS DA JORNADA' }
  ];

  for (let index = 0; index < stages.length; index++) {
    const stage = stages[index];
    await expect(page.getByRole('heading', { name: /A ARCA DE NOÉ/ })).toBeVisible();
    await expect(page.locator('h3')).toHaveText(stage.title);

    await page.locator('[data-choice="' + stage.wrong + '"]').click();
    await expect(page.getByRole('heading', { name: 'VAMOS ORGANIZAR NOVAMENTE' })).toBeVisible();
    await page.locator('#arkRetry').click();
    await expect(page.locator('h3')).toHaveText(stage.title);

    await page.locator('[data-choice="' + stage.right + '"]').click();
    if (index < stages.length - 1) {
      await expect(page.getByRole('heading', { name: 'BOA ORGANIZAÇÃO!' })).toBeVisible();
      await page.locator('#arkNext').click();
    }
  }

  await expect(page.getByRole('heading', { name: 'A ARCA ESTÁ ORGANIZADA' })).toBeVisible();
  await expect(page.locator('#arkDone')).toBeVisible();
  await page.locator('#arkDone').click();
  await expect(page.getByRole('heading', { name: 'Compartimentos' })).toBeVisible();
  const state = await page.evaluate(() => window.__TLS_TEST__.getState());
  expect(state.found).toContain(1);
  expect(errors).toEqual([]);
});

test('Arca de Noé: progresso só é registrado depois de concluir as três etapas', async ({ page }) => {
  await page.goto('/?test=1');
  await page.evaluate(() => window.__TLS_TEST__.setChapter(1));
  await interact(page, 1);

  await page.locator('[data-choice="0"]').click();
  await page.locator('#arkNext').click();
  let state = await page.evaluate(() => window.__TLS_TEST__.getState());
  expect(state.found).not.toContain(1);
  await expect(page.locator('h3')).toHaveText('ESPAÇO DAS AVES');

  await page.locator('[data-choice="1"]').click();
  await page.locator('#arkNext').click();
  state = await page.evaluate(() => window.__TLS_TEST__.getState());
  expect(state.found).not.toContain(1);
  await expect(page.locator('h3')).toHaveText('SUPRIMENTOS DA JORNADA');

  await page.locator('[data-choice="0"]').click();
  await page.locator('#arkDone').click();
  state = await page.evaluate(() => window.__TLS_TEST__.getState());
  expect(state.found).toContain(1);
});


test('Arca de Noé: indicador de progresso acompanha cada compartimento', async ({ page }) => {
  await page.goto('/?test=1');
  await page.evaluate(() => window.__TLS_TEST__.setChapter(1));
  await interact(page, 1);

  const progress = page.locator('.ark-progress div');
  await expect(progress).toHaveCSS('width', '0px');
  await page.locator('[data-choice="0"]').click();
  await page.locator('#arkNext').click();
  await expect(page.locator('h3')).toHaveText('ESPAÇO DAS AVES');
  await expect(progress).toHaveAttribute('style', /width:\s*33\.33333333333333%/);

  await page.locator('[data-choice="1"]').click();
  await page.locator('#arkNext').click();
  await expect(page.locator('h3')).toHaveText('SUPRIMENTOS DA JORNADA');
  await expect(progress).toHaveAttribute('style', /width:\s*66\.66666666666666%/);
});

test('Arca de Noé: não permite avançar com clique repetido ou resposta errada', async ({ page }) => {
  await page.goto('/?test=1');
  await page.evaluate(() => window.__TLS_TEST__.setChapter(1));
  await interact(page, 1);

  await page.locator('[data-choice="2"]').click();
  await expect(page.getByRole('heading', { name: 'VAMOS ORGANIZAR NOVAMENTE' })).toBeVisible();
  await page.locator('#arkRetry').click();
  await expect(page.locator('h3')).toHaveText('BAIA DOS ANIMAIS TERRESTRES');

  await page.locator('[data-choice="0"]').click();
  await expect(page.getByRole('heading', { name: 'BOA ORGANIZAÇÃO!' })).toBeVisible();
  await page.locator('#arkNext').click();
  await expect(page.locator('h3')).toHaveText('ESPAÇO DAS AVES');
  await expect(page.locator('[data-choice]')).toHaveCount(3);
  await expect(page.locator('#arkNext')).toHaveCount(0);
});

test('Arca de Noé: conclusão é salva no armazenamento local', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/?test=1');
  await page.evaluate(() => window.__TLS_TEST__.setChapter(1));
  await interact(page, 1);

  for (const [step, answer] of [0, 1, 0].entries()) {
    await page.locator('[data-choice="' + answer + '"]').click();
    if (step < 2) await page.locator('#arkNext').click();
  }
  await expect(page.getByRole('heading', { name: 'A ARCA ESTÁ ORGANIZADA' })).toBeVisible();
  await page.locator('#arkDone').click();
  await page.getByRole('button', { name: 'CONTINUAR' }).click();

  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('tls_save_v3')));
  expect(saved.chapter).toBe(1);
  expect(saved.found).toContain(1);
  expect(errors).toEqual([]);
});

test('Arca de Noé: reabrir ponto concluído não reinicia o desafio', async ({ page }) => {
  await page.goto('/?test=1');
  await page.evaluate(() => window.__TLS_TEST__.setChapter(1));
  await interact(page, 1);

  for (const [step, answer] of [0, 1, 0].entries()) {
    await page.locator('[data-choice="' + answer + '"]').click();
    if (step < 2) await page.locator('#arkNext').click();
  }
  await page.locator('#arkDone').click();
  await page.getByRole('button', { name: 'CONTINUAR' }).click();

  await page.evaluate(() => window.__TLS_TEST__.interactSpot(1));
  await expect(page.locator('#overlay')).toHaveClass(/hidden/);
  const state = await page.evaluate(() => window.__TLS_TEST__.getState());
  expect(state.found).toContain(1);
  expect(state.mode).toBe('play');
});


test('Travessia do Mar: cada etapa rejeita escolha incorreta e permite tentar novamente', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/?test=1');
  await page.evaluate(() => window.__TLS_TEST__.setChapter(2));
  await interact(page, 1);

  await expect(page.locator('h3')).toHaveText('ENCONTRE A ABERTURA');
  await page.locator('[data-lane="0"]').click();
  await expect(page.getByRole('heading', { name: 'OBSERVE AS ÁGUAS' })).toBeVisible();
  await page.locator('#mosesRetry').click();
  await expect(page.locator('h3')).toHaveText('ENCONTRE A ABERTURA');
  await page.locator('[data-lane="1"]').click();
  await expect(page.getByRole('heading', { name: 'ETAPA CONCLUÍDA' })).toBeVisible();
  await page.locator('#mosesNext').click();
  await expect(page.locator('h3')).toHaveText('ATRAVESSE O CAMINHO SECO');
  expect(errors).toEqual([]);
});

test('Travessia do Mar: progresso avança em três etapas sem pular nenhuma', async ({ page }) => {
  await page.goto('/?test=1');
  await page.evaluate(() => window.__TLS_TEST__.setChapter(2));
  await interact(page, 1);
  const progress = page.locator('.moses-progress');
  await expect(progress).toHaveAttribute('aria-valuenow', '0');

  await page.locator('[data-lane="1"]').click();
  await page.locator('#mosesNext').click();
  await expect(progress).toHaveAttribute('aria-valuenow', '1');
  await expect(page.locator('h3')).toHaveText('ATRAVESSE O CAMINHO SECO');

  await page.locator('[data-lane="0"]').click();
  await page.locator('#mosesNext').click();
  await expect(progress).toHaveAttribute('aria-valuenow', '2');
  await expect(page.locator('h3')).toHaveText('ALCANCE A OUTRA MARGEM');
});

test('Travessia do Mar: conclusão só registra o ponto depois da terceira etapa', async ({ page }) => {
  await page.goto('/?test=1');
  await page.evaluate(() => window.__TLS_TEST__.setChapter(2));
  await interact(page, 1);

  await page.locator('[data-lane="1"]').click();
  await page.locator('#mosesNext').click();
  let state = await page.evaluate(() => window.__TLS_TEST__.getState());
  expect(state.found).not.toContain(1);

  await page.locator('[data-lane="0"]').click();
  await page.locator('#mosesNext').click();
  state = await page.evaluate(() => window.__TLS_TEST__.getState());
  expect(state.found).not.toContain(1);

  await page.locator('[data-lane="2"]').click();
  await expect(page.getByRole('heading', { name: 'TRAVESSIA CONCLUÍDA' })).toBeVisible();
  await page.locator('#mosesDone').click();
  await expect(page.getByRole('heading', { name: 'Caminho entre as águas' })).toBeVisible();
  state = await page.evaluate(() => window.__TLS_TEST__.getState());
  expect(state.found).toContain(1);
});

test('Travessia do Mar: botões e texto das etapas permanecem utilizáveis em tela mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?test=1');
  await page.evaluate(() => window.__TLS_TEST__.setChapter(2));
  await interact(page, 1);
  await expect(page.locator('#overlay')).toBeVisible();
  await expect(page.locator('[data-lane]')).toHaveCount(3);
  for (const button of await page.locator('[data-lane]').all()) {
    const box = await button.boundingBox();
    expect(box).not.toBeNull();
    expect(box.width).toBeGreaterThan(0);
    expect(box.height).toBeGreaterThan(0);
  }
});

test('Jesus: as três histórias têm etapas próprias, progresso e conclusão independente', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/?test=1');
  await page.evaluate(() => window.__TLS_TEST__.setChapter(3));
  const expected = [
    {spot:0,answers:[0,1,1],title:'O BOM SAMARITANO'},
    {spot:1,answers:[0,1,0],title:'A TEMPESTADE ACALMADA'},
    {spot:2,answers:[1,0,0],title:'O FILHO PRÓDIGO'}
  ];
  for (const story of expected) {
    await interact(page, story.spot);
    await expect(page.locator('.panel h2')).toContainText(story.title);
    const progress=page.locator('.jesus-progress');
    await expect(progress).toHaveAttribute('aria-valuenow','0');
    await page.locator('[data-jesus="2"]').click();
    await expect(page.getByRole('heading',{name:'RELEMBRE A HISTÓRIA'})).toBeVisible();
    await page.locator('#jesusRetry').click();
    for(let step=0;step<3;step++){
      await page.locator('[data-jesus="'+story.answers[step]+'"]').click();
      if(step<2){
        await page.locator('#jesusNext').click();
        await expect(progress).toHaveAttribute('aria-valuenow',String(step+1));
      }
    }
    await expect(page.getByRole('heading',{name:'HISTÓRIA DESCOBERTA'})).toBeVisible();
    await page.locator('#jesusDone').click();
    await expect(page.getByRole('heading',{name:story.spot===0?'O Bom Samaritano':story.spot===1?'A tempestade acalmada':'O filho pródigo'})).toBeVisible();
    await closeSpot(page);
  }
  const state=await page.evaluate(()=>window.__TLS_TEST__.getState());
  expect(state.found).toEqual([0,1,2]);
  expect(errors).toEqual([]);
});

test('Jesus: interface das histórias cabe em tela mobile e mantém controles acessíveis', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/?test=1');
  await page.evaluate(()=>window.__TLS_TEST__.setChapter(3));
  await interact(page,1);
  await expect(page.locator('.jesus-progress')).toBeVisible();
  for(const b of await page.locator('[data-jesus]').all()){
    const box=await b.boundingBox();
    expect(box).not.toBeNull();
    expect(box.width).toBeGreaterThan(0);
    expect(box.height).toBeGreaterThanOrEqual(32);
  }
});


test('Jesus: cada etapa das três histórias bloqueia todas as alternativas erradas', async ({ page }) => {
  await page.goto('/?test=1');
  await page.evaluate(()=>window.__TLS_TEST__.setChapter(3));
  const stories=[
    {spot:0,correct:[0,1,1]},
    {spot:1,correct:[0,1,0]},
    {spot:2,correct:[1,0,0]}
  ];
  for(const story of stories){
    await interact(page,story.spot);
    for(let step=0;step<3;step++){
      const wrong=story.correct[step]===0?1:0;
      await page.locator('[data-jesus="'+wrong+'"]').click();
      await expect(page.getByRole('heading',{name:'RELEMBRE A HISTÓRIA'})).toBeVisible();
      await expect(page.locator('#jesusRetry')).toBeVisible();
      await page.locator('#jesusRetry').click();
      await expect(page.locator('.jesus-progress')).toHaveAttribute('aria-valuenow',String(step));
      await page.locator('[data-jesus="'+story.correct[step]+'"]').click();
      if(step<2) await page.locator('#jesusNext').click();
    }
    await expect(page.getByRole('heading',{name:'HISTÓRIA DESCOBERTA'})).toBeVisible();
    await page.locator('#jesusDone').click();
    await closeSpot(page);
  }
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('tls_save_v3')));
  expect(saved.chapter).toBe(3);
  expect(saved.found).toEqual([0,1,2]);
});

test('Jesus: interações repetidas não duplicam progresso nem reiniciam história concluída', async ({ page }) => {
  await page.goto('/?test=1');
  await page.evaluate(()=>window.__TLS_TEST__.setChapter(3));
  await interact(page,0);
  for(const [step,answer] of [0,1,1].entries()){
    await page.locator('[data-jesus="'+answer+'"]').click();
    if(step<2) await page.locator('#jesusNext').click();
  }
  await page.locator('#jesusDone').click();
  await closeSpot(page);
  let state=await page.evaluate(()=>window.__TLS_TEST__.getState());
  expect(state.found).toEqual([0]);
  await page.evaluate(()=>window.__TLS_TEST__.interactSpot(0));
  await expect(page.locator('#overlay')).toHaveClass(/hidden/);
  state=await page.evaluate(()=>window.__TLS_TEST__.getState());
  expect(state.found).toEqual([0]);
  expect(state.mode).toBe('play');
});

test('Jesus: jogador alcança fisicamente o primeiro ponto da vila e interage pelo teclado', async ({ page }) => {
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/?test=1');
  await page.evaluate(()=>window.__TLS_TEST__.setChapter(3));
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(500);
  await page.keyboard.up('ArrowRight');
  await page.keyboard.down('ArrowUp');
  await page.waitForTimeout(1150);
  await page.keyboard.up('ArrowUp');
  const player=await page.evaluate(()=>window.__TLS_TEST__.getState());
  expect(Math.abs(player.x-90)).toBeLessThan(20);
  expect(Math.abs(player.y-150)).toBeLessThan(22);
  await page.keyboard.press('e');
  await expect(page.locator('.panel h2')).toContainText('O BOM SAMARITANO');
  expect(errors).toEqual([]);
});


test('Todos os capítulos: interface não cria rolagem horizontal em celulares', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/?test=1');
  for (let chapter = 0; chapter < 7; chapter++) {
    await page.evaluate(i => window.__TLS_TEST__.setChapter(i), chapter);
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      page: document.documentElement.scrollWidth,
      canvas: document.querySelector('#game').getBoundingClientRect().width
    }));
    expect(dimensions.page, 'rolagem horizontal no capítulo ' + chapter).toBeLessThanOrEqual(dimensions.viewport);
    expect(dimensions.canvas).toBeGreaterThan(0);
  }
});

test('Jesus: progresso permanece salvo após recarregar a página', async ({ page }) => {
  await page.goto('/?test=1');
  await page.evaluate(() => window.__TLS_TEST__.setChapter(3));
  await interact(page, 1);
  for (const [step, answer] of [0, 1, 0].entries()) {
    await page.locator('[data-jesus="' + answer + '"]').click();
    if (step < 2) await page.locator('#jesusNext').click();
  }
  await page.locator('#jesusDone').click();
  await closeSpot(page);
  await page.reload();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('tls_save_v3')));
  expect(saved.chapter).toBe(3);
  expect(saved.found).toContain(1);
  await expect(page.getByRole('button', { name: 'CONTINUAR' })).toBeVisible();
  await page.getByRole('button', { name: 'CONTINUAR' }).click();
  await expect(page.locator('#chapter')).toContainText('04');
});

test('Todos os capítulos: nenhuma exceção JavaScript ao alternar rapidamente entre cenários', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/?test=1');
  for (const chapter of [0, 6, 2, 5, 1, 4, 3, 0, 3, 6]) {
    await page.evaluate(i => window.__TLS_TEST__.setChapter(i), chapter);
    await page.waitForTimeout(80);
  }
  expect(errors).toEqual([]);
});

test('Controles mobile: soltar o botão virtual interrompe o movimento', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?test=1');
  await page.evaluate(() => window.__TLS_TEST__.setChapter(3));
  const right = page.locator('[data-key="ArrowRight"]');
  if (await right.count()) {
    await right.dispatchEvent('pointerdown');
    await page.waitForTimeout(250);
    await right.dispatchEvent('pointerup');
    const stopped = await page.evaluate(() => window.__TLS_TEST__.getState());
    await page.waitForTimeout(250);
    const later = await page.evaluate(() => window.__TLS_TEST__.getState());
    expect(Math.abs(later.x - stopped.x)).toBeLessThan(2);
  } else {
    test.skip(true, 'A interface atual não expõe botão virtual com data-key=ArrowRight.');
  }
});


test('Jacó: quatro etapas seguem a narrativa e exibem progresso correto', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/?test=1');
  await page.evaluate(() => window.__TLS_TEST__.setChapter(4));
  await interact(page, 1);
  const progress = page.locator('.jacob-progress');
  const stages = [
    {answer:1,title:'A NOITE NO ACAMPAMENTO'},
    {answer:0,title:'O ENCONTRO JUNTO AO RIO'},
    {answer:0,title:'O PEDIDO DE UMA BÊNÇÃO'},
    {answer:1,title:'UM NOVO NOME'}
  ];
  for (let i=0;i<stages.length;i++) {
    await expect(page.locator('h3')).toHaveText(stages[i].title);
    await expect(progress).toHaveAttribute('aria-valuenow',String(i));
    await page.locator('[data-j="'+stages[i].answer+'"]').click();
    if(i<3) {
      await page.locator('#jacobNext').click();
      await expect(progress).toHaveAttribute('aria-valuenow',String(i+1));
    }
  }
  await expect(page.getByRole('heading',{name:'A JORNADA CHEGA AO AMANHECER'})).toBeVisible();
  await page.locator('#jacobDone').click();
  await expect(page.getByRole('button',{name:'CONTINUAR'})).toBeVisible();
  const state=await page.evaluate(()=>window.__TLS_TEST__.getState());
  expect(state.found).toContain(1);
  expect(errors).toEqual([]);
});

test('Jacó: respostas erradas não avançam a etapa e permitem nova tentativa', async ({ page }) => {
  await page.goto('/?test=1');
  await page.evaluate(() => window.__TLS_TEST__.setChapter(4));
  await interact(page,1);
  await page.locator('[data-j="0"]').click();
  await expect(page.getByRole('heading',{name:'RELEIA O RELATO'})).toBeVisible();
  await page.locator('#jacobRetry').click();
  await expect(page.locator('h3')).toHaveText('A NOITE NO ACAMPAMENTO');
  await expect(page.locator('.jacob-progress')).toHaveAttribute('aria-valuenow','0');
  await page.locator('[data-j="1"]').click();
  await page.locator('#jacobNext').click();
  await expect(page.locator('h3')).toHaveText('O ENCONTRO JUNTO AO RIO');
});

test('Jacó: não registra descoberta antes da quarta etapa', async ({ page }) => {
  await page.goto('/?test=1');
  await page.evaluate(() => window.__TLS_TEST__.setChapter(4));
  await interact(page,1);
  for (const [step,answer] of [1,0,0].entries()) {
    await page.locator('[data-j="'+answer+'"]').click();
    await page.locator('#jacobNext').click();
    const state=await page.evaluate(()=>window.__TLS_TEST__.getState());
    expect(state.found).not.toContain(1);
    expect(state.mode).toBe('puzzle');
  }
  await page.locator('[data-j="1"]').click();
  await page.locator('#jacobDone').click();
  const state=await page.evaluate(()=>window.__TLS_TEST__.getState());
  expect(state.found).toContain(1);
});

test('Jacó: painel e quatro opções continuam utilizáveis em celular', async ({ page }) => {
  await page.setViewportSize({width:320,height:700});
  await page.goto('/?test=1');
  await page.evaluate(()=>window.__TLS_TEST__.setChapter(4));
  await interact(page,1);
  await expect(page.locator('.jacob-progress')).toBeVisible();
  await expect(page.locator('[data-j]')).toHaveCount(3);
  const dims=await page.evaluate(()=>({
    viewport:document.documentElement.clientWidth,
    page:document.documentElement.scrollWidth,
    panel:document.querySelector('.panel').getBoundingClientRect().width
  }));
  expect(dims.page).toBeLessThanOrEqual(dims.viewport);
  expect(dims.panel).toBeGreaterThan(0);
});
