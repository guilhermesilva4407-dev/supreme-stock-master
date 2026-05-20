import { createFileRoute, Link } from "@tanstack/react-router";
import { Boxes, Package, TrendingUp } from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import { MetricCard } from "@/components/MetricCard";
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
  const capacidade = produtos.reduce((s, p) => s + Math.max(p.estoque_minimo * 3, 10), 0);
  const ocupacao = capacidade > 0 ? (totalUnidades / capacidade) * 100 : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col gap-3 border-b border-primary/20 pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-tight text-[oklch(0.88_0.13_85)] md:text-5xl">
            Painel da Loja
          </h1>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.25em] text-primary/60">
            Supreme Multimarcas · Visão geral do estoque
          </p>
        </div>
        <div className="flex items-center gap-2 self-start rounded-full border border-primary/30 bg-card px-4 py-2 md:self-auto">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.88_0.13_85)] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[oklch(0.88_0.13_85)] shadow-[0_0_8px_oklch(0.88_0.13_85)]" />
          </span>
          <span className="text-[10px] font-bold uppercase italic tracking-tight text-[oklch(0.88_0.13_85)]">
            Loja Aberta
          </span>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-6">
        <div className="md:col-span-2">
          <MetricCard
            label="Estoque Total"
            value={String(totalUnidades).padStart(2, "0")}
            suffix="UN"
            icon={Boxes}
            progress={ocupacao}
          />
        </div>
        <div className="md:col-span-2">
          <MetricCard
            label="Categorias Ativas"
            value={String(totalProdutos).padStart(2, "0")}
            suffix="SKUs"
            icon={Package}
          />
        </div>

        {/* Featured Gold Card */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-lg bg-gradient-to-br from-primary to-[oklch(0.82_0.13_82)] p-6 text-primary-foreground shadow-[0_0_40px_-10px_oklch(0.74_0.13_78/0.5)] md:col-span-2 lg:row-span-2">
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
              backgroundSize: "10px 10px",
            }}
          />
          <div className="relative">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">
              Valor em Ativos
            </span>
            <div className="mt-2">
              <span className="text-xs font-bold">BRL</span>
              <div className="mt-1 font-display text-4xl italic leading-none lg:text-5xl">
                {valorEstoque.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
          <div className="relative mt-8 flex items-end justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase opacity-60">Margem Potencial</div>
              <div className="font-display text-xl">{brl(margem)}</div>
            </div>
            <div className="rounded-sm bg-background p-2">
              <TrendingUp className="h-6 w-6 text-[oklch(0.88_0.13_85)]" />
            </div>
          </div>
        </div>

        {/* Alerts wide block */}
        <div className="hud-card relative overflow-hidden p-6 md:col-span-4">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1 bg-[oklch(0.88_0.13_85)]" />
              <h3 className="font-display text-lg uppercase tracking-tight">
                Alertas de Ruptura
              </h3>
            </div>
            <span className="rounded border border-primary/40 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
              {alertas.length > 0 ? "Crítico" : "Estável"}
            </span>
          </div>

          {alertas.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Tudo em ordem. Nenhum alerta no momento.
            </p>
          ) : (
            <ul className="space-y-2">
              {alertas.map((p) => {
                const status = getStockStatus(p);
                const isZero = status === "zerado";
                return (
                  <li
                    key={p.id}
                    className={`flex cursor-pointer items-center justify-between gap-3 border-l-2 bg-background/50 p-3 transition-colors hover:bg-primary/5 ${
                      isZero ? "border-destructive" : "border-[oklch(0.88_0.13_85)]"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-bold uppercase text-foreground">
                        {p.nome}
                      </div>
                      <div className="text-[10px] font-medium uppercase tracking-tighter text-primary/60">
                        {p.marca} · {p.tamanho} · {p.cor}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div
                        className={`text-xs font-bold ${
                          isZero ? "text-destructive" : "text-[oklch(0.88_0.13_85)]"
                        }`}
                      >
                        {isZero ? "ZERADO" : "BAIXO"}
                      </div>
                      <div className="text-[10px] uppercase text-foreground/40">
                        {String(p.quantidade).padStart(2, "0")} UN
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <Link
            to="/produtos"
            className="mt-6 block w-full border border-primary/20 py-3 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-primary transition-all hover:border-[oklch(0.88_0.13_85)]/50 hover:text-[oklch(0.88_0.13_85)]"
          >
            Ver inventário completo →
          </Link>
        </div>
      </div>

      {/* Decorative footer line */}
      <div className="mt-4 flex items-center gap-4 opacity-20">
        <div className="h-px flex-1 bg-primary" />
        <div className="h-2 w-2 rotate-45 border border-primary" />
        <div className="h-px w-12 bg-primary" />
      </div>
    </div>
  );
}
