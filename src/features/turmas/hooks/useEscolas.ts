import { useQuery } from "@tanstack/react-query";
import { referenceService } from "../services/referenceService";

// Dados de seed, praticamente estáticos durante a sessão — cache longo
// (Épico FE-3, tarefa 2).
export function useEscolas() {
  return useQuery({
    queryKey: ["escolas"],
    queryFn: referenceService.listSchools,
    staleTime: 30 * 60 * 1000,
  });
}
