# Auditoria inicial — THE BIBLE: LOST SECRETS

Data: 2026-11-01  
Branch de trabalho: `rebuild/phase-1-visual-gameplay`  
Base: `main`

## Escopo desta auditoria

Inspeção estática do `index.html` publicado. Isso não equivale a jogar o jogo em um navegador nem aprova qualquer capítulo.

## Problemas confirmados no código

1. **Cenários sem exploração real:** cada capítulo desenha uma única imagem estática de fundo em 256×144. Não há mapa por salas, camadas de cenário com parallax, objetos de cenário animados nem transições de área.
2. **Pontos de interação genéricos:** os três pontos de interação usam as mesmas coordenadas em todos os capítulos (`taskPositions`). São marcadores luminosos, não objetos temáticos integrados ao cenário.
3. **NPC em posição fixa:** todos os personagens não jogáveis são colocados na mesma coordenada (`npcPositions`).
4. **Colisão ausente:** o movimento limita o jogador às bordas do canvas, mas não verifica colisão com paredes, água, árvores, estruturas ou obstáculos.
5. **Animação limitada:** o personagem usa quatro quadros de caminhada; parado, volta sempre ao quadro zero. Não há ciclos de idle, interação, fala, reação, ações especiais ou animações narrativas por personagem.
6. **Desafio de Noé superficial:** a escolha aceita pares específicos hard-coded, sem memória visual, organização espacial ou regras de montagem.
7. **Travessia de Moisés superficial:** o desafio consiste em clicar cinco vezes; não existe navegação por rota, leitura de terreno ou obstáculo.
8. **Jacó simplificado:** o desafio é alternar A/D doze vezes. Não há encenação, sequência de animação nem progressão dramática.
9. **Multiplicação simplificada:** oito cliques concluem a distribuição, sem gestão de grupos, rotas ou feedback visual de distribuição.
10. **Davi simplificado:** o medidor de precisão é um único valor repetido três vezes, sem sequência de preparação ou animação de ação.
11. **Capítulo 1 e 2:** as pistas são textos acionados por proximidade; não há enigmas que exijam combinar evidências ou interpretar o espaço.
12. **Persistência incompleta:** o estado salvo inclui capítulo, capítulos concluídos e pistas, mas não guarda posição, estado detalhado de minijogos ou versão de save.

## Roteiro de reconstrução

### Marco 1 — fundação visual e de controles
- Ajustar layout para usar o viewport sem cortar a proporção e sem barras/áreas desperdiçadas.
- Criar mapa em tiles/camadas por capítulo, com colisões e objetos de cenário próprios.
- Integrar spritesheets com estados idle, caminhada, interação e ações específicas; sincronizar animação com direção e velocidade.
- Colocar NPCs e objetos em posições temáticas próprias, com feedback de interação.

### Marco 2 — capítulo piloto
Reconstruir o Jardim do Éden como fase-modelo:
- área explorável com caminhos, vegetação, rio, árvores e pontos de interesse;
- colisões reais e limites de navegação;
- NPCs/objetos e pistas integrados ao mundo;
- enigma em etapas com pistas que se combinam, sem contradizer Gênesis 2–3;
- diálogos, animações e transição de conclusão.

### Marco 3 — capítulos 2 a 7
Cada capítulo terá layout, regras, objetos, obstáculos, ritmo e mecânica próprios. Não reutilizar o mesmo padrão de três marcadores + caixa de texto.

### Marco 4 — testes
- teste automatizado de carregamento e erros JS;
- teste de viewport/responsividade;
- testes de interação e progressão por capítulo;
- testes de colisão e bloqueios;
- testes de save/load;
- sessões de gameplay manual documentadas com capturas e resultados.

## Limitação atual

Até esta auditoria, foi possível inspecionar o código do repositório. Não foi executada uma sessão de gameplay interativo. Nenhum capítulo deve ser marcado como aprovado até que esses testes sejam realmente executados.
