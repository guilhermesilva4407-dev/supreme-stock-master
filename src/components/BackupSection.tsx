import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { applyBackup, exportBackup, parseBackup, type Backup } from "@/lib/backup";

export function BackupSection() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<Backup | null>(null);
  const [mode, setMode] = useState<"substituir" | "mesclar">("substituir");

  const handleExport = () => {
    try { exportBackup(); toast.success("Backup exportado"); }
    catch { toast.error("Não foi possível exportar"); }
  };
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      setPending(parseBackup(text));
    } catch { toast.error("Arquivo inválido ou não compatível"); }
  };
  const confirm = () => {
    if (!pending) return;
    try {
      applyBackup(pending, mode);
      toast.success(`Backup ${mode === "substituir" ? "restaurado" : "mesclado"}: ${pending.produtos.length} produtos, ${pending.movimentacoes.length} movimentações`);
      setPending(null);
    } catch { toast.error("Falha ao aplicar backup"); }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-2xl">Backup & Restauração</CardTitle>
        <CardDescription>Salve seus dados em um arquivo para transferir para outro celular.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={handleExport} className="flex-1" size="lg">
          <Download className="mr-2 h-4 w-4" /> Exportar backup
        </Button>
        <Button onClick={() => fileRef.current?.click()} variant="outline" className="flex-1" size="lg">
          <Upload className="mr-2 h-4 w-4" /> Restaurar backup
        </Button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={handleFile} />
      </CardContent>
      <AlertDialog open={!!pending} onOpenChange={(o) => !o && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restaurar backup?</AlertDialogTitle>
            <AlertDialogDescription>
              {pending ? `Backup de ${new Date(pending.exported_at).toLocaleString("pt-BR")} com ${pending.produtos.length} produtos e ${pending.movimentacoes.length} movimentações.` : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-2">
            <label className="flex cursor-pointer items-start gap-2 rounded-md border border-border p-3 has-[:checked]:border-primary">
              <input type="radio" name="mode" checked={mode === "substituir"} onChange={() => setMode("substituir")} className="mt-1" />
              <div>
                <p className="font-semibold">Substituir</p>
                <p className="text-xs text-muted-foreground">Apaga os dados atuais e usa apenas os do backup.</p>
              </div>
            </label>
            <label className="flex cursor-pointer items-start gap-2 rounded-md border border-border p-3 has-[:checked]:border-primary">
              <input type="radio" name="mode" checked={mode === "mesclar"} onChange={() => setMode("mesclar")} className="mt-1" />
              <div>
                <p className="font-semibold">Mesclar</p>
                <p className="text-xs text-muted-foreground">Mantém dados atuais e adiciona/atualiza com os do backup.</p>
              </div>
            </label>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirm}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
