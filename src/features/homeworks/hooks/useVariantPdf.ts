import { useState } from "react";
import { homeworksService } from "../services/homeworksService";

// Busca o PDF sob demanda (não no mount, como o áudio) porque é um binário
// maior e o professor pode nunca clicar — abre em nova aba via Blob URL
// (docs/API.md §6.3-PDF; tarefas_tecnicas_frontend.md FE-6.6).
export function useVariantPdf(variantHomeworkId: string) {
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  const openPdf = async () => {
    setIsPending(true);
    setIsError(false);
    try {
      const blob = await homeworksService.getHomeworkVariantPdf(variantHomeworkId);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      setIsError(true);
    } finally {
      setIsPending(false);
    }
  };

  return { openPdf, isPending, isError };
}
