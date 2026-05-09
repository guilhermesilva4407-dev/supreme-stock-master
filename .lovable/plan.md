## Backup e Restauração de Dados

Adicionar exportação/importação dos dados do localStorage como arquivo JSON, para facilitar migração entre celulares.

### Onde
Nova seção "Backup" dentro da rota **Cadastrar** (ou aba dedicada se preferir), com dois botões grandes mobile-friendly: **Exportar backup** e **Restaurar backup**.

Alternativa: botão de menu no header → Dialog "Backup & Restauração". Vou pela seção visível na rota Cadastrar para ficar acessível com 1 toque.

### Exportar
- Lê `supreme:produtos` e `supreme:movimentacoes` do localStorage
- Gera JSON:
  ```json
  {
    "app": "supreme-multimarcas",
    "version": 1,
    "exported_at": "2026-05-09T...",
    "produtos": [...],
    "movimentacoes": [...]
  }
  ```
- Faz download via `Blob` + `<a download>` com nome `supreme-backup-YYYY-MM-DD.json`
- Toast de sucesso

### Restaurar
- Input `<input type="file" accept="application/json">` escondido + botão visual
- Lê arquivo via `FileReader`, faz `JSON.parse`
- Validação com **zod** (mesmos schemas de Produto/Movimentação) para rejeitar arquivos inválidos
- Verifica `app === "supreme-multimarcas"`
- **AlertDialog de confirmação** antes de aplicar, mostrando: nº de produtos e movimentações que serão importados, avisando que dados atuais serão substituídos
- Opção: **Substituir** (default) ou **Mesclar** (merge por `id`, novos itens adicionados, conflitos prevalece o backup)
- Após confirmar: grava no localStorage e dispara evento custom `supreme:storage-changed` para o `useInventory` recarregar (ou simplesmente `window.location.reload()` para garantir estado limpo)
- Toast de sucesso com contagem importada

### Arquivos
- `src/lib/backup.ts` — `exportBackup()`, `parseBackup(text)`, `applyBackup(data, mode)`, schemas zod
- `src/components/BackupSection.tsx` — UI com os dois botões + AlertDialog
- Atualizar `src/routes/cadastrar.tsx` para incluir `<BackupSection />` abaixo do formulário
- `src/hooks/useInventory.ts` — escutar evento `supreme:storage-changed` para recarregar estado

### Detalhes UX
- Ícones lucide: `Download` (exportar), `Upload` (restaurar)
- Texto explicativo curto: "Salve seus dados em um arquivo para transferir para outro celular."
- Mensagens de erro amigáveis: "Arquivo inválido", "Backup de outro app", etc.
- Tudo em PT-BR

### Fora do escopo
- Backup automático agendado
- Sincronização em nuvem (precisaria de Lovable Cloud)
