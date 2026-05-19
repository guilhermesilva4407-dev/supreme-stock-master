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
