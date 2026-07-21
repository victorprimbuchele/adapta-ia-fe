import { useMutation, useQueryClient } from "@tanstack/react-query";
import { turmasService } from "../services/turmasService";
import type { CreateClassPayload } from "../services/turmasService";

export function useCreateTurma() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateClassPayload) => turmasService.createClass(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["turmas"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}
