import { useMemo, useState } from "react";
import { AlertTriangle, Package, Sparkles } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { useInventory } from "@/hooks/useInventory";
import { ProductCard } from "@/components/ProductCard";
import { Filters, type SortKey } from "@/components/Filters";
import { getStockStatus, type Categoria } from "@/lib/types";

export const Route = createFileRoute("/produtos")({
  head: () => ({
    meta: [
      { title: "Produtos — Supreme Multimarcas" },
      { name: "description", content: "Catálogo de produtos em estoque com filtros e busca." },
    ],
  }),
  component: ProdutosPage,
});

function ProdutosPage() {
  const { produtos, ready, updateProduto, deleteProduto, registrarMovimentacao } = useInventory();
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState<Categoria | "todas">("todas");
  const [marca, setMarca] = useState("");
  const [sort, setSort] = useState<SortKey>("alertas");
  const [onlyAlerts, setOnlyAlerts] = useState(false);

  const alertCount = useMemo(
    () => produtos.filter((p) => getStockStatus(p) !== "ok").length,
    [produtos],
  );

  const filtrados = useMemo(() => {
    const list = produtos.filter((p) => {
      if (categoria !== "todas" && p.categoria !== categoria) return false;
      if (marca && !p.marca.toLowerCase().includes(marca.toLowerCase())) return false;
      if (search && !p.nome.toLowerCase().includes(search.toLowerCase())) return false;
      if (onlyAlerts && getStockStatus(p) === "ok") return false;
      return true;
    });
    const rank = { zerado: 0, baixo: 1, ok: 2 } as const;
    const sorted = [...list];
    switch (sort) {
      case "alertas":
        sorted.sort((a, b) => {
          const r = rank[getStockStatus(a)] - rank[getStockStatus(b)];
          return r !== 0 ? r : a.nome.localeCompare(b.nome);
        });
        break;
      case "menor":
        sorted.sort((a, b) => a.quantidade - b.quantidade);
        break;
      case "maior":
        sorted.sort((a, b) => b.quantidade - a.quantidade);
        break;
      case "nome":
        sorted.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      case "recentes":
        sorted.sort((a, b) => b.criado_em.localeCompare(a.criado_em));
        break;
    }
    return sorted;
  }, [produtos, search, categoria, marca, onlyAlerts, sort]);

  return (
    <div className="grid gap-5">
      <header className="animate-fade-in flex flex-col gap-3 border-b border-primary/20 pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-tight text-[oklch(0.88_0.13_85)] md:text-5xl">
            Produtos
          </h1>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.25em] text-primary/60">
            {ready
              ? `${filtrados.length} de ${produtos.length} no catálogo`
              : "Carregando..."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-card px-3 py-1.5">
            <Package className="h-3.5 w-3.5 text-[oklch(0.88_0.13_85)]" />
            <span className="text-[10px] font-bold uppercase tracking-tight text-[oklch(0.88_0.13_85)]">
              Catálogo
            </span>
          </div>
          {alertCount > 0 && (
            <button
              type="button"
              onClick={() => setOnlyAlerts(!onlyAlerts)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 ${
                onlyAlerts
                  ? "border-primary bg-gradient-to-r from-primary to-[oklch(0.82_0.13_82)] text-primary-foreground shadow-[0_0_14px_-4px_oklch(0.74_0.13_78/0.7)]"
                  : "border-primary/40 text-primary hover:bg-primary/10"
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              {alertCount} {alertCount === 1 ? "alerta" : "alertas"}
            </button>
          )}
        </div>
      </header>
      <div
        className="animate-fade-in"
        style={{ animationDelay: "60ms", animationFillMode: "both" }}
      >
      <Filters
        search={search}
        setSearch={setSearch}
        categoria={categoria}
        setCategoria={setCategoria}
        marca={marca}
        setMarca={setMarca}
        sort={sort}
        setSort={setSort}
        onlyAlerts={onlyAlerts}
        setOnlyAlerts={setOnlyAlerts}
      />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtrados.map((p, i) => (
          <div
            key={p.id}
            className="transition-transform duration-200 hover:-translate-y-1"
            style={{
              animation: "fade-in 0.4s ease-out both",
              animationDelay: `${Math.min(i, 12) * 40}ms`,
            }}
          >
            <ProductCard
              produto={p}
              onUpdate={updateProduto}
              onDelete={deleteProduto}
              onMove={registrarMovimentacao}
            />
          </div>
        ))}
        {ready && filtrados.length === 0 && (
          <div className="hud-card animate-fade-in col-span-full p-10 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-primary/40" />
            <p className="mt-3 text-sm text-muted-foreground">
              Nenhum produto encontrado com esses filtros.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}