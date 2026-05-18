import { AlertTriangle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CATEGORIAS, type Categoria } from "@/lib/types";

export type SortKey = "alertas" | "menor" | "maior" | "nome" | "recentes";

const SORT_LABEL: Record<SortKey, string> = {
  alertas: "Alertas primeiro",
  menor: "Menor estoque",
  maior: "Maior estoque",
  nome: "Nome (A–Z)",
  recentes: "Mais recentes",
};

export function Filters({
  search,
  setSearch,
  categoria,
  setCategoria,
  marca,
  setMarca,
  sort,
  setSort,
  onlyAlerts,
  setOnlyAlerts,
}: {
  search: string;
  setSearch: (v: string) => void;
  categoria: Categoria | "todas";
  setCategoria: (v: Categoria | "todas") => void;
  marca: string;
  setMarca: (v: string) => void;
  sort: SortKey;
  setSort: (v: SortKey) => void;
  onlyAlerts: boolean;
  setOnlyAlerts: (v: boolean) => void;
}) {
  return (
    <div className="grid gap-2">
      <div className="grid gap-2 md:grid-cols-[1fr_180px_180px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoria} onValueChange={(v) => setCategoria(v as Categoria | "todas")}>
          <SelectTrigger>
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas categorias</SelectItem>
            {CATEGORIAS.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Filtrar por marca"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
          <SelectTrigger>
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(SORT_LABEL) as SortKey[]).map((k) => (
              <SelectItem key={k} value={k}>
                {SORT_LABEL[k]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant={onlyAlerts ? "default" : "outline"}
          onClick={() => setOnlyAlerts(!onlyAlerts)}
          className="uppercase tracking-wider"
        >
          <AlertTriangle className="mr-1.5 h-4 w-4" />
          Somente alertas
        </Button>
      </div>
    </div>
  );
}
