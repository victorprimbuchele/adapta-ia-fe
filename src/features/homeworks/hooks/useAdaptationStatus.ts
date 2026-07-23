import { useQuery } from "@tanstack/react-query";
import { homeworksService } from "../services/homeworksService";

const POLL_INTERVAL_MS = 2500;

// Polling do processamento assíncrono (Épico FE-6, tarefa 2). Para de
// repetir assim que o status agregado sai de pendente/processando — depois
// disso só muda por ação do professor (retry).
export function useAdaptationStatus(homeworkId: string | undefined) {
  return useQuery({
    queryKey: ["homework", homeworkId, "status-adaptacao"],
    queryFn: () => homeworksService.getAdaptationStatus(homeworkId as string),
    enabled: Boolean(homeworkId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "pendente" || status === "processando" ? POLL_INTERVAL_MS : false;
    },
  });
}
