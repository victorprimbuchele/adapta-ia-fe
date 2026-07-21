import { useMutation, useQueryClient } from "@tanstack/react-query";
import { atividadesService } from "../services/atividadesService";

export function useAdaptHomework(homeworkId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (learningProfileIds?: string[]) =>
      atividadesService.adaptHomework(homeworkId, learningProfileIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homework", homeworkId, "status-adaptacao"] });
    },
  });
}
