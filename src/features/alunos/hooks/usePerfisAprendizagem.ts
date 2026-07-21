import { useQuery } from "@tanstack/react-query";
import { referenceService } from "../../turmas/services/referenceService";

// Dado de seed, praticamente estático durante a sessão — cache longo
// (Épico FE-4, tarefa 1).
export function usePerfisAprendizagem() {
  return useQuery({
    queryKey: ["perfis-aprendizagem"],
    queryFn: referenceService.listLearningProfiles,
    staleTime: 30 * 60 * 1000,
  });
}
