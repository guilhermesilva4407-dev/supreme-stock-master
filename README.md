Supreme Multimarcas
Link do Site: https://stock-swagger-flow.lovable.app

Sistema de gerenciamento de estoque para lojas multimarcas de streetwear, desenvolvido com foco em performance, controle visual e experiência premium.

O projeto utiliza uma identidade visual Cyber-Luxe HUD, combinando interface escura, detalhes dourados e tipografia moderna para transmitir sofisticação e controle total sobre o inventário.

Painel da Loja
Dashboard com métricas inteligentes e monitoramento em tempo real do estoque.

Funcionalidades do Dashboard
Métricas em tempo real:

Estoque total
SKUs ativos
Valor em ativos
Margem potencial
Alertas automáticos:

Produtos zerados
Estoque baixo
Indicador de ocupação do estoque

Badge de "Loja Aberta" com status ativo

Interface responsiva e moderna

Catálogo de Produtos
Gerenciamento completo do inventário.

Recursos
Busca e Filtros
Busca textual por nome
Filtro por categoria
Filtro por marca
Categorias disponíveis
Camisetas
Moletons
Calças
Shorts
Tênis
Bonés
Acessórios
Ordenação
Alertas primeiro
Menor estoque
Maior estoque
Nome A–Z
Mais recentes
Alertas Inteligentes
Filtro rápido "Somente alertas"
Badge clicável de produtos críticos
Movimentação de Estoque
Sistema rápido e intuitivo para entradas e saídas.

Funcionalidades
Formulário inline no próprio card do produto
Sem uso de modais
Alternância entre:
Entrada
Saída
Cadastro de Produtos
Formulário completo para adicionar novos itens ao estoque.

Campos
Nome do produto
Marca
Categoria
Cor
Tamanho
Quantidade inicial
Preço de custo
Preço de venda
Estoque mínimo
Histórico de Movimentações
Registro completo de todas as entradas e saídas do estoque.

Informações exibidas
Produto
Tipo (Entrada/Saída)
Quantidade
Motivo
Data
Backup em JSON
Exportação e importação do estado completo do estoque.

Funcionalidades
Download do backup em formato JSON
Importação de arquivo JSON
Preservação completa dos dados
Tecnologias
Tecnologia	Versão	Finalidade
TanStack Start	v1	Framework full-stack
React	19	UI
TypeScript	5.8	Tipagem
Tailwind CSS	v4	Estilos
shadcn/ui	latest	Componentes base
TanStack Query	v5	Estado assíncrono
TanStack Router	v1	Roteamento
Recharts	v2	Gráficos
Lucide React	v0.575	Ícones
Zod	v3	Validação
Design System
Identidade Visual
Paleta: Gold Noir — preto profundo com dourado como cor de destaque
Tipografia: Space Grotesk (títulos) + DM Sans (corpo)
Layout: Bento Grid com cards arredondados e bordas sutis
Estilo: HUD cyber-luxe, minimalista e sofisticado
Tokens Principais
--background: oklch(0.08 0.01 260);      /* Fundo escuro */
--foreground: oklch(0.95 0.01 260);       /* Texto claro */
--primary: oklch(0.75 0.15 85);           /* Dourado */
--accent: oklch(0.65 0.12 300);           /* Roxo sutil */
--muted: oklch(0.2 0.02 260);             /* Superfície */
--border: oklch(0.2 0.01 260 / 0.5);      /* Borda sutil */
Estrutura de Pastas
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes shadcn/ui
│   ├── ProductCard.tsx
│   ├── ProductForm.tsx
│   ├── Filters.tsx
│   ├── MetricCard.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── BottomNav.tsx
│   ├── BackupSection.tsx
│   └── MovementDialog.tsx
├── routes/             # Rotas da aplicação
│   ├── index.tsx       # Dashboard
│   ├── produtos.tsx    # Catálogo
│   ├── cadastrar.tsx   # Cadastro
│   ├── movimentacoes.tsx # Histórico
│   └── __root.tsx      # Layout base
├── hooks/              # Hooks customizados
│   ├── useInventory.ts # Estado global do estoque
│   └── use-mobile.tsx  # Detecção mobile
├── lib/                # Utilitários
│   ├── types.ts        # Tipos TypeScript
│   ├── utils.ts        # Funções utilitárias
│   ├── storage.ts      # Persistência localStorage
│   ├── backup.ts       # Lógica de backup JSON
│   ├── error-page.ts   # Página de erro
│   └── error-capture.ts # Captura de erros
├── styles.css           # Estilos globais e tokens
├── router.tsx           # Configuração do roteador
└── start.ts             # Configuração do servidor
Como Executar
# Instalar dependências
bun install

# Executar em desenvolvimento
bun dev

# Build para produção
bun run build

# Preview do build
bun run preview

# Lint
bun run lint

# Formatar código
bun run format
Arquitetura de Estado
O estado do estoque é gerenciado pelo hook useInventory que utiliza:

localStorage para persistência entre sessões
React Context para acesso global
Validação em tempo real de saldo (não permite saída maior que o estoque)
Contadores automáticos de alertas (zerados e baixo estoque)
Operações disponíveis
adicionarProduto — Cadastro de novo item
atualizarProduto — Edição de produto existente
removerProduto — Exclusão do estoque
registrarMovimentacao — Entrada ou saída com motivo
buscarProdutos — Busca textual com filtros
filtrarPorAlertas — Filtro rápido de produtos críticos
Modelos de Dados
Produto
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
  criado_em: string; // ISO date
}
Movimentação
interface Movimentacao {
  id: string;
  produto_id: string;
  tipo: 'entrada' | 'saida';
  quantidade: number;
  motivo: string;
  data: string; // ISO date
}
Status de Estoque
zerado — quantidade === 0
baixo — quantidade <= estoque_minimo
ok — quantidade > estoque_minimo
Roadmap
 Autenticação — Login com Lovable Cloud
 Imagens de produtos — Upload e visualização
 Gráficos de vendas — Análise temporal
 Categorias e marcas editáveis — CRUD completo
 Código de barras — Geração e leitura
 Backup automático — Cloud sync
Projeto privado — Suprema Multimarcas.
