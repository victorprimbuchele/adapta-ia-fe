import { useMutation, useQueryClient } from "@tanstack/react-query";
import { homeworksService } from "../services/homeworksService";
import type { CreateHomeworkPayload } from "../services/homeworksService";

export function useCreateHomework() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateHomeworkPayload) => homeworksService.createHomework(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}
