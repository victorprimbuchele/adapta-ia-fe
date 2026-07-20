import { ArrowLeft } from "lucide-react";

export function BackBtn({ onClick, label = "Voltar" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 text-muted text-sm mb-6 hover:text-brand transition-colors font-medium"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  );
}
