import { useMutation, useQueryClient } from "@tanstack/react-query";
import { homeworksService } from "../services/homeworksService";

export function useResendDelivery(deliveryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => homeworksService.resendDelivery(deliveryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["envio", deliveryId] });
    },
  });
}
