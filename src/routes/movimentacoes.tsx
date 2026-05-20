import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MOTIVO_LABEL } from "@/lib/types";

export const Route = createFileRoute("/movimentacoes")({
  head: () => ({
    meta: [
      { title: "Movimentações — Supreme Multimarcas" },
      { name: "description", content: "Histórico de entradas e saídas de estoque." },
    ],
  }),
  component: MovimentacoesPage,
});

function MovimentacoesPage() {
  const { movimentacoes, ready } = useInventory();

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="font-display text-4xl">Movimentações</h1>
        <p className="text-sm text-muted-foreground">
          {ready ? `${movimentacoes.length} registros` : "Carregando..."}
        </p>
      </div>
      <div className="overflow-x-auto rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead className="text-center">Tipo</TableHead>
              <TableHead className="text-right">Qtd</TableHead>
              <TableHead>Motivo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movimentacoes.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  {new Date(m.data).toLocaleString("pt-BR")}
                </TableCell>
                <TableCell className="font-medium">{m.produto_nome}</TableCell>
                <TableCell className="text-center">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase text-primary-foreground ${
                      m.tipo === "entrada" ? "bg-success" : "bg-primary"
                    }`}
                  >
                    {m.tipo === "entrada" ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {m.tipo}
                  </span>
                </TableCell>
                <TableCell className="text-right font-display text-lg">{m.quantidade}</TableCell>
                <TableCell>{MOTIVO_LABEL[m.motivo]}</TableCell>
              </TableRow>
            ))}
            {ready && movimentacoes.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  Nenhuma movimentação registrada ainda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}