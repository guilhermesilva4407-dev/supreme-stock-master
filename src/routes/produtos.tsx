import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useInventory } from "@/hooks/useInventory";
import { ProductCard } from "@/components/ProductCard";
import { Filters } from "@/components/Filters";
import type { Categoria } from "@/lib/types";

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

  const filtrados = useMemo(() => {
    return produtos.filter((p) => {
      if (categoria !== "todas" && p.categoria !== categoria) return false;
      if (marca && !p.marca.toLowerCase().includes(marca.toLowerCase())) return false;
      if (search && !p.nome.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [produtos, search, categoria, marca]);

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="font-display text-4xl">Produtos</h1>
        <p className="text-sm text-muted-foreground">
          {ready ? `${filtrados.length} de ${produtos.length} produtos` : "Carregando..."}
        </p>
      </div>
      <Filters
        search={search}
        setSearch={setSearch}
        categoria={categoria}
        setCategoria={setCategoria}
        marca={marca}
        setMarca={setMarca}
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