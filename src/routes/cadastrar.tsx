import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-4xl">Cadastrar Produto</h1>
        <p className="text-sm text-muted-foreground">
          Preencha os dados para adicionar uma nova peça ao estoque.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-2xl">Novo produto</CardTitle>
          <CardDescription>Os dados ficam salvos neste dispositivo (localStorage).</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm
            submitLabel="Cadastrar"
            onSubmit={(data) => {
              createProduto(data);
              toast.success("Produto cadastrado");
              navigate({ to: "/produtos" });
            }}
          />
        </CardContent>
      </Card>
      <BackupSection />
    </div>
  );
}