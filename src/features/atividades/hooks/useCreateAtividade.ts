import { useMutation, useQueryClient } from "@tanstack/react-query";
import { atividadesService } from "../services/atividadesService";
import type { CreateHomeworkPayload } from "../services/atividadesService";

export function useCreateAtividade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateHomeworkPayload) => atividadesService.createHomework(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}
