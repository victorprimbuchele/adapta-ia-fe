import { useQuery } from "@tanstack/react-query";
import { homeworksService } from "../services/homeworksService";

export function useHomeworkDetail(homeworkId: string | undefined) {
  return useQuery({
    queryKey: ["homework", homeworkId],
    queryFn: () => homeworksService.getHomeworkDetail(homeworkId as string),
    enabled: Boolean(homeworkId),
  });
}
