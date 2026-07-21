import { useMutation } from "@tanstack/react-query";
import { atividadesService } from "../services/atividadesService";

export function useSendHomework(homeworkId: string) {
  return useMutation({
    mutationFn: () => atividadesService.sendHomework(homeworkId),
  });
}
