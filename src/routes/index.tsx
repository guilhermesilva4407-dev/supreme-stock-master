import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Boxes, DollarSign, Package, TrendingUp } from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStockStatus } from "@/lib/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Supreme Multimarcas" },
      { name: "description", content: "Métricas e alertas do estoque da Supreme Multimarcas." },
    ],
  }),
  component: Dashboard,
});

function brl(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function Dashboard() {
  const { produtos, ready } = useInventory();

  if (!ready) return <p className="text-muted-foreground">Carregando...</p>;

  const totalUnidades = produtos.reduce((s, p) => s + p.quantidade, 0);
  const totalProdutos = produtos.length;
  const valorEstoque = produtos.reduce((s, p) => s + p.quantidade * p.preco_custo, 0);
  const margem = produtos.reduce(
    (s, p) => s + p.quantidade * (p.preco_venda - p.preco_custo),
    0,
  );
  const alertas = produtos.filter((p) => p.quantidade <= p.estoque_minimo);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-4xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Resumo do estoque hoje</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Unidades" value={String(totalUnidades)} icon={Boxes} />
        <MetricCard label="Produtos" value={String(totalProdutos)} icon={Package} />
        <MetricCard label="Valor estoque" value={brl(valorEstoque)} icon={DollarSign} />
        <MetricCard label="Margem potencial" value={brl(margem)} icon={TrendingUp} accent />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-2xl">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Alertas de estoque
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alertas.length === 0 ? (
            <p className="text-sm text-muted-foreground">Tudo em ordem. Nenhum alerta.</p>
          ) : (
            <ul className="grid gap-2">
              {alertas.map((p) => {
                const status = getStockStatus(p);
                return (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-3 rounded-md border border-border bg-secondary/40 p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{p.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.marca} · {p.tamanho} · {p.cor}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase text-primary-foreground ${
                        status === "zerado" ? "bg-primary" : "bg-warning"
                      }`}
                    >
                      {status === "zerado" ? "Zerado" : `Baixo · ${p.quantidade}`}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="mt-3">
            <Link to="/produtos" className="text-sm font-semibold text-primary hover:underline">
              Ver todos os produtos →
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
