## Objetivo
Melhorar a aba **Produtos** para encontrar itens mais rápido, adicionando ordenação e destaque de alertas. Os filtros por categoria e marca já existem hoje em `src/components/Filters.tsx` — vou mantê-los e complementar.

## O que vou fazer

1. **Ordenação na listagem** (`src/routes/produtos.tsx` + `src/components/Filters.tsx`)
   - Novo seletor "Ordenar por" com opções:
     - Alertas primeiro (zerado → baixo → ok), depois nome
     - Menor estoque
     - Maior estoque
     - Nome (A–Z)
     - Mais recentes
   - Padrão: **Alertas primeiro**, para que rupturas apareçam no topo.

2. **Filtro rápido "Somente alertas"**
   - Toggle/checkbox ao lado do seletor de ordenação que mostra apenas produtos com status `baixo` ou `zerado`.

3. **Contador de alertas no topo da aba**
   - Pequeno badge HUD ao lado do título mostrando "X alertas" (clicável para ativar o filtro "Somente alertas").

4. **Manter visual Cyber-luxe HUD**
   - Usar os tokens existentes (`hud-card`, cores `primary`/gold, tipografia uppercase).
   - Sem mexer em lógica de estoque, cadastro ou movimentação.

## Arquivos afetados
- `src/components/Filters.tsx` — adicionar props `sort`, `setSort`, `onlyAlerts`, `setOnlyAlerts` + novos controles.
- `src/routes/produtos.tsx` — estado de ordenação/alertas, lógica de sort/filter, contador no header.

## Fora do escopo
- Não altero schema, storage, nem o card do produto.
- Não mexo em outras rotas.

Posso seguir?