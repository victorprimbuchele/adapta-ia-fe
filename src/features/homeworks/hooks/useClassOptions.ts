import { useQuery } from "@tanstack/react-query";
import { classesService } from "../../classes/services/classesService";

// Select de turma não precisa de alunos/perfis (só id + nome) — hook mais
// leve que useClasses (que compõe alunos por turma para o Épico FE-3).
export function useClassOptions() {
  return useQuery({
    queryKey: ["classes", "options"],
    queryFn: classesService.listClasses,
  });
}
