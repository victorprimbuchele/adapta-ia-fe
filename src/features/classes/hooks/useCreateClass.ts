import { useMutation, useQueryClient } from "@tanstack/react-query";
import { classesService } from "../services/classesService";
import type { CreateClassPayload } from "../services/classesService";

export function useCreateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateClassPayload) => classesService.createClass(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}
