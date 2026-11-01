# Relatório de QA — build 0.2 (reconstrução)

## Verificações executadas

| Verificação | Resultado | Evidência |
|---|---|---|
| Sintaxe JavaScript | PASSOU | `node --check` no script extraído de `index.html`, sem erros |
| Integridade dos PNGs | PASSOU | 25 PNGs abertos e validados com Pillow |
| Cenários individuais | PASSOU | 7 arquivos em `assets/scenes/` |
| Personagens individuais | PASSOU | 9 poses e 9 spritesheets em `assets/characters/` |
| Spritesheets | PASSOU | Cada folha mede 128×160 px (4 colunas × 4 direções; quadros 32×40) |
| Estrutura do jogo | PASSOU | 7 capítulos declarados; cada capítulo contém 3 pistas/tarefas |
| Layout responsivo | INSPEÇÃO DE CÓDIGO | Canvas 16:9 dimensionado para ocupar a maior área possível da janela; HUD sobreposto |
| Chromium headless / Playwright | BLOQUEADO NO AMBIENTE | Chromium headless excedeu 12 s; Playwright retornou `ERR_BLOCKED_BY_ADMINISTRATOR` ao abrir tanto `file://` quanto `127.0.0.1`. A renderização não pôde ser confirmada neste ambiente |
| Teste manual completo de gameplay | PENDENTE | Requer abrir o jogo num navegador interativo e percorrer os sete capítulos |
| Testes em múltiplos navegadores/dispositivos | PENDENTE | Não executados |

## Observações importantes
- Não declarar a build como livre de bugs: a execução de navegador headless não foi concluída e o percurso manual completo não foi realizado.
- O teste de sintaxe não prova que todas as interações funcionam visualmente em todos os navegadores.
- A build substitui o protótipo procedural anterior por cenários e spritesheets carregados como arquivos reais do jogo.
- Salvamento é local ao navegador e não sincroniza entre dispositivos.
