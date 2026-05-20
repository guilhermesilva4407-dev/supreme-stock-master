import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { PackagePlus, Sparkles } from "lucide-react";
import { ProductForm } from "@/components/ProductForm";
import { BackupSection } from "@/components/BackupSection";
import { useInventory } from "@/hooks/useInventory";

export const Route = createFileRoute("/cadastrar")({
  head: () => ({
    meta: [
      { title: "Cadastrar Produto — Supreme Multimarcas" },
      { name: "description", content: "Adicione um novo produto ao estoque da Supreme Multimarcas." },
    ],
  }),
  component: CadastrarPage,
});

function CadastrarPage() {
  const { createProduto } = useInventory();
  const navigate = useNavigate();

  return (
    <div className="grid gap-5">
      <header className="animate-fade-in flex flex-col gap-3 border-b border-primary/20 pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-tight text-[oklch(0.88_0.13_85)] md:text-5xl">
            Cadastrar Produto
          </h1>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.25em] text-primary/60">
            Adicione uma nova peça ao inventário
          </p>
        </div>
        <div className="flex items-center gap-2 self-start rounded-full border border-primary/30 bg-card px-3 py-1.5 md:self-auto">
          <Sparkles className="h-3.5 w-3.5 animate-pulse text-[oklch(0.88_0.13_85)]" />
          <span className="text-[10px] font-bold uppercase tracking-tight text-[oklch(0.88_0.13_85)]">
            Novo SKU
          </span>
        </div>
      </header>

      <div
        className="hud-card relative overflow-hidden p-5 transition-all duration-300 hover:border-primary/50"
        style={{ animation: "fade-in 0.5s ease-out both", animationDelay: "80ms" }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.88 0.13 85) 1px, transparent 1px), linear-gradient(90deg, oklch(0.88 0.13 85) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded border border-primary/40 bg-background/60 p-2.5 transition-transform duration-200 hover:scale-110 hover:border-[oklch(0.88_0.13_85)]/60">
              <PackagePlus className="h-5 w-5 text-[oklch(0.88_0.13_85)]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-1 bg-[oklch(0.88_0.13_85)]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60">
                  Novo Produto
                </span>
              </div>
              <h2 className="font-display text-2xl uppercase tracking-tight text-foreground">
                Dados da peça
              </h2>
            </div>
          </div>
          <ProductForm
            submitLabel="Cadastrar"
            onSubmit={(data) => {
              createProduto(data);
              toast.success("Produto cadastrado");
              navigate({ to: "/produtos" });
            }}
          />
        </div>
      </div>

      <div
        className="animate-fade-in"
        style={{ animationDelay: "160ms", animationFillMode: "both" }}
      >
        <BackupSection />
      </div>
    </div>
  );
}