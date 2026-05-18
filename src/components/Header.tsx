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
    <header className="sticky top-0 z-40 border-b border-primary/20 bg-background/80 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center md:h-12 md:w-12">
            <img src={logo} alt="Supreme Multimarcas" className="h-full w-full object-contain drop-shadow-[0_0_8px_oklch(0.74_0.13_78/0.5)]" />
          </div>
          <span className="sr-only">Supreme Multimarcas</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.exact }}
              activeProps={{
                className:
                  "text-[oklch(0.88_0.13_85)] border-b border-[oklch(0.88_0.13_85)]",
              }}
              inactiveProps={{
                className:
                  "text-muted-foreground hover:text-foreground border-b border-transparent",
              }}
              className="pb-1 text-xs font-bold uppercase tracking-[0.2em] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        {alerts > 0 ? (
          <Link
            to="/produtos"
            className="flex items-center gap-1.5 rounded-full border border-primary/40 bg-card px-3 py-1.5 text-[10px] font-bold uppercase tracking-tight text-[oklch(0.88_0.13_85)] shadow-[0_0_12px_-4px_oklch(0.74_0.13_78/0.6)]"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>{alerts} Alertas</span>
          </Link>
        ) : (
          <div className="hidden items-center gap-2 rounded-full border border-primary/30 bg-card px-3 py-1.5 md:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.88_0.13_85)] shadow-[0_0_6px_oklch(0.88_0.13_85)]" />
            <span className="text-[10px] font-bold uppercase tracking-tight text-[oklch(0.88_0.13_85)]">
              Online
            </span>
          </div>
        )}
      </div>
    </header>
  );
}