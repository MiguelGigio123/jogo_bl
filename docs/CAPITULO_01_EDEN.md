# Capítulo 1 — O Jardim do Éden

## Estrutura da experiência
O primeiro capítulo deixa de ser uma única tela com três pontos próximos. O jardim agora é um mapa maior (900 × 560 unidades) com câmera que acompanha o jogador e três regiões exploráveis:
- Clareira dos animais, ao sul/oeste.
- Margens do rio e ponte de pedras no centro.
- Bosque oriental, liberado depois das três primeiras descobertas.

## Progressão
1. Converse com Eva para receber o objetivo.
2. Observe a clareira dos animais e descubra a vida presente no jardim (Gênesis 2:19–20).
3. Siga o rio e identifique seus quatro braços: Pisom, Giom, Tigre e Eufrates (Gênesis 2:10–14). O desafio permite selecionar as quatro opções e confirmar.
4. Examine a árvore da vida (Gênesis 2:9).
5. As três pistas liberam a passagem para o bosque oriental.
6. Examine a árvore do conhecimento e responda qual árvore está ligada ao mandamento de Gênesis 2:16–17.
7. Ao concluir, a jornada apresenta a tela de capítulo concluído.

## Ambiente
O novo cenário foi desenhado em pixel art no canvas: copas ao fundo, vegetação, clareiras floridas, animais, rio animado, ponte, árvores distintas, bosque oriental e portão antigo. A câmera acompanha o personagem dentro dos limites do mapa. O rio impede atravessar em qualquer ponto; a passagem ocorre pela ponte.

## Controles
- WASD ou setas: movimentar
- E: interagir com Eva e com os pontos de descoberta
- ESC: pausar

## Persistência
O capítulo continua usando o salvamento local existente. O estado de descoberta e a liberação da ponte são guardados no progresso.

## Testes automatizados adicionados
- Percurso dos três indícios, desbloqueio da ponte e enigma final.
- Seleção dos quatro rios e conclusão do capítulo.
- Caminhada real até a clareira dos animais e interação por proximidade.
- Câmera limitada ao mapa.

Os testes ainda precisam terminar no GitHub Actions antes de declarar a etapa aprovada. A validação automatizada também não substitui uma revisão visual humana do resultado.
