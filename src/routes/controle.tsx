import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BarChart3, Boxes, AlertTriangle, TrendingUp, Layers } from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import { getStockStatus, CATEGORIAS, type Categoria } from "@/lib/types";

export const Route = createFileRoute("/controle")({
  head: () => ({
    meta: [
      { title: "Controle Detalhado — Supreme Multimarcas" },
      {
        name: "description",
        content: "Análise detalhada do estoque por categoria, marca e status.",
      },
    ],
  }),
  component: ControlePage,
});

function brl(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function ControlePage() {
  const { produtos, ready } = useInventory();

  const stats = useMemo(() => {
    const byCategoria = CATEGORIAS.map((cat) => {
      const items = produtos.filter((p) => p.categoria === cat);
      const unidades = items.reduce((s, p) => s + p.quantidade, 0);
      const valor = items.reduce((s, p) => s + p.quantidade * p.preco_custo, 0);
      const margem = items.reduce(
        (s, p) => s + p.quantidade * (p.preco_venda - p.preco_custo),
        0,
      );
      const alertas = items.filter((p) => getStockStatus(p) !== "ok").length;
      return { cat, count: items.length, unidades, valor, margem, alertas };
    }).filter((c) => c.count > 0);

    const byMarca: Record<string, { unidades: number; valor: number; count: number }> = {};
    produtos.forEach((p) => {
      const k = p.marca || "Sem marca";
      if (!byMarca[k]) byMarca[k] = { unidades: 0, valor: 0, count: 0 };
      byMarca[k].unidades += p.quantidade;
      byMarca[k].valor += p.quantidade * p.preco_custo;
      byMarca[k].count += 1;
    });
    const marcas = Object.entries(byMarca)
      .map(([nome, v]) => ({ nome, ...v }))
      .sort((a, b) => b.valor - a.valor);

    const totalUn = produtos.reduce((s, p) => s + p.quantidade, 0);
    const totalValor = produtos.reduce((s, p) => s + p.quantidade * p.preco_custo, 0);
    const totalMargem = produtos.reduce(
      (s, p) => s + p.quantidade * (p.preco_venda - p.preco_custo),
      0,
    );
    const zerados = produtos.filter((p) => p.quantidade === 0).length;
    const baixos = produtos.filter((p) => getStockStatus(p) === "baixo").length;
    const ok = produtos.filter((p) => getStockStatus(p) === "ok").length;

    const topEstoque = [...produtos]
      .sort((a, b) => b.quantidade * b.preco_custo - a.quantidade * a.preco_custo)
      .slice(0, 5);

    return {
      byCategoria,
      marcas,
      totalUn,
      totalValor,
      totalMargem,
      zerados,
      baixos,
      ok,
      topEstoque,
    };
  }, [produtos]);

  if (!ready) return <p className="text-muted-foreground">Carregando...</p>;

  const maxValorCat = Math.max(1, ...stats.byCategoria.map((c) => c.valor));

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 border-b border-primary/20 pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <Link
            to="/"
            className="mb-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.25em] text-primary/60 transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3 w-3" /> Voltar ao painel
          </Link>
          <h1 className="font-display text-4xl uppercase tracking-tight text-[oklch(0.88_0.13_85)] md:text-5xl">
            Controle Detalhado
          </h1>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.25em] text-primary/60">
            Análise por categoria, marca e status do inventário
          </p>
        </div>
        <div className="flex items-center gap-2 self-start rounded-full border border-primary/30 bg-card px-4 py-2 md:self-auto">
          <Layers className="h-4 w-4 text-[oklch(0.88_0.13_85)]" />
          <span className="text-[10px] font-bold uppercase tracking-tight text-[oklch(0.88_0.13_85)]">
            {stats.byCategoria.length} categorias ativas
          </span>
        </div>
      </header>

      {/* Status overview */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatusBlock label="Total UN" value={stats.totalUn} icon={Boxes} accent="primary" />
        <StatusBlock label="OK" value={stats.ok} icon={TrendingUp} accent="success" />
        <StatusBlock label="Baixo" value={stats.baixos} icon={AlertTriangle} accent="warning" />
        <StatusBlock label="Zerado" value={stats.zerados} icon={AlertTriangle} accent="danger" />
      </div>

      {/* Breakdown por categoria */}
      <section className="hud-card p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-4 w-1 bg-[oklch(0.88_0.13_85)]" />
            <h2 className="font-display text-lg uppercase tracking-tight">Por categoria</h2>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">
            Valor em estoque
          </span>
        </div>
        <div className="space-y-3">
          {stats.byCategoria.map((c) => {
            const pct = (c.valor / maxValorCat) * 100;
            return (
              <div key={c.cat} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-bold uppercase">{c.cat}</span>
                    <span className="text-[10px] uppercase text-muted-foreground">
                      {c.count} SKUs · {c.unidades} UN
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {c.alertas > 0 && (
                      <span className="rounded border border-destructive/40 px-1.5 py-0.5 text-[10px] font-bold uppercase text-destructive">
                        {c.alertas} alerta{c.alertas > 1 ? "s" : ""}
                      </span>
                    )}
                    <span className="font-display text-base text-[oklch(0.88_0.13_85)]">
                      {brl(c.valor)}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-[oklch(0.88_0.13_85)]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
          {stats.byCategoria.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhum produto cadastrado ainda.</p>
          )}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top estoque por valor */}
        <section className="hud-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-4 w-1 bg-[oklch(0.88_0.13_85)]" />
            <h2 className="font-display text-lg uppercase tracking-tight">
              Top itens por valor
            </h2>
          </div>
          <ul className="space-y-2">
            {stats.topEstoque.map((p, i) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 border-l-2 border-primary/40 bg-background/50 p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="font-display text-xl text-primary/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold uppercase">{p.nome}</div>
                    <div className="text-[10px] uppercase text-muted-foreground">
                      {p.marca} · {p.quantidade} UN
                    </div>
                  </div>
                </div>
                <span className="font-display text-base text-[oklch(0.88_0.13_85)]">
                  {brl(p.quantidade * p.preco_custo)}
                </span>
              </li>
            ))}
            {stats.topEstoque.length === 0 && (
              <p className="text-sm text-muted-foreground">Sem dados.</p>
            )}
          </ul>
        </section>

        {/* Marcas */}
        <section className="hud-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-4 w-1 bg-[oklch(0.88_0.13_85)]" />
            <h2 className="font-display text-lg uppercase tracking-tight">Por marca</h2>
          </div>
          <ul className="space-y-2">
            {stats.marcas.slice(0, 8).map((m) => (
              <li
                key={m.nome}
                className="flex items-center justify-between gap-3 border-b border-border/50 pb-2 last:border-0"
              >
                <div>
                  <div className="text-sm font-bold uppercase">{m.nome}</div>
                  <div className="text-[10px] uppercase text-muted-foreground">
                    {m.count} SKUs · {m.unidades} UN
                  </div>
                </div>
                <span className="font-display text-base text-[oklch(0.88_0.13_85)]">
                  {brl(m.valor)}
                </span>
              </li>
            ))}
            {stats.marcas.length === 0 && (
              <p className="text-sm text-muted-foreground">Sem dados.</p>
            )}
          </ul>
        </section>
      </div>

      {/* Resumo financeiro */}
      <section className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary to-[oklch(0.82_0.13_82)] p-6 text-primary-foreground shadow-[0_0_40px_-10px_oklch(0.74_0.13_78/0.5)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "10px 10px",
          }}
        />
        <div className="relative grid gap-4 md:grid-cols-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">
              Valor total
            </div>
            <div className="mt-1 font-display text-3xl">{brl(stats.totalValor)}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">
              Margem potencial
            </div>
            <div className="mt-1 font-display text-3xl">{brl(stats.totalMargem)}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">
              Unidades em estoque
            </div>
            <div className="mt-1 font-display text-3xl">{stats.totalUn}</div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatusBlock({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: typeof BarChart3;
  accent: "primary" | "success" | "warning" | "danger";
}) {
  const color =
    accent === "danger"
      ? "text-destructive"
      : accent === "warning"
        ? "text-[oklch(0.88_0.13_85)]"
        : accent === "success"
          ? "text-[oklch(0.78_0.18_145)]"
          : "text-primary";
  return (
    <div className="hud-card flex items-center gap-3 p-4">
      <div className="rounded bg-background/60 p-2">
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </div>
        <div className={`font-display text-2xl ${color}`}>
          {String(value).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}