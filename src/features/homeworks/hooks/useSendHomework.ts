import { useMutation } from "@tanstack/react-query";
import { homeworksService } from "../services/homeworksService";

export function useSendHomework(homeworkId: string) {
  return useMutation({
    mutationFn: () => homeworksService.sendHomework(homeworkId),
  });
}
