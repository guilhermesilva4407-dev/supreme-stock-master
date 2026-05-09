export const CATEGORIAS = [
  "Camisetas",
  "Moletons",
  "Calças",
  "Shorts",
  "Tênis",
  "Bonés",
  "Acessórios",
] as const;
export type Categoria = (typeof CATEGORIAS)[number];

export const TAMANHOS = [
  "PP",
  "P",
  "M",
  "G",
  "GG",
  "XGG",
  "36",
  "38",
  "40",
  "42",
  "44",
  "Único",
] as const;

export const MOTIVOS = ["venda", "devolucao", "perda", "fornecedor"] as const;
export type Motivo = (typeof MOTIVOS)[number];

export const MOTIVO_LABEL: Record<Motivo, string> = {
  venda: "Venda",
  devolucao: "Devolução",
  perda: "Perda",
  fornecedor: "Entrada de fornecedor",
};

export interface Produto {
  id: string;
  nome: string;
  marca: string;
  categoria: Categoria;
  cor: string;
  tamanho: string;
  quantidade: number;
  preco_custo: number;
  preco_venda: number;
  estoque_minimo: number;
  criado_em: string;
}

export interface Movimentacao {
  id: string;
  produto_id: string;
  produto_nome: string;
  tipo: "entrada" | "saida";
  quantidade: number;
  motivo: Motivo;
  data: string;
}

export type StockStatus = "ok" | "baixo" | "zerado";

export function getStockStatus(p: Produto): StockStatus {
  if (p.quantidade === 0) return "zerado";
  if (p.quantidade <= p.estoque_minimo) return "baixo";
  return "ok";
}