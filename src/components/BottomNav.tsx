import { Link } from "@tanstack/react-router";
import { BarChart3, Package, ArrowLeftRight, Plus } from "lucide-react";

const items: { to: "/" | "/produtos" | "/movimentacoes" | "/cadastrar"; label: string; icon: typeof BarChart3; exact?: boolean }[] = [
  { to: "/", label: "Início", icon: BarChart3, exact: true },
  { to: "/produtos", label: "Produtos", icon: Package },
  { to: "/movimentacoes", label: "Movim.", icon: ArrowLeftRight },
  { to: "/cadastrar", label: "Cadastrar", icon: Plus },
];

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur md:hidden">
      <div className="grid grid-cols-4">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              activeOptions={{ exact: it.exact }}
              activeProps={{ className: "text-primary" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium"
            >
              <Icon className="h-5 w-5" />
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}