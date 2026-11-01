# Evolução visual e de gameplay — etapa 2

## Arte autoral em pixel art
O arquivo `art.js` desenha os personagens e cenários diretamente no canvas, sem depender de sprites genéricos externos:
- Personagens com paletas, roupas, cabelo, barba e acessórios próprios: explorador, Eva, Adão, Noé, Moisés, Jacó, Jesus, Davi e Golias.
- Cenários diferentes para Éden, arca, travessia do mar, vila dos Evangelhos, noite de Jacó, multidão dos pães e peixes e acampamento de Davi.
- Camadas de terreno, água, construções, sombras e partículas ambientais.

## Estados de animação
O renderizador diferencia idle, caminhada, fala, interação e ação especial. O movimento continua usando colisão por eixo para evitar atravessar obstáculos.

## Enigmas aprofundados nesta etapa
- Éden: distinção entre a árvore da vida e a árvore do conhecimento, ligada a Gênesis 2:16–17.
- Arca: três etapas de classificação de grupos de animais.
- Mar Vermelho: sequência de cinco escolhas de rota simbólica.
- Evangelhos: três perguntas independentes sobre as histórias selecionadas.
- Jacó: ordenação narrativa de quatro momentos até o amanhecer.
- Pães e peixes: seis etapas de distribuição com tamanhos de grupo explicitamente identificados como abstração de jogo, não como números bíblicos.
- Davi: escolha interpretativa ligada à confiança expressa em 1 Samuel 17.

## Transições
A passagem entre capítulos agora apresenta uma tela de chegada antes de iniciar a próxima jornada.

## Verificação
A suíte Playwright cobre carregamento, movimentação, pausa, salvamento e um percurso automatizado pelos enigmas dos sete capítulos. O teste usa um pequeno harness habilitado somente com `?test=1`; ele não é ativado na navegação normal.

## Limitações que ainda exigem trabalho
Esta etapa melhora substancialmente a direção visual, mas ainda não equivale a arte final desenhada quadro a quadro por um artista. As animações são procedurais e curtas; faltam mais quadros de caminhada, expressões faciais, cenas cinematográficas dedicadas, diálogos ramificados, puzzles com objetos físicos no mapa e testes exploratórios humanos em diferentes navegadores/dispositivos. A aprovação do CI confirma somente os cenários automatizados implementados.
