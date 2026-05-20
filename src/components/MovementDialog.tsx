import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOTIVOS, MOTIVO_LABEL, type Motivo, type Produto } from "@/lib/types";

export function MovementDialog({
  produto,
  open,
  onOpenChange,
  onSubmit,
}: {
  produto: Produto | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (data: { tipo: "entrada" | "saida"; quantidade: number; motivo: Motivo }) => void;
}) {
  const [tipo, setTipo] = useState<"entrada" | "saida">("saida");
  const [quantidade, setQuantidade] = useState(1);
  const [motivo, setMotivo] = useState<Motivo>("venda");

  const handle = () => {
    if (!produto) return;
    if (quantidade <= 0) {
      toast.error("Quantidade deve ser maior que zero");
      return;
    }
    try {
      onSubmit({ tipo, quantidade, motivo });
      toast.success("Movimentação registrada");
      onOpenChange(false);
      setQuantidade(1);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Movimentar estoque</DialogTitle>
          <DialogDescription>
            {produto ? `${produto.nome} · ${produto.quantidade} em estoque` : ""}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label>Tipo</Label>
            <Select value={tipo} onValueChange={(v) => setTipo(v as "entrada" | "saida")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="saida">Saída</SelectItem>
                <SelectItem value="entrada">Entrada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Quantidade</Label>
            <Input
              type="number"
              min={1}
              value={quantidade}
              onChange={(e) => setQuantidade(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Motivo</Label>
            <Select value={motivo} onValueChange={(v) => setMotivo(v as Motivo)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {MOTIVOS.map((m) => (
                  <SelectItem key={m} value={m}>{MOTIVO_LABEL[m]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handle}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
