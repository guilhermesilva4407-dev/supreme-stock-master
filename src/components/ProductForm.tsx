import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CATEGORIAS, TAMANHOS, type Categoria, type Produto } from "@/lib/types";

const schema = z.object({
  nome: z.string().trim().min(1, "Nome obrigatório").max(100),
  marca: z.string().trim().min(1, "Marca obrigatória").max(60),
  categoria: z.enum(CATEGORIAS),
  cor: z.string().trim().min(1, "Cor obrigatória").max(40),
  tamanho: z.string().min(1, "Tamanho obrigatório"),
  quantidade: z.number().int().min(0),
  preco_custo: z.number().min(0),
  preco_venda: z.number().min(0),
  estoque_minimo: z.number().int().min(0),
});
type FormState = z.input<typeof schema>;
const empty: FormState = {
  nome: "", marca: "", categoria: "Camisetas", cor: "", tamanho: "M",
  quantidade: 0, preco_custo: 0, preco_venda: 0, estoque_minimo: 1,
};

export function ProductForm({
  initial, onSubmit, submitLabel = "Salvar", onCancel,
}: {
  initial?: Produto;
  onSubmit: (data: Omit<Produto, "id" | "criado_em">) => void;
  submitLabel?: string;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<FormState>(empty);
  useEffect(() => {
    if (initial) {
      const { id: _i, criado_em: _c, ...rest } = initial;
      setForm(rest);
    }
  }, [initial]);
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));
  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) { toast.error(r.error.issues[0]?.message || "Dados inválidos"); return; }
    onSubmit(r.data);
    if (!initial) setForm(empty);
  };
  return (
    <form onSubmit={handle} className="grid gap-3">
      <div className="grid gap-1.5">
        <Label>Nome</Label>
        <Input value={form.nome} onChange={(e) => set("nome", e.target.value)} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="grid gap-1.5">
          <Label>Marca</Label>
          <Input value={form.marca} onChange={(e) => set("marca", e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label>Categoria</Label>
          <Select value={form.categoria} onValueChange={(v) => set("categoria", v as Categoria)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIAS.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="grid gap-1.5">
          <Label>Cor</Label>
          <Input value={form.cor} onChange={(e) => set("cor", e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label>Tamanho</Label>
          <Select value={form.tamanho} onValueChange={(v) => set("tamanho", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {TAMANHOS.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="grid gap-1.5">
          <Label>Quantidade</Label>
          <Input type="number" min={0} value={form.quantidade}
            onChange={(e) => set("quantidade", parseInt(e.target.value) || 0)} />
        </div>
        <div className="grid gap-1.5">
          <Label>Estoque mínimo</Label>
          <Input type="number" min={0} value={form.estoque_minimo}
            onChange={(e) => set("estoque_minimo", parseInt(e.target.value) || 0)} />
        </div>
        <div className="grid gap-1.5">
          <Label>Preço custo (R$)</Label>
          <Input type="number" min={0} step="0.01" value={form.preco_custo}
            onChange={(e) => set("preco_custo", parseFloat(e.target.value) || 0)} />
        </div>
      </div>
      <div className="grid gap-1.5 md:max-w-[33%]">
        <Label>Preço venda (R$)</Label>
        <Input type="number" min={0} step="0.01" value={form.preco_venda}
          onChange={(e) => set("preco_venda", parseFloat(e.target.value) || 0)} />
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        <Button type="submit">{submitLabel}</Button>
        {onCancel && (<Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>)}
      </div>
    </form>
  );
}
