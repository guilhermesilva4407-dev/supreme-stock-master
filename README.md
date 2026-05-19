````md
# Supreme Multimarcas

## Link do Site
https://stock-swagger-flow.lovable.app

Sistema de gerenciamento de estoque para lojas multimarcas de streetwear, desenvolvido com foco em performance, controle visual e experiência premium.

O projeto utiliza uma identidade visual **Cyber-Luxe HUD**, combinando interface escura, detalhes dourados e tipografia moderna para transmitir sofisticação e controle total sobre o inventário.

---

# Painel da Loja

Dashboard com métricas inteligentes e monitoramento em tempo real do estoque.

## Funcionalidades do Dashboard

### Métricas em tempo real
- Estoque total
- SKUs ativos
- Valor em ativos
- Margem potencial

### Alertas automáticos
- Produtos zerados
- Estoque baixo

### Recursos adicionais
- Indicador de ocupação do estoque
- Badge de "Loja Aberta" com status ativo
- Interface responsiva e moderna

---

# Catálogo de Produtos

Gerenciamento completo do inventário.

## Busca e Filtros
- Busca textual por nome
- Filtro por categoria
- Filtro por marca

## Categorias disponíveis
- Camisetas
- Moletons
- Calças
- Shorts
- Tênis
- Bonés
- Acessórios

## Ordenação
- Alertas primeiro
- Menor estoque
- Maior estoque
- Nome A–Z
- Mais recentes

## Alertas Inteligentes
- Filtro rápido "Somente alertas"
- Badge clicável de produtos críticos

---

# Movimentação de Estoque

Sistema rápido e intuitivo para entradas e saídas.

## Funcionalidades
- Formulário inline no próprio card do produto
- Sem uso de modais
- Alternância entre:
  - Entrada
  - Saída

---

# Cadastro de Produtos

Formulário completo para adicionar novos itens ao estoque.

## Campos
- Nome do produto
- Marca
- Categoria
- Cor
- Tamanho
- Quantidade inicial
- Preço de custo
- Preço de venda
- Estoque mínimo

---

# Histórico de Movimentações

Registro completo de todas as entradas e saídas do estoque.

## Informações exibidas
- Produto
- Tipo (Entrada/Saída)
- Quantidade
- Motivo
- Data

---

# Backup em JSON

Exportação e importação do estado completo do estoque.

## Funcionalidades
- Download do backup em formato JSON
- Importação de arquivo JSON
- Preservação completa dos dados

---

# Tecnologias

| Tecnologia | Versão | Finalidade |
|---|---|---|
| TanStack Start | v1 | Framework full-stack |
| React | 19 | UI |
| TypeScript | 5.8 | Tipagem |
| Tailwind CSS | v4 | Estilos |
| shadcn/ui | latest | Componentes base |
| TanStack Query | v5 | Estado assíncrono |
| TanStack Router | v1 | Roteamento |
| Recharts | v2 | Gráficos |
| Lucide React | v0.575 | Ícones |
| Zod | v3 | Validação |

---

# Design System

## Identidade Visual
- Paleta: Gold Noir — preto profundo com dourado como cor de destaque
- Tipografia: Space Grotesk (títulos) + DM Sans (corpo)
- Layout: Bento Grid com cards arredondados e bordas sutis
- Estilo: HUD cyber-luxe, minimalista e sofisticado

## Tokens Principais

```css
--background: oklch(0.08 0.01 260);
--foreground: oklch(0.95 0.01 260);
--primary: oklch(0.75 0.15 85);
--accent: oklch(0.65 0.12 300);
--muted: oklch(0.2 0.02 260);
--border: oklch(0.2 0.01 260 / 0.5);
````

---

# Estrutura de Pastas

```bash
src/
├── components/
│   ├── ui/
│   ├── ProductCard.tsx
│   ├── ProductForm.tsx
│   ├── Filters.tsx
│   ├── MetricCard.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── BottomNav.tsx
│   ├── BackupSection.tsx
│   └── MovementDialog.tsx
│
├── routes/
│   ├── index.tsx
│   ├── produtos.tsx
│   ├── cadastrar.tsx
│   ├── movimentacoes.tsx
│   └── __root.tsx
│
├── hooks/
│   ├── useInventory.ts
│   └── use-mobile.tsx
│
├── lib/
│   ├── types.ts
│   ├── utils.ts
│   ├── storage.ts
│   ├── backup.ts
│   ├── error-page.ts
│   └── error-capture.ts
│
├── styles.css
├── router.tsx
└── start.ts
```

---

# Como Executar

## Instalar dependências

```bash
bun install
```

## Executar em desenvolvimento

```bash
bun dev
```

## Build para produção

```bash
bun run build
```

## Preview do build

```bash
bun run preview
```

## Lint

```bash
bun run lint
```

## Formatar código

```bash
bun run format
```

---

# Arquitetura de Estado

O estado do estoque é gerenciado pelo hook `useInventory` que utiliza:

* localStorage para persistência entre sessões
* React Context para acesso global
* Validação em tempo real de saldo
* Contadores automáticos de alertas

## Operações disponíveis

* adicionarProduto
* atualizarProduto
* removerProduto
* registrarMovimentacao
* buscarProdutos
* filtrarPorAlertas

---

# Modelos de Dados

## Produto

```ts
interface Produto {
  id: string;
  nome: string;
  marca: string;
  categoria: string;
  cor: string;
  tamanho: string;
  quantidade: number;
  preco_custo: number;
  preco_venda: number;
  estoque_minimo: number;
  criado_em: string;
}
```

## Movimentação

```ts
interface Movimentacao {
  id: string;
  produto_id: string;
  tipo: 'entrada' | 'saida';
  quantidade: number;
  motivo: string;
  data: string;
}
```

---

# Status de Estoque

* zerado — quantidade === 0
* baixo — quantidade <= estoque_minimo
* ok — quantidade > estoque_minimo

---

# Roadmap

* Autenticação via Lovable Cloud
* Upload de imagens de produtos
* Dashboard de vendas
* CRUD de categorias e marcas
* Código de barras
* Backup automático em nuvem

---

# Licença

Projeto privado — Suprema Multimarcas.

```
```
