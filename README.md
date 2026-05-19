# Suprema Multimarcas

Sistema de gerenciamento de estoque para lojas multimarcas de streetwear, desenvolvido com foco em performance, controle visual e experiência premium.

O projeto utiliza uma identidade visual **Cyber-Luxe HUD**, combinando interface escura, detalhes dourados e tipografia moderna para transmitir sofisticação e controle total sobre o inventário.

---

# Painel da Loja

Dashboard com métricas inteligentes e monitoramento em tempo real do estoque.

## Funcionalidades do Dashboard

* Métricas em tempo real:

  * Estoque total
  * SKUs ativos
  * Valor em ativos
  * Margem potencial

* Alertas automáticos:

  * Produtos zerados
  * Estoque baixo

* Indicador de ocupação do estoque

* Badge de “Loja Aberta” com status ativo

* Interface responsiva e moderna

---

# Catálogo de Produtos

Gerenciamento completo do inventário.

## Recursos

### Busca e Filtros

* Busca textual por nome
* Filtro por categoria
* Filtro por marca

### Categorias disponíveis

* Camisetas
* Moletons
* Calças
* Shorts
* Tênis
* Bonés
* Acessórios

### Ordenação

* Alertas primeiro
* Menor estoque
* Maior estoque
* Nome A–Z
* Mais recentes

### Alertas Inteligentes

* Filtro rápido “Somente alertas”
* Badge clicável de produtos críticos

---

# Movimentação de Estoque

Sistema rápido e intuitivo para entradas e saídas.

## Funcionalidades

* Formulário inline no próprio card do produto
* Sem uso de modais
* Alternância entre:

  * Entrada
  * Saída

### Motivos disponíveis

* Venda

* Devolução

* Perda

* Fornecedor

* Atualização instantânea do estoque

* Histórico completo de movimentações

---

# Cadastro de Produtos

Formulário completo para criação de novos itens.

## Campos disponíveis

* Nome
* Marca
* Categoria
* Cor
* Tamanho
* Quantidade
* Preço de custo
* Preço de venda
* Estoque mínimo

---

# Histórico de Movimentações

Registro detalhado de todas as operações.

## Informações registradas

* Produto
* Tipo da movimentação
* Quantidade
* Motivo
* Data e horário

---

# Backup e Segurança

## Recursos

* Exportação de dados em JSON
* Importação de backup
* Persistência local via localStorage

---

# Tecnologias Utilizadas

| Tecnologia      | Versão | Finalidade           |
| --------------- | ------ | -------------------- |
| TanStack Start  | v1     | Framework Full Stack |
| React           | 19     | Interface do usuário |
| TypeScript      | 5.8    | Tipagem estática     |
| Tailwind CSS    | v4     | Estilização          |
| shadcn/ui       | —      | Componentes UI       |
| TanStack Query  | v5     | Cache e estado       |
| TanStack Router | v1     | Rotas type-safe      |
| Recharts        | v2     | Gráficos             |
| Lucide React    | v0.575 | Ícones               |
| Zod             | v3     | Validação            |

---

# Sistema de Design

## Identidade Visual

* Tema: Gold Noir
* Interface escura com acentos dourados
* Estética Cyber-Luxe HUD

## Tipografia

* Space Grotesk
* DM Sans

## Layout

* Bento Grid responsivo
* Cartões assimétricos
* Bordas suaves
* Glow dourado

---

# Estrutura do Projeto

```bash
src/
├── components/
├── routes/
├── hooks/
├── lib/
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

## Rodar ambiente de desenvolvimento

```bash
bun dev
```

## Build de produção

```bash
bun run build
```

## Preview da build

```bash
bun run preview
```

## Lint

```bash
bun run lint
```

## Formatação

```bash
bun run format
```

O projeto roda em:

```bash
http://localhost:3000
```

---

# Arquitetura de Estado

O gerenciamento de estoque é feito através de um hook customizado:

```ts
useInventory
```

## Responsabilidades

* CRUD de produtos
* Controle de estoque
* Histórico de movimentações
* Persistência local
* Métricas derivadas
* Sistema de alertas

---

# Modelo de Dados

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
  produto_nome: string;
  tipo: "entrada" | "saida";
  quantidade: number;
  motivo: string;
  data: string;
}
```

---

# Status de Estoque

| Status | Condição                     |
| ------ | ---------------------------- |
| Zerado | quantidade === 0             |
| Baixo  | quantidade <= estoque_minimo |
| OK     | quantidade > estoque_minimo  |

---

# Roadmap

* Dashboard avançado de vendas
* Login/autenticação
* Upload de imagens
* Relatórios inteligentes
* Gráficos semanais e mensais
* Categorias editáveis
* Scanner de código de barras
* Backup em nuvem
* Integração com ERP
* Multiusuário

---

# Licença

Projeto privado — Suprema Multimarcas.
