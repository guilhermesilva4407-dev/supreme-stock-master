import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BarChart3,
  Boxes,
  AlertTriangle,
  TrendingUp,
  Layers,
  PackagePlus,
  ClipboardCheck,
  Check,
  Search,
  Plus,
  Minus,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useInventory } from "@/hooks/useInventory";
import { getStockStatus, CATEGORIAS, type Produto } from "@/lib/types";

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
  const { produtos, ready, registrarMovimentacao, updateProduto } = useInventory();
  const [tab, setTab] = useState<"reposicao" | "contagem" | "analise">("reposicao");

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

  const tabs: { key: typeof tab; label: string; icon: typeof Boxes; count?: number }[] = [
    {
      key: "reposicao",
      label: "Reposição",
      icon: PackagePlus,
      count: stats.baixos + stats.zerados,
    },
    { key: "contagem", label: "Contagem", icon: ClipboardCheck, count: produtos.length },
    { key: "analise", label: "Análise", icon: BarChart3 },
  ];

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
            Centro de Controle
          </h1>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.25em] text-primary/60">
            Reposição · Contagem · Análise do inventário
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

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-md border border-primary/20 bg-card p-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-sm px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                active
                  ? "bg-gradient-to-r from-primary to-[oklch(0.82_0.13_82)] text-primary-foreground shadow-[0_0_14px_-4px_oklch(0.74_0.13_78/0.7)]"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{t.label}</span>
              {typeof t.count === "number" && (
                <span
                  className={`ml-1 rounded-full px-1.5 text-[9px] ${
                    active ? "bg-black/30" : "bg-primary/15 text-primary"
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {tab === "reposicao" && (
        <ReposicaoPanel
          produtos={produtos}
          onRepor={(p, qtd) => {
            try {
              registrarMovimentacao({
                produto_id: p.id,
                tipo: "entrada",
                quantidade: qtd,
                motivo: "fornecedor",
              });
              toast.success(`+${qtd} un. em ${p.nome}`);
            } catch (e) {
              toast.error((e as Error).message);
            }
          }}
        />
      )}

      {tab === "contagem" && (
        <ContagemPanel
          produtos={produtos}
          onSave={(p, real) => {
            if (real === p.quantidade) {
              toast.info("Sem mudança");
              return;
            }
            const diff = real - p.quantidade;
            try {
              registrarMovimentacao({
                produto_id: p.id,
                tipo: diff > 0 ? "entrada" : "saida",
                quantidade: Math.abs(diff),
                motivo: diff > 0 ? "fornecedor" : "perda",
              });
              toast.success(
                `${p.nome}: ${p.quantidade} → ${real} (${diff > 0 ? "+" : ""}${diff})`,
              );
            } catch (e) {
              // fallback to direct update if movimentação would fail
              updateProduto(p.id, { quantidade: real });
              toast.success(`${p.nome} atualizado para ${real}`);
              console.warn(e);
            }
          }}
        />
      )}

      {tab === "analise" && (
        <AnalisePanel stats={stats} maxValorCat={maxValorCat} />
      )}
    </div>
  );
}

/* ============== Reposição Panel ============== */
function ReposicaoPanel({
  produtos,
  onRepor,
}: {
  produtos: Produto[];
  onRepor: (p: Produto, qtd: number) => void;
}) {
  const alertas = useMemo(
    () =>
      produtos
        .filter((p) => getStockStatus(p) !== "ok")
        .sort((a, b) => {
          const r = (a.quantidade === 0 ? 0 : 1) - (b.quantidade === 0 ? 0 : 1);
          return r !== 0 ? r : a.nome.localeCompare(b.nome);
        }),
    [produtos],
  );

  return (
    <section className="hud-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-4 w-1 bg-[oklch(0.88_0.13_85)]" />
          <h2 className="font-display text-lg uppercase tracking-tight">
            Fila de reposição
          </h2>
        </div>
        <span className="rounded border border-primary/40 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
          {alertas.length} item{alertas.length !== 1 ? "s" : ""}
        </span>
      </div>

      {alertas.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <TrendingUp className="h-8 w-8 text-[oklch(0.78_0.18_145)]" />
          <p className="font-display text-xl uppercase text-[oklch(0.78_0.18_145)]">
            Tudo abastecido
          </p>
          <p className="text-xs text-muted-foreground">
            Nenhum produto precisa de reposição agora.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {alertas.map((p) => (
            <ReporRow key={p.id} produto={p} onRepor={onRepor} />
          ))}
        </ul>
      )}
    </section>
  );
}

function ReporRow({
  produto,
  onRepor,
}: {
  produto: Produto;
  onRepor: (p: Produto, qtd: number) => void;
}) {
  const [custom, setCustom] = useState<number>(produto.estoque_minimo * 2 || 5);
  const isZero = produto.quantidade === 0;
  const sugerido = Math.max(produto.estoque_minimo * 2 - produto.quantidade, 1);

  return (
    <li
      className={`overflow-hidden rounded border-l-2 bg-background/50 ${
        isZero ? "border-destructive" : "border-[oklch(0.88_0.13_85)]"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 p-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-bold uppercase">{produto.nome}</span>
            <span
              className={`shrink-0 rounded-sm border px-1.5 py-0.5 text-[9px] font-bold uppercase italic tracking-tighter ${
                isZero
                  ? "border-red-500/50 bg-red-950/40 text-red-400"
                  : "border-yellow-500/50 bg-yellow-500/10 text-yellow-400"
              }`}
            >
              {isZero ? "Zerado" : "Baixo"}
            </span>
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {produto.marca} · {produto.cor} · Tam {produto.tamanho} · Atual{" "}
            <span className="font-bold text-foreground">{produto.quantidade}</span>{" "}
            / mín {produto.estoque_minimo}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 border-t border-primary/10 bg-black/40 p-2">
        {[1, 5, 10, sugerido].map((n, i) => (
          <button
            key={`${n}-${i}`}
            type="button"
            onClick={() => onRepor(produto, n)}
            className="rounded-sm border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          >
            +{n}
            {i === 3 && (
              <span className="ml-1 text-[8px] opacity-70">sug.</span>
            )}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1">
          <Input
            type="number"
            min={1}
            value={custom}
            onChange={(e) => setCustom(parseInt(e.target.value) || 0)}
            className="h-7 w-16 border-primary/30 bg-black text-center text-xs"
            aria-label="Qtd personalizada"
          />
          <button
            type="button"
            onClick={() => custom > 0 && onRepor(produto, custom)}
            className="flex h-7 items-center gap-1 rounded-sm bg-gradient-to-r from-primary to-[oklch(0.82_0.13_82)] px-2.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-[0_0_10px_-4px_oklch(0.74_0.13_78/0.6)]"
          >
            <Plus className="h-3 w-3" /> Repor
          </button>
        </div>
      </div>
    </li>
  );
}

/* ============== Contagem Panel ============== */
function ContagemPanel({
  produtos,
  onSave,
}: {
  produtos: Produto[];
  onSave: (p: Produto, real: number) => void;
}) {
  const [search, setSearch] = useState("");
  const [counts, setCounts] = useState<Record<string, number>>({});

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    return produtos
      .filter((p) => !q || p.nome.toLowerCase().includes(q) || p.marca.toLowerCase().includes(q))
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }, [produtos, search]);

  return (
    <section className="hud-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-4 w-1 bg-[oklch(0.88_0.13_85)]" />
          <h2 className="font-display text-lg uppercase tracking-tight">
            Contagem física
          </h2>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">
          Ajuste e confirme
        </span>
      </div>
      <p className="mb-3 text-[11px] text-muted-foreground">
        Conte fisicamente e registre o número real. A diferença vira entrada (fornecedor) ou saída (perda) no histórico.
      </p>
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar produto ou marca..."
          className="h-9 pl-9"
        />
      </div>
      {list.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Nenhum produto encontrado.
        </p>
      ) : (
        <ul className="divide-y divide-primary/10">
          {list.map((p) => {
            const valor = counts[p.id];
            const real = valor === undefined ? p.quantidade : valor;
            const diff = real - p.quantidade;
            const dirty = diff !== 0;
            return (
              <li key={p.id} className="flex items-center gap-2 py-2">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold uppercase">{p.nome}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {p.marca} · sistema:{" "}
                    <span className="font-bold text-foreground">{p.quantidade}</span>
                    {dirty && (
                      <span
                        className={`ml-2 font-bold ${
                          diff > 0 ? "text-[oklch(0.78_0.18_145)]" : "text-red-400"
                        }`}
                      >
                        ({diff > 0 ? "+" : ""}
                        {diff})
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setCounts((c) => ({ ...c, [p.id]: Math.max(0, real - 1) }))
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-sm border border-primary/30 text-primary hover:bg-primary/10"
                    aria-label="Diminuir"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <Input
                    type="number"
                    min={0}
                    value={real}
                    onChange={(e) =>
                      setCounts((c) => ({
                        ...c,
                        [p.id]: Math.max(0, parseInt(e.target.value) || 0),
                      }))
                    }
                    className="h-8 w-16 border-primary/30 bg-black text-center font-display text-base"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setCounts((c) => ({ ...c, [p.id]: real + 1 }))
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-sm border border-primary/30 text-primary hover:bg-primary/10"
                    aria-label="Aumentar"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={!dirty}
                    onClick={() => {
                      onSave(p, real);
                      setCounts((c) => {
                        const next = { ...c };
                        delete next[p.id];
                        return next;
                      });
                    }}
                    className={`flex h-8 items-center gap-1 rounded-sm px-2.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
                      dirty
                        ? "bg-gradient-to-r from-primary to-[oklch(0.82_0.13_82)] text-primary-foreground shadow-[0_0_10px_-4px_oklch(0.74_0.13_78/0.6)]"
                        : "border border-primary/20 text-muted-foreground"
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/* ============== Análise Panel ============== */
function AnalisePanel({
  stats,
  maxValorCat,
}: {
  stats: {
    byCategoria: { cat: string; count: number; unidades: number; valor: number; margem: number; alertas: number }[];
    marcas: { nome: string; unidades: number; valor: number; count: number }[];
    totalUn: number;
    totalValor: number;
    totalMargem: number;
    topEstoque: Produto[];
  };
  maxValorCat: number;
}) {
  return (
    <div className="flex flex-col gap-4">
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