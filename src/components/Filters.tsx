import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIAS, type Categoria } from "@/lib/types";

export function Filters({
  search,
  setSearch,
  categoria,
  setCategoria,
  marca,
  setMarca,
}: {
  search: string;
  setSearch: (v: string) => void;
  categoria: Categoria | "todas";
  setCategoria: (v: Categoria | "todas") => void;
  marca: string;
  setMarca: (v: string) => void;
}) {
  return (
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
  );
}
