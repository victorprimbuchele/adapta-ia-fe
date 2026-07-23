import { useQuery } from "@tanstack/react-query";
import { homeworksService } from "../services/homeworksService";

const POLL_INTERVAL_MS = 2500;

// Polling do envio (Épico FE-7, tarefa 2). Não há status agregado no
// backend (docs/API.md §9.5) — paramos de repetir quando nenhum
// destinatário está mais "pendente".
export function useDeliveryStatus(deliveryId: string | undefined) {
  return useQuery({
    queryKey: ["envio", deliveryId],
    queryFn: () => homeworksService.getDelivery(deliveryId as string),
    enabled: Boolean(deliveryId),
    refetchInterval: (query) => {
      const recipients = query.state.data?.recipients;
      const stillSending = recipients?.some((r) => r.status === "pendente") ?? true;
      return stillSending ? POLL_INTERVAL_MS : false;
    },
  });
}
