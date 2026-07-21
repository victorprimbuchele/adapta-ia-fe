import { useMutation, useQueryClient } from "@tanstack/react-query";
import { atividadesService } from "../services/atividadesService";

export function useResendDelivery(deliveryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => atividadesService.resendDelivery(deliveryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["envio", deliveryId] });
    },
  });
}
