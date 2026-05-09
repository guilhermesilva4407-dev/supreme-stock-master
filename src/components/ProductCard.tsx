import { useState } from "react";
import { ArrowLeftRight, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ProductForm } from "./ProductForm";
import { MovementDialog } from "./MovementDialog";
import { getStockStatus, type Motivo, type Produto } from "@/lib/types";

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
  const [movOpen, setMovOpen] = useState(false);
  const status = getStockStatus(produto);
  const alerta = status !== "ok";
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
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => setMovOpen(true)} className="flex-1">
            <ArrowLeftRight className="mr-1.5 h-4 w-4" /> Movimentar
          </Button>
          <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline"><Trash2 className="h-4 w-4" /></Button>
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
      <MovementDialog
        produto={produto}
        open={movOpen}
        onOpenChange={setMovOpen}
        onSubmit={(d) => onMove({ produto_id: produto.id, ...d })}
      />
    </Card>
  );
}
