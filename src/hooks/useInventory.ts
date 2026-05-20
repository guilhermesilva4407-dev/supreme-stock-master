import { useCallback, useEffect, useState } from "react";
import {
  KEYS,
  STORAGE_EVENT,
  ensureSeed,
  isBrowser,
  readJSON,
  uid,
  writeJSON,
} from "@/lib/storage";
import type { Movimentacao, Motivo, Produto } from "@/lib/types";

export function useInventory() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [ready, setReady] = useState(false);

  const load = useCallback(() => {
    setProdutos(readJSON<Produto[]>(KEYS.produtos, []));
    setMovimentacoes(readJSON<Movimentacao[]>(KEYS.movimentacoes, []));
  }, []);

  useEffect(() => {
    if (!isBrowser()) return;
    ensureSeed();
    load();
    setReady(true);
    const handler = () => load();
    window.addEventListener(STORAGE_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(STORAGE_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, [load]);

  const saveProdutos = (next: Produto[]) => {
    writeJSON(KEYS.produtos, next);
    setProdutos(next);
  };
  const saveMovs = (next: Movimentacao[]) => {
    writeJSON(KEYS.movimentacoes, next);
    setMovimentacoes(next);
  };

  const createProduto = (data: Omit<Produto, "id" | "criado_em">) => {
    const novo: Produto = { ...data, id: uid(), criado_em: new Date().toISOString() };
    saveProdutos([novo, ...produtos]);
    return novo;
  };

  const updateProduto = (id: string, patch: Partial<Produto>) => {
    saveProdutos(produtos.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const deleteProduto = (id: string) => {
    saveProdutos(produtos.filter((p) => p.id !== id));
  };

  const registrarMovimentacao = (input: {
    produto_id: string;
    tipo: "entrada" | "saida";
    quantidade: number;
    motivo: Motivo;
  }) => {
    const produto = produtos.find((p) => p.id === input.produto_id);
    if (!produto) throw new Error("Produto não encontrado");
    if (input.tipo === "saida" && input.quantidade > produto.quantidade) {
      throw new Error("Quantidade maior que o estoque disponível");
    }
    const novaQtd =
      input.tipo === "entrada"
        ? produto.quantidade + input.quantidade
        : produto.quantidade - input.quantidade;
    const updated = produtos.map((p) =>
      p.id === produto.id ? { ...p, quantidade: novaQtd } : p,
    );
    const mov: Movimentacao = {
      id: uid(),
      produto_id: produto.id,
      produto_nome: produto.nome,
      tipo: input.tipo,
      quantidade: input.quantidade,
      motivo: input.motivo,
      data: new Date().toISOString(),
    };
    saveProdutos(updated);
    saveMovs([mov, ...movimentacoes]);
  };

  return {
    ready,
    produtos,
    movimentacoes,
    createProduto,
    updateProduto,
    deleteProduto,
    registrarMovimentacao,
    reload: load,
  };
}

export function useAlertCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isBrowser()) return;
    const compute = () => {
      ensureSeed();
      const list = readJSON<Produto[]>(KEYS.produtos, []);
      setCount(list.filter((p) => p.quantidade <= p.estoque_minimo).length);
    };
    compute();
    const handler = () => compute();
    window.addEventListener(STORAGE_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(STORAGE_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return count;
}