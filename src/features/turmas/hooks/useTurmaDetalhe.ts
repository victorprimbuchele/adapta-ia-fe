import { useQuery } from "@tanstack/react-query";
import { turmasService } from "../services/turmasService";

// GET /turmas/:id sempre traz `students: []` (docs/API.md §9.4) — a lista
// real de alunos vem de GET /turmas/:id/alunos, buscada em paralelo aqui.
export function useTurmaDetalhe(classId: string | undefined) {
  const turmaQuery = useQuery({
    queryKey: ["turma", classId],
    queryFn: () => turmasService.getClassDetail(classId as string),
    enabled: Boolean(classId),
  });

  const alunosQuery = useQuery({
    queryKey: ["turma", classId, "alunos"],
    queryFn: () => turmasService.listClassStudents(classId as string),
    enabled: Boolean(classId),
  });

  return {
    turma: turmaQuery.data,
    alunos: alunosQuery.data,
    isPending: turmaQuery.isPending || alunosQuery.isPending,
    isError: turmaQuery.isError || alunosQuery.isError,
  };
}
