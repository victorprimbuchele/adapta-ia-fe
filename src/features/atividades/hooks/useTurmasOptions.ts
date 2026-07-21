import { useQuery } from "@tanstack/react-query";
import { turmasService } from "../../turmas/services/turmasService";

// Select de turma não precisa de alunos/perfis (só id + nome) — hook mais
// leve que useTurmas (que compõe alunos por turma para o Épico FE-3).
export function useTurmasOptions() {
  return useQuery({
    queryKey: ["turmas", "options"],
    queryFn: turmasService.listClasses,
  });
}
