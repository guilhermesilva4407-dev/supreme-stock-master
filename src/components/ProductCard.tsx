import { useState } from "react";
import { ArrowRight, Pencil, ShoppingBag, Trash2, Zap } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ProductForm } from "./ProductForm";
import { getStockStatus, type Motivo, type Produto } from "@/lib/types";

const statusStyles = {
  ok: "border-[oklch(0.7_0.18_145)]/50 bg-[oklch(0.7_0.18_145)]/15 text-[oklch(0.78_0.18_145)]",
  baixo: "border-yellow-500/50 bg-yellow-500/10 text-yellow-400",
  zerado: "border-red-500/50 bg-red-950/40 text-red-400",
} as const;
const statusLabel = { ok: "Em estoque", baixo: "Baixo", zerado: "Zerado" } as const;

export function ProductCard({
  produto, onUpdate, onDelete, onMove,
}: {
  produto: Produto;
  onUpdate: (id: string, patch: Partial<Produto>) => void;
  onDelete: (id: string) => void;
  onMove: (i: { produto_id: string; tipo: "entrada" | "saida"; quantidade: number; motivo: Motivo }) => void;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [tipo, setTipo] = useState<"entrada" | "saida">("saida");
  const [qty, setQty] = useState(1);
  const status = getStockStatus(produto);

  const handleQuick = () => {
    if (qty <= 0) {
      toast.error("Quantidade deve ser maior que zero");
      return;
    }
    const motivo: Motivo = tipo === "entrada" ? "fornecedor" : "venda";
    try {
      onMove({ produto_id: produto.id, tipo, quantidade: qty, motivo });
      toast.success(`${tipo === "entrada" ? "Entrada" : "Saída"} de ${qty} un. registrada`);
      setQty(1);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const handleSellOne = () => {
    if (produto.quantidade < 1) {
      toast.error("Produto sem estoque");
      return;
    }
    try {
      onMove({ produto_id: produto.id, tipo: "saida", quantidade: 1, motivo: "venda" });
      toast.success(`Venda registrada · ${produto.nome}`, {
        description: `1 un. · R$${produto.preco_venda.toFixed(2)}`,
      });
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="group relative overflow-hidden border border-primary/30 bg-black transition-all hover:border-primary/60">
      {/* HUD corner accents */}
      <span className="pointer-events-none absolute left-0 top-0 h-2 w-2 border-l-2 border-t-2 border-primary" />
      <span className="pointer-events-none absolute right-0 top-0 h-2 w-2 border-r-2 border-t-2 border-primary" />

      {/* Top header */}
      <div className="flex items-start justify-between gap-3 border-b border-primary/10 px-4 pb-2 pt-4">
        <div className="min-w-0 flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            {produto.marca} · {produto.categoria}
          </span>
          <h3 className="mt-1 truncate font-display text-2xl uppercase leading-none tracking-wide text-foreground">
            {produto.nome}
          </h3>
        </div>
        <span
          className={`shrink-0 rounded-sm border px-2 py-1 text-[10px] font-bold uppercase italic tracking-tighter ${statusStyles[status]}`}
        >
          {statusLabel[status]}
        </span>
      </div>

      {/* Specs + metrics */}
      <div className="bg-gradient-to-b from-white/[0.04] to-transparent px-4 py-3">
        <p className="mb-3 text-[11px] text-muted-foreground">
          {produto.cor} · Tam. {produto.tamanho}
        </p>
        <div className="grid grid-cols-3 gap-[1px] rounded-sm border border-primary/20 bg-primary/10">
          <Metric label="Qtd" value={String(produto.quantidade)} />
          <Metric
            label="Custo"
            value={`R$${produto.preco_custo.toFixed(0)}`}
            divider
          />
          <Metric label="Venda" value={`R$${produto.preco_venda.toFixed(0)}`} accent />
        </div>
      </div>

      {/* Primary action */}
      <div className="px-4 pb-3">
        <button
          type="button"
          onClick={handleSellOne}
          disabled={produto.quantidade < 1}
          className="group/btn flex w-full items-center justify-center gap-2 rounded-xs bg-primary py-3 font-display text-xl tracking-wider text-primary-foreground transition-colors hover:bg-[oklch(0.88_0.13_85)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Vender 1 Unidade</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>

      {/* Quick adjustment tray */}
      <div className="mx-4 mb-4 flex items-center gap-2 rounded-sm border border-white/10 bg-white/5 p-2">
        <Input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(parseInt(e.target.value) || 0)}
          className="h-8 w-12 border border-white/20 bg-black p-0 text-center font-display text-lg text-foreground focus-visible:border-primary focus-visible:ring-0"
          aria-label="Quantidade"
        />
        <div className="flex flex-1 gap-1">
          <button
            type="button"
            onClick={() => setTipo("saida")}
            className={`flex-1 border px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              tipo === "saida"
                ? "border-primary/60 bg-primary/15 text-primary"
                : "border-white/10 text-muted-foreground hover:border-white/30"
            }`}
          >
            Saída
          </button>
          <button
            type="button"
            onClick={() => setTipo("entrada")}
            className={`flex-1 border px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              tipo === "entrada"
                ? "border-primary/60 bg-primary/15 text-primary"
                : "border-white/10 text-muted-foreground hover:border-white/30"
            }`}
          >
            Entrada
          </button>
        </div>
        <button
          type="button"
          onClick={handleQuick}
          className="border border-primary/40 bg-primary/20 p-2 text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          aria-label="Registrar movimentação"
        >
          <Zap className="h-4 w-4" />
        </button>
      </div>

      {/* Management footer */}
      <div className="flex border-t border-primary/20">
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className="flex flex-1 items-center justify-center gap-2 border-r border-primary/10 py-3 transition-colors hover:bg-white/5"
        >
          <Pencil className="h-4 w-4 text-muted-foreground" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Editar
          </span>
        </button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              className="group/del flex flex-1 items-center justify-center gap-2 py-3 transition-colors hover:bg-red-900/20"
            >
              <Trash2 className="h-4 w-4 text-muted-foreground transition-colors group-hover/del:text-red-500" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors group-hover/del:text-red-500">
                Excluir
              </span>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. {produto.nome} será removido.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  onDelete(produto.id);
                  toast.success("Produto excluído");
                }}
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Bottom scanline */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-primary/50 shadow-[0_0_10px_var(--primary)]" />

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Editar produto</DialogTitle></DialogHeader>
          <ProductForm
            initial={produto}
            submitLabel="Salvar alterações"
            onCancel={() => setEditOpen(false)}
            onSubmit={(data) => { onUpdate(produto.id, data); toast.success("Produto atualizado"); setEditOpen(false); }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Metric({
  label,
  value,
  divider,
  accent,
}: {
  label: string;
  value: string;
  divider?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={`bg-black p-2 text-center ${
        divider ? "border-x border-primary/20" : ""
      }`}
    >
      <p className="text-[10px] font-bold uppercase tracking-tight text-primary/60">
        {label}
      </p>
      <p
        className={`font-display text-lg leading-none ${
          accent ? "text-[oklch(0.88_0.13_85)]" : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
