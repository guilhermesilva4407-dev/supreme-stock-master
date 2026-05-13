import { Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { useAlertCount } from "@/hooks/useInventory";
import logo from "@/assets/logo.png";

const links: { to: "/" | "/produtos" | "/movimentacoes" | "/cadastrar"; label: string; exact?: boolean }[] = [
  { to: "/", label: "Dashboard", exact: true },
  { to: "/produtos", label: "Produtos" },
  { to: "/movimentacoes", label: "Movimentações" },
  { to: "/cadastrar", label: "Cadastrar" },
];

export function Header() {
  const alerts = useAlertCount();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Supreme Multimarcas" className="h-10 w-auto md:h-12" />
          <span className="sr-only">Supreme Multimarcas</span>
        </Link>
        <nav className="hidden gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.exact }}
              activeProps={{ className: "bg-primary text-primary-foreground" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
              className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        {alerts > 0 && (
          <Link
            to="/produtos"
            className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            {alerts}
          </Link>
        )}
      </div>
    </header>
  );
}