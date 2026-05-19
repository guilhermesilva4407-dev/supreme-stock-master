# Supreme Multimarcas

Sistema de gestão de estoque para loja multimarcas de streetwear, com visual **Cyber-luxe HUD** — interface escura, acentos dourados e tipografia moderna que transmite sofisticação e controle total sobre o inventário.

![Dashboard](https://storage.googleapis.com/gpt-engineer-file-uploads/0a0ad0a3-8b99-4cf4-a3aa-4796a85c5b4f/tool-images/1d94e892-b182-4a02-9fec-df1d996caeb6.png)

---

## Funcionalidades

### Painel da Loja (Dashboard)
- **Métricas em tempo real**: Estoque total, SKUs ativos, valor em ativos e margem potencial
- **Alertas de ruptura**: Destaque visual imediato para produtos zerados ou com estoque baixo
- **Indicador de ocupação**: Barra de progresso mostrando capacidade do estoque
- Badge "Loja Aberta" com pulso de status ativo

### Catálogo de Produtos
- **Busca textual** por nome
- **Filtros**: Categoria (Camisetas, Moletons, Calças, Shorts, Tênis, Bonés, Acessórios) e Marca
- **Ordenação**: Alertas primeiro, menor estoque, maior estoque, nome A–Z, mais recentes
- **Filtro rápido "Somente alertas"**: isola produtos com estoque baixo/zerado
- **Badge de alertas** clicável no topo da página

### Movimentação Rápida
- Formulário inline no card do produto (sem modal)
- Toggle entre **Entrada** (fornecedor/devolução) e **Saída** (venda/perda)
- Campo de quantidade + seleção de motivo
- Ação em um clique com ícone de raio

### Cadastro
- Formulário completo para novos produtos: nome, marca, categoria, cor, tamanho, quantidade, preços e estoque mínimo

### Movimentações
- Histórico completo de todas as entradas e saídas
- Detalhes por produto, tipo, quantidade, motivo e data

### Backup
- Exportação e importação de dados em JSON

---

## Tecnologias

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| [TanStack Start](https://tanstack.com/start) | v1 | Framework full-stack com SSR/SSG |
| [React](https://react.dev) | 19 | UI library |
| [TypeScript](https://www.typescriptlang.org) | 5.8 | Tipagem estática |
| [Tailwind CSS](https://tailwindcss.com) | v4 | Estilização utility-first |
| [shadcn/ui](https://ui.shadcn.com) | — | Componentes de interface (Radix + Tailwind) |
| [TanStack Query](https://tanstack.com/query) | v5 | Cache e estado assíncrono |
| [TanStack Router](https://tanstack.com/router) | v1 | Roteamento type-safe |
| [Recharts](https://recharts.org) | v2 | Gráficos (preparado para futuro dashboard de vendas) |
| [Lucide React](https://lucide.dev) | v0.575 | Ícones |
| [Zod](https://zod.dev) | v3 | Validação de schemas |

### Design System
- **Paleta**: Gold Noir — fundo escuro (#0a0a1a / #141432) com acentos dourados (oklch 0.74 0.13 78)
- **Tipografia**: Space Grotesk (títulos, display) + DM Sans (corpo, UI)
- **Layout**: Bento Grid — cards assimétricos em grid responsivo
- **Estilo**: HUD cyber-luxo com bordas sutis, glows dourados, tracking amplo e uppercase técnico

---

## Estrutura de Pastas

```
src/
├── components/           # Componentes reutilizáveis
│   ├── ui/              # shadcn/ui (Button, Input, Select, Dialog...)
│   ├── Header.tsx       # Navegação principal com logo e alertas
│   ├── MetricCard.tsx   # Cards de métricas do dashboard
│   ├── ProductCard.tsx  # Card de produto com movimentação inline
│   ├── ProductForm.tsx  # Formulário de cadastro de produto
│   ├── Filters.tsx      # Filtros e ordenação do catálogo
│   ├── Footer.tsx       # Rodapé
│   ├── BottomNav.tsx    # Navegação mobile (bottom sheet)
│   ├── BackupSection.tsx # Export/import JSON
│   └── MovementDialog.tsx # [legado] movimentação via modal
├── routes/              # Rotas do TanStack Router (file-based)
│   ├── __root.tsx       # Layout raiz
│   ├── index.tsx        # / — Dashboard (Painel da Loja)
│   ├── produtos.tsx     # /produtos — Catálogo
│   ├── cadastrar.tsx    # /cadastrar — Novo produto
│   └── movimentacoes.tsx # /movimentacoes — Histórico
├── hooks/
│   └── useInventory.ts  # Hook central de estado do estoque
├── lib/
│   ├── types.ts         # Types, enums e funções de domínio
│   ├── storage.ts       # Persistência local (localStorage)
│   ├── backup.ts        # Lógica de export/import JSON
│   ├── utils.ts         # Utilitários (cn, formatters)
│   └── error-*.ts       # Captura e tratamento de erros
├── styles.css           # Tokens de design system (variáveis CSS oklch)
├── router.tsx           # Configuração do router
└── start.ts             # Entry point do TanStack Start
```

---

## Como Executar

```bash
# Instalar dependências
bun install

# Servidor de desenvolvimento
bun dev

# Build de produção
bun run build

# Preview do build
bun run preview

# Lint e formatação
bun run lint
bun run format
```

O app roda por padrão em `http://localhost:3000`.

---

## Arquitetura de Estado

O estoque é gerenciado via hook customizado `useInventory` que:
- Armazena produtos e movimentações no `localStorage`
- Fornece operações CRUD de produtos
- Registra movimentações com validação de saldo
- Expõe contadores de alertas e métricas derivadas

**Fluxo de movimentação:**
1. Usuário seleciona tipo (entrada/saída) no card do produto
2. Informa quantidade e motivo
3. `registrarMovimentacao` atualiza a quantidade do produto
4. Movimentação é salva no histórico com timestamp ISO
5. UI reativa reflete a mudança imediatamente

---

## Modelo de Dados

```typescript
interface Produto {
  id: string;
  nome: string;
  marca: string;
  categoria: "Camisetas" | "Moletons" | "Calças" | "Shorts" | "Tênis" | "Bonés" | "Acessórios";
  cor: string;
  tamanho: string;
  quantidade: number;
  preco_custo: number;
  preco_venda: number;
  estoque_minimo: number;
  criado_em: string; // ISO 8601
}

interface Movimentacao {
  id: string;
  produto_id: string;
  produto_nome: string;
  tipo: "entrada" | "saida";
  quantidade: number;
  motivo: "venda" | "devolucao" | "perda" | "fornecedor";
  data: string; // ISO 8601
}
```

**Status de estoque:**
- `zerado` — quantidade === 0 (crítico, vermelho)
- `baixo` — quantidade <= estoque_minimo (alerta, dourado)
- `ok` — quantidade > estoque_minimo (normal)

---

## Roadmap

1. [x] Dashboard com métricas e alertas
2. [x] Catálogo com filtros, busca e ordenação
3. [x] Movimentação inline nos cards
4. [ ] Auth (login da loja) via Lovable Cloud
5. [ ] Imagens nos produtos
6. [ ] Gráficos de vendas (semanal/mensal por categoria)
7. [ ] Categorias e marcas editáveis
8. [ ] Código de barras + busca por scan
9. [ ] Backup automático (cloud)

---

## Licença

Projeto privado — Supreme Multimarcas.

---

<p align="center">
  <sub>Cyber-luxe HUD · Gold Noir · Bento Grid</sub>
</p>
