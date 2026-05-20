import { z } from "zod";
import { CATEGORIAS, MOTIVOS, type Movimentacao, type Produto } from "./types";
import { KEYS, STORAGE_EVENT } from "./storage";

const produtoSchema = z.object({
  id: z.string(),
  nome: z.string(),
  marca: z.string(),
  categoria: z.enum(CATEGORIAS),
  cor: z.string(),
  tamanho: z.string(),
  quantidade: z.number().min(0),
  preco_custo: z.number().min(0),
  preco_venda: z.number().min(0),
  estoque_minimo: z.number().min(0),
  criado_em: z.string(),
});

const movimentacaoSchema = z.object({
  id: z.string(),
  produto_id: z.string(),
  produto_nome: z.string(),
  tipo: z.enum(["entrada", "saida"]),
  quantidade: z.number().min(0),
  motivo: z.enum(MOTIVOS),
  data: z.string(),
});

export const backupSchema = z.object({
  app: z.literal("supreme-multimarcas"),
  version: z.number(),
  exported_at: z.string(),
  produtos: z.array(produtoSchema),
  movimentacoes: z.array(movimentacaoSchema),
});

export type Backup = z.infer<typeof backupSchema>;

export function exportBackup() {
  const produtos = JSON.parse(localStorage.getItem(KEYS.produtos) || "[]");
  const movimentacoes = JSON.parse(localStorage.getItem(KEYS.movimentacoes) || "[]");
  const data: Backup = {
    app: "supreme-multimarcas",
    version: 1,
    exported_at: new Date().toISOString(),
    produtos,
    movimentacoes,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const date = new Date().toISOString().slice(0, 10);
  const a = document.createElement("a");
  a.href = url;
  a.download = `supreme-backup-${date}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function parseBackup(text: string): Backup {
  const json = JSON.parse(text);
  return backupSchema.parse(json);
}

export function applyBackup(data: Backup, mode: "substituir" | "mesclar") {
  if (mode === "substituir") {
    localStorage.setItem(KEYS.produtos, JSON.stringify(data.produtos));
    localStorage.setItem(KEYS.movimentacoes, JSON.stringify(data.movimentacoes));
  } else {
    const existingP: Produto[] = JSON.parse(localStorage.getItem(KEYS.produtos) || "[]");
    const existingM: Movimentacao[] = JSON.parse(localStorage.getItem(KEYS.movimentacoes) || "[]");
    const pMap = new Map(existingP.map((p) => [p.id, p]));
    data.produtos.forEach((p) => pMap.set(p.id, p));
    const mMap = new Map(existingM.map((m) => [m.id, m]));
    data.movimentacoes.forEach((m) => mMap.set(m.id, m));
    localStorage.setItem(KEYS.produtos, JSON.stringify(Array.from(pMap.values())));
    localStorage.setItem(KEYS.movimentacoes, JSON.stringify(Array.from(mMap.values())));
  }
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT));
}