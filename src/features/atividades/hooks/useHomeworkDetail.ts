import { useQuery } from "@tanstack/react-query";
import { atividadesService } from "../services/atividadesService";

export function useHomeworkDetail(homeworkId: string | undefined) {
  return useQuery({
    queryKey: ["homework", homeworkId],
    queryFn: () => atividadesService.getHomeworkDetail(homeworkId as string),
    enabled: Boolean(homeworkId),
  });
}
