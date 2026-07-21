import { useMutation, useQueryClient } from "@tanstack/react-query";
import { turmasService } from "../services/turmasService";
import type { UpdateClassPayload } from "../services/turmasService";

export function useUpdateTurma(classId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateClassPayload) => turmasService.updateClass(classId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["turmas"] });
      queryClient.invalidateQueries({ queryKey: ["turma", classId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}
