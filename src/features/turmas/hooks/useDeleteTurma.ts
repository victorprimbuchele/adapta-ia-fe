import { useMutation, useQueryClient } from "@tanstack/react-query";
import { turmasService } from "../services/turmasService";

export function useDeleteTurma() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (classId: string) => turmasService.deleteClass(classId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["turmas"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}
