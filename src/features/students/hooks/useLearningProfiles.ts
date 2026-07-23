import { useQuery } from "@tanstack/react-query";
import { referenceService } from "../../classes/services/referenceService";

// Dado de seed, praticamente estático durante a sessão — cache longo
// (Épico FE-4, tarefa 1).
export function useLearningProfiles() {
  return useQuery({
    queryKey: ["perfis-aprendizagem"],
    queryFn: referenceService.listLearningProfiles,
    staleTime: 30 * 60 * 1000,
  });
}
