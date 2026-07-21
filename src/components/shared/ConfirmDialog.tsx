import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  confirmingLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  errorMessage?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

// Modal de confirmação genérico (Épico FE-8, tarefa 3): qualquer ação
// destrutiva (remover aluno, turma, etc.) deve pedir confirmação antes de
// disparar a chamada. Implementado sem depender de Radix — o projeto ainda
// não tem essa dependência e o caso de uso aqui é simples.
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  confirmingLabel = confirmLabel,
  cancelLabel = "Cancelar",
  isConfirming = false,
  errorMessage,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isConfirming) {
        onCancel();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, isConfirming, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => !isConfirming && onCancel()}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-dialog-title" className="text-lg font-bold text-ink font-heading">
          {title}
        </h2>
        <p id="confirm-dialog-description" className="mt-2 text-sm text-muted">
          {description}
        </p>

        {errorMessage ? (
          <p role="alert" className="mt-3 text-sm font-medium text-red-600">
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isConfirming}
            className="flex-1 py-2.5 rounded-xl border border-border-input text-ink text-sm font-bold hover:bg-bg-soft transition-colors disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isConfirming ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isConfirming ? confirmingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
