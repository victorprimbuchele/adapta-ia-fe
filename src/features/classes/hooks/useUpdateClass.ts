import { useMutation, useQueryClient } from "@tanstack/react-query";
import { classesService } from "../services/classesService";
import type { UpdateClassPayload } from "../services/classesService";

export function useUpdateClass(classId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateClassPayload) => classesService.updateClass(classId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["class", classId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}
