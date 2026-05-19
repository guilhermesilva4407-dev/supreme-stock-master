import { useState } from "react";
import { Minus, Pencil, Plus, Trash2, Zap } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ProductForm } from "./ProductForm";
import { MOTIVOS, MOTIVO_LABEL, getStockStatus, type Motivo, type Produto } from "@/lib/types";

const statusStyles = { ok: "bg-success", baixo: "bg-warning", zerado: "bg-primary" } as const;
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
  const [motivo, setMotivo] = useState<Motivo>("venda");
  const status = getStockStatus(produto);
  const alerta = status !== "ok";

  const handleQuick = () => {
    if (qty <= 0) {
      toast.error("Quantidade deve ser maior que zero");
      return;
    }
    try {
      onMove({ produto_id: produto.id, tipo, quantidade: qty, motivo });
      toast.success(`${tipo === "entrada" ? "Entrada" : "Saída"} de ${qty} un. registrada`);
      setQty(1);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <Card className={alerta ? "border-primary" : undefined}>
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{produto.marca} · {produto.categoria}</p>
            <h3 className="truncate font-display text-xl">{produto.nome}</h3>
            <p className="text-xs text-muted-foreground">{produto.cor} · Tam. {produto.tamanho}</p>
          </div>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${statusStyles[status]} text-primary-foreground`}>
            {statusLabel[status]}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-md bg-secondary p-2">
            <p className="text-[10px] uppercase text-muted-foreground">Qtd</p>
            <p className="font-display text-lg">{produto.quantidade}</p>
          </div>
          <div className="rounded-md bg-secondary p-2">
            <p className="text-[10px] uppercase text-muted-foreground">Custo</p>
            <p className="font-display text-lg">R${produto.preco_custo.toFixed(0)}</p>
          </div>
          <div className="rounded-md bg-secondary p-2">
            <p className="text-[10px] uppercase text-muted-foreground">Venda</p>
            <p className="font-display text-lg">R${produto.preco_venda.toFixed(0)}</p>
          </div>
        </div>
        {/* Quick movement form */}
        <div className="rounded-md border border-primary/20 bg-secondary/40 p-2">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70">
              Movimentação rápida
            </span>
            <div className="flex overflow-hidden rounded-md border border-primary/30">
              <button
                type="button"
                onClick={() => setTipo("saida")}
                className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  tipo === "saida"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Minus className="h-3 w-3" /> Saída
              </button>
              <button
                type="button"
                onClick={() => setTipo("entrada")}
                className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  tipo === "entrada"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Plus className="h-3 w-3" /> Entrada
              </button>
            </div>
          </div>
          <div className="flex gap-1.5">
            <Input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value) || 0)}
              className="h-8 w-16 text-center"
              aria-label="Quantidade"
            />
            <Select value={motivo} onValueChange={(v) => setMotivo(v as Motivo)}>
              <SelectTrigger className="h-8 flex-1 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MOTIVOS.map((m) => (
                  <SelectItem key={m} value={m}>{MOTIVO_LABEL[m]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={handleQuick} className="h-8 px-3">
              <Zap className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setEditOpen(true)} className="flex-1">
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline" className="flex-1"><Trash2 className="h-4 w-4" /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
                <AlertDialogDescription>Esta ação não pode ser desfeita. {produto.nome} será removido.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => { onDelete(produto.id); toast.success("Produto excluído"); }}>Excluir</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
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
    </Card>
  );
}
