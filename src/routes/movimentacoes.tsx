import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowUpRight,
  Activity,
  Search,
  TrendingDown,
  TrendingUp,
  Layers,
} from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import { Input } from "@/components/ui/input";
import { MOTIVO_LABEL } from "@/lib/types";

type Filter = "todas" | "entrada" | "saida";

export const Route = createFileRoute("/movimentacoes")({
  head: () => ({
    meta: [
      { title: "Movimentações — Supreme Multimarcas" },
      { name: "description", content: "Histórico de entradas e saídas de estoque." },
    ],
  }),
  component: MovimentacoesPage,
});

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `há ${d}d`;
  return new Date(iso).toLocaleDateString("pt-BR");
}

function MovimentacoesPage() {
  const { movimentacoes, ready } = useInventory();
  const [filter, setFilter] = useState<Filter>("todas");
  const [search, setSearch] = useState("");

  const stats = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const today = movimentacoes.filter((m) => new Date(m.data) >= hoje);
    return {
      entradasHoje: today.filter((m) => m.tipo === "entrada").reduce((s, m) => s + m.quantidade, 0),
      saidasHoje: today.filter((m) => m.tipo === "saida").reduce((s, m) => s + m.quantidade, 0),
      total: movimentacoes.length,
    };
  }, [movimentacoes]);

  const filtradas = useMemo(() => {
    return movimentacoes.filter((m) => {
      if (filter !== "todas" && m.tipo !== filter) return false;
      if (search && !m.produto_nome.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [movimentacoes, filter, search]);

  const filters: { key: Filter; label: string; icon: typeof Activity }[] = [
    { key: "todas", label: "Todas", icon: Layers },
    { key: "entrada", label: "Entradas", icon: TrendingUp },
    { key: "saida", label: "Saídas", icon: TrendingDown },
  ];

  return (
    <div className="grid gap-5">
      {/* Header */}
      <header className="animate-fade-in flex flex-col gap-3 border-b border-primary/20 pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-tight text-[oklch(0.88_0.13_85)] md:text-5xl">
            Movimentações
          </h1>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.25em] text-primary/60">
            {ready ? `${filtradas.length} de ${movimentacoes.length} registros` : "Carregando..."}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start rounded-full border border-primary/30 bg-card px-4 py-2 md:self-auto">
          <Activity className="h-3.5 w-3.5 animate-pulse text-[oklch(0.88_0.13_85)]" />
          <span className="text-[10px] font-bold uppercase tracking-tight text-[oklch(0.88_0.13_85)]">
            Histórico Vivo
          </span>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="Entradas hoje"
          value={stats.entradasHoje}
          icon={TrendingUp}
          tone="success"
          delay={0}
        />
        <StatCard
          label="Saídas hoje"
          value={stats.saidasHoje}
          icon={TrendingDown}
          tone="primary"
          delay={80}
        />
        <StatCard
          label="Total"
          value={stats.total}
          icon={Layers}
          tone="muted"
          delay={160}
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar produto..."
            className="h-10 pl-9 transition-shadow focus-visible:shadow-[0_0_0_3px_oklch(0.74_0.13_78/0.25)]"
          />
        </div>
        <div className="flex overflow-hidden rounded-md border border-primary/30 bg-card">
          {filters.map((f) => {
            const Icon = f.icon;
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-200 sm:flex-none ${
                  active
                    ? "bg-gradient-to-r from-primary to-[oklch(0.82_0.13_82)] text-primary-foreground shadow-[0_0_14px_-4px_oklch(0.74_0.13_78/0.7)]"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      {ready && filtradas.length === 0 ? (
        <div className="hud-card animate-fade-in p-10 text-center">
          <Activity className="mx-auto h-8 w-8 text-primary/40" />
          <p className="mt-3 text-sm text-muted-foreground">
            Nenhuma movimentação encontrada.
          </p>
        </div>
      ) : (
        <ol className="relative ml-2 border-l border-primary/20">
          {filtradas.map((m, i) => {
            const isEntrada = m.tipo === "entrada";
            return (
              <li
                key={m.id}
                className="group relative pl-6 pb-4 last:pb-0"
                style={{
                  animation: "fade-in 0.4s ease-out both",
                  animationDelay: `${Math.min(i, 12) * 40}ms`,
                }}
              >
                {/* Dot */}
                <span
                  className={`absolute -left-[7px] top-3 flex h-3.5 w-3.5 items-center justify-center rounded-full ring-4 ring-background transition-transform duration-200 group-hover:scale-125 ${
                    isEntrada
                      ? "bg-[oklch(0.7_0.18_145)] shadow-[0_0_10px_oklch(0.7_0.18_145/0.7)]"
                      : "bg-[oklch(0.88_0.13_85)] shadow-[0_0_10px_oklch(0.88_0.13_85/0.7)]"
                  }`}
                />
                <div className="hud-card overflow-hidden p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_8px_24px_-12px_oklch(0.74_0.13_78/0.5)]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground ${
                            isEntrada ? "bg-[oklch(0.7_0.18_145)]" : "bg-primary"
                          }`}
                        >
                          {isEntrada ? (
                            <ArrowUpRight className="h-3 w-3" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3" />
                          )}
                          {isEntrada ? "Entrada" : "Saída"}
                        </span>
                        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          {MOTIVO_LABEL[m.motivo]}
                        </span>
                      </div>
                      <h3 className="mt-1.5 truncate font-display text-lg uppercase tracking-tight text-foreground">
                        {m.produto_nome}
                      </h3>
                      <p className="text-[10px] uppercase tracking-wider text-primary/50">
                        {formatRelative(m.data)} · {new Date(m.data).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <div
                      className={`shrink-0 text-right font-display text-3xl leading-none italic transition-transform duration-200 group-hover:scale-110 ${
                        isEntrada ? "text-[oklch(0.78_0.18_145)]" : "text-[oklch(0.88_0.13_85)]"
                      }`}
                    >
                      {isEntrada ? "+" : "−"}
                      {m.quantidade}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  delay,
}: {
  label: string;
  value: number;
  icon: typeof Activity;
  tone: "success" | "primary" | "muted";
  delay: number;
}) {
  const toneClasses = {
    success: "text-[oklch(0.78_0.18_145)]",
    primary: "text-[oklch(0.88_0.13_85)]",
    muted: "text-foreground",
  }[tone];
  return (
    <div
      className="hud-card group p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50"
      style={{ animation: "fade-in 0.5s ease-out both", animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary/60">
          {label}
        </span>
        <Icon className={`h-4 w-4 ${toneClasses} transition-transform duration-300 group-hover:scale-110`} />
      </div>
      <div className={`mt-2 font-display text-3xl leading-none italic ${toneClasses}`}>
        {String(value).padStart(2, "0")}
      </div>
    </div>
  );
}