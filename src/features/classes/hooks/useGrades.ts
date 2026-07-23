import { useQuery } from "@tanstack/react-query";
import { referenceService } from "../services/referenceService";

// Dados de seed, praticamente estáticos durante a sessão — cache longo
// (Épico FE-3, tarefa 2). Ordenado por sortOrder (docs/API.md §6.3: "1º ano
// → 9º ano").
export function useGrades() {
  return useQuery({
    queryKey: ["series"],
    queryFn: async () => {
      const grades = await referenceService.listGrades();
      return [...grades].sort((a, b) => a.sortOrder - b.sortOrder);
    },
    staleTime: 30 * 60 * 1000,
  });
}
