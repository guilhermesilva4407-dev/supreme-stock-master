import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
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
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl">Produtos</h1>
          <p className="text-sm text-muted-foreground">
            {ready ? `${filtrados.length} de ${produtos.length} produtos` : "Carregando..."}
          </p>
        </div>
        {alertCount > 0 && (
          <button
            type="button"
            onClick={() => setOnlyAlerts(!onlyAlerts)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
              onlyAlerts
                ? "border-primary bg-primary text-primary-foreground"
                : "border-primary/40 text-primary hover:bg-primary/10"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            {alertCount} {alertCount === 1 ? "alerta" : "alertas"}
          </button>
        )}
      </div>
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
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtrados.map((p) => (
          <ProductCard
            key={p.id}
            produto={p}
            onUpdate={updateProduto}
            onDelete={deleteProduto}
            onMove={registrarMovimentacao}
          />
        ))}
        {ready && filtrados.length === 0 && (
          <p className="col-span-full py-12 text-center text-muted-foreground">
            Nenhum produto encontrado.
          </p>
        )}
      </div>
    </div>
  );
}