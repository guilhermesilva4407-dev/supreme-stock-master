import type { Produto, Movimentacao } from "./types";

export const KEYS = {
  produtos: "supreme:produtos",
  movimentacoes: "supreme:movimentacoes",
  seeded: "supreme:seeded",
};

export const STORAGE_EVENT = "supreme:storage-changed";

export function isBrowser() {
  return typeof window !== "undefined";
}

export function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T) {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT));
}

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export const SEED_PRODUTOS: Produto[] = [
  {
    id: "seed-1",
    nome: "Camiseta Logo Clássica",
    marca: "Nike",
    categoria: "Camisetas",
    cor: "Branco",
    tamanho: "M",
    quantidade: 12,
    preco_custo: 60,
    preco_venda: 129.9,
    estoque_minimo: 4,
    criado_em: new Date().toISOString(),
  },
  {
    id: "seed-2",
    nome: "Moletom Oversized",
    marca: "Off-White",
    categoria: "Moletons",
    cor: "Preto",
    tamanho: "G",
    quantidade: 2,
    preco_custo: 280,
    preco_venda: 549.9,
    estoque_minimo: 3,
    criado_em: new Date().toISOString(),
  },
  {
    id: "seed-3",
    nome: "Boné Box Logo",
    marca: "Supreme",
    categoria: "Bonés",
    cor: "Vermelho",
    tamanho: "Único",
    quantidade: 0,
    preco_custo: 120,
    preco_venda: 259.9,
    estoque_minimo: 2,
    criado_em: new Date().toISOString(),
  },
  {
    id: "seed-4",
    nome: "Calça Cargo Streetwear",
    marca: "Adidas",
    categoria: "Calças",
    cor: "Verde Militar",
    tamanho: "40",
    quantidade: 6,
    preco_custo: 150,
    preco_venda: 299.9,
    estoque_minimo: 3,
    criado_em: new Date().toISOString(),
  },
  {
    id: "seed-5",
    nome: "Tênis Air Force 1",
    marca: "Nike",
    categoria: "Tênis",
    cor: "Branco",
    tamanho: "42",
    quantidade: 4,
    preco_custo: 450,
    preco_venda: 899.9,
    estoque_minimo: 2,
    criado_em: new Date().toISOString(),
  },
  {
    id: "seed-6",
    nome: "Short Tactel Listrado",
    marca: "Adidas",
    categoria: "Shorts",
    cor: "Preto",
    tamanho: "M",
    quantidade: 1,
    preco_custo: 70,
    preco_venda: 149.9,
    estoque_minimo: 3,
    criado_em: new Date().toISOString(),
  },
  {
    id: "seed-7",
    nome: "Camiseta Estampada Skate",
    marca: "Thrasher",
    categoria: "Camisetas",
    cor: "Preto",
    tamanho: "G",
    quantidade: 9,
    preco_custo: 80,
    preco_venda: 169.9,
    estoque_minimo: 4,
    criado_em: new Date().toISOString(),
  },
  {
    id: "seed-8",
    nome: "Pochete Tech",
    marca: "Nike",
    categoria: "Acessórios",
    cor: "Preto",
    tamanho: "Único",
    quantidade: 7,
    preco_custo: 90,
    preco_venda: 199.9,
    estoque_minimo: 3,
    criado_em: new Date().toISOString(),
  },
];

export function ensureSeed() {
  if (!isBrowser()) return;
  if (localStorage.getItem(KEYS.seeded)) return;
  if (!localStorage.getItem(KEYS.produtos)) {
    localStorage.setItem(KEYS.produtos, JSON.stringify(SEED_PRODUTOS));
  }
  if (!localStorage.getItem(KEYS.movimentacoes)) {
    localStorage.setItem(KEYS.movimentacoes, JSON.stringify([] as Movimentacao[]));
  }
  localStorage.setItem(KEYS.seeded, "1");
}