import { useMutation, useQueryClient } from "@tanstack/react-query";
import { homeworksService } from "../services/homeworksService";

export function useAdaptHomework(homeworkId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (learningProfileIds?: string[]) =>
      homeworksService.adaptHomework(homeworkId, learningProfileIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homework", homeworkId, "status-adaptacao"] });
    },
  });
}
